// src/app/(public)/events/[id]/register/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { sendEventRegistrationEmail } from '@/lib/services/emailService';

export type RegistrationActionState = { 
    message: string | null; 
    errors?: {
        full_name?: string[];
        email?: string[];
        phone_number?: string[];
        university?: string[];
        level_of_study?: string[];
    }; 
    success: boolean; 
};

const RegistrationSchema = z.object({
    event_id: z.coerce.number(),
    full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone_number: z.string().optional(),
    university: z.string().optional(),
    level_of_study: z.string().optional(),
    additional_info: z.string().optional(),
});

export async function registerForEvent(prevState: RegistrationActionState, formData: FormData): Promise<RegistrationActionState> {
    console.log("--- [SERVER-SIDE] registerForEvent Action Started ---");
    
    // Log all form data for debugging
    console.log("Form data received:");
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    const supabase = createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { message: 'You must be logged in to register for events', success: false, errors: {} };
    }

    // Validate form data
    const validatedFields = RegistrationSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
        return { 
            errors: validatedFields.error.flatten().fieldErrors, 
            message: 'Validation failed. Please check the form.', 
            success: false 
        };
    }

    const { event_id, ...registrationData } = validatedFields.data;

    try {
        // Check if event exists and is still accepting registrations
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('id, title, description, date, location, registration_deadline, registration_type, max_attendees')
            .eq('id', event_id)
            .single();

        if (eventError || !event) {
            return { message: 'Event not found', success: false, errors: {} };
        }

        // Check if event has passed
        const eventDate = new Date(event.date);
        if (eventDate < new Date()) {
            return { message: 'Registration is closed - this event has already passed', success: false, errors: {} };
        }

        // Check if registration deadline has passed
        if (event.registration_deadline) {
            const registrationDeadline = new Date(event.registration_deadline);
            if (registrationDeadline < new Date()) {
                return { message: 'Registration deadline has passed', success: false, errors: {} };
            }
        }

        // Check if registration type allows internal forms
        if (event.registration_type !== 'internal_form') {
            return { message: 'This event does not accept internal registrations', success: false, errors: {} };
        }

        // Check if user is already registered (by email address)
        const { data: existingRegistration, error: checkError } = await supabase
            .from('event_registrations')
            .select('id, email')
            .eq('event_id', event_id)
            .eq('email', registrationData.email)
            .maybeSingle();

        console.log("Checking for existing registration with email:", registrationData.email, "for event:", event_id);
        
        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Error checking existing registration:", checkError);
            return { message: 'Database error occurred', success: false, errors: {} };
        }

        if (existingRegistration) {
            console.log("Found existing registration:", existingRegistration);
            return { message: `You are already registered for this event with email: ${registrationData.email}`, success: false, errors: {} };
        }
        
        console.log("No existing registration found, proceeding with registration");

        // Check if event is full (if max_attendees is set)
        if (event.max_attendees && event.max_attendees > 0) {
            const { count: registrationCount, error: countError } = await supabase
                .from('event_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', event_id);

            if (countError) {
                console.error("Error checking registration count:", countError);
                // Continue anyway, don't block registration
            } else if (registrationCount && registrationCount >= event.max_attendees) {
                return { message: 'This event is full', success: false, errors: {} };
            }
        }

        // Create registration record
        const insertData = {
            event_id,
            user_id: user.id,
            ...registrationData
        };
        
        console.log("About to insert registration data:", insertData);
        
        const { data: insertedRegistration, error: insertError } = await supabase
            .from('event_registrations')
            .insert(insertData)
            .select()
            .single();

        if (insertError) {
            console.error("Database Error:", insertError);
            console.error("Failed data:", { event_id, user_id: user.id, ...registrationData });
            return { message: `Registration failed: ${insertError.message}`, success: false, errors: {} };
        }

        console.log("Registration successful:", insertedRegistration);

        // Send confirmation email
        try {
            console.log("About to send confirmation email to:", registrationData.email);
            const emailResult = await sendEventRegistrationEmail({
                recipientEmail: registrationData.email,
                recipientName: registrationData.full_name,
                eventTitle: event.title,
                eventDate: event.date,
                eventLocation: event.location || undefined,
                eventDescription: event.description || undefined,
            });
            console.log("Registration confirmation email sent successfully:", emailResult);
        } catch (emailError) {
            console.error("Failed to send registration confirmation email:");
            console.error("Email error details:", emailError);
            console.error("Email error message:", emailError?.message);
            console.error("Full error object:", JSON.stringify(emailError, null, 2));
            // Don't fail the registration if email fails
        }

        // Revalidate relevant paths
        revalidatePath(`/events/${event_id}`);
        revalidatePath('/events');
        revalidatePath('/dashboard');

        return { 
            success: true, 
            message: `Successfully registered for ${event.title}!`, 
            errors: {} 
        };

    } catch (error) {
        console.error("Unexpected error during registration:", error);
        return { message: 'An unexpected error occurred. Please try again.', success: false, errors: {} };
    }
}
