// src/app/(admin)/admin/events/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { randomUUID } from 'crypto';

export type ActionState = { 
    message: string | null; 
    errors?: {
        title?: string[];
        date?: string[];
    }; 
    success: boolean; 
};

const EventSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title cannot be empty." }),
    description: z.string().optional(),
    date: z.string().min(1, { message: "Date is required." }),
    location: z.string().optional(),
    category: z.string().optional(),
    image_url: z.string().optional(),
    image_file: z.instanceof(File).optional(),
    max_attendees: z.coerce.number().min(0).optional(),
    registration_type: z.enum(['none', 'external_link', 'internal_form']),
    registration_link: z.string().optional(),
    registration_deadline: z.string().optional(),
    event_fee: z.coerce.number().min(0).optional(),
    event_fee_student: z.coerce.number().min(0).optional(),
    event_fee_alumni: z.coerce.number().min(0).optional(),
    event_fee_non_vet: z.coerce.number().min(0).optional(),
    event_fee_other: z.coerce.number().min(0).optional(),
    internal_form_schema: z.string().optional(),
});

export async function upsertEvent(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    console.log("--- [SERVER-SIDE] upsertEvent Action Started ---");
    
    console.log("Received FormData entries:");
    // --- FIX: Use 'const' instead of 'let' for non-reassigned variables ---
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    const supabase = createClient();
    const supabaseAdmin = createSupabaseAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { message: 'Unauthorized', success: false, errors: {} };
    }
    
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
    const userRole = roleData?.role || 'member';

    if (userRole !== 'admin' && userRole !== 'super_admin') {
        return { message: 'Unauthorized', success: false, errors: {} };
    }
    
    const validatedFields = EventSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        console.error("[SERVER FAIL] Validation failed:", validatedFields.error.flatten().fieldErrors);
        return { 
            errors: validatedFields.error.flatten().fieldErrors, 
            message: 'Validation failed. Please check the form.', 
            success: false 
        };
    }
    
    console.log("[SERVER INFO] Validation successful. Data:", validatedFields.data);

    const { id, image_file, ...eventData } = validatedFields.data;
    let finalImageUrl = eventData.image_url;

    if (image_file && image_file.size > 0) {
        const fileExtension = image_file.name.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from('event-images')
            .upload(fileName, image_file);

        if (uploadError) {
            console.error("[SERVER FAIL] Supabase Storage Error:", uploadError);
            return { message: `Storage Error: ${uploadError.message}`, success: false, errors: {} };
        }
        const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
    }

const payload = { id, ...eventData, image_url: finalImageUrl } as Record<string, unknown>;
    ['event_fee','event_fee_student','event_fee_alumni','event_fee_non_vet','event_fee_other'].forEach(k => {
        if (payload[k] !== undefined && payload[k] !== null && payload[k] !== '') {
            payload[k] = Number(payload[k] as number);
        } else {
            delete payload[k];
        }
    });
    if (typeof payload['internal_form_schema'] === 'string') {
        try { payload['internal_form_schema'] = JSON.parse(payload['internal_form_schema'] as string); } catch { payload['internal_form_schema'] = []; }
    }

    const { data: dbData, error: dbError } = await supabase
        .from('events')
        .upsert(payload)
        .select();

    if (dbError) {
        console.error("[SERVER FAIL] Supabase Database Error:", dbError);
        return { message: `Database Error: ${dbError.message}.`, success: false, errors: {} };
    }

    console.log("[SERVER SUCCESS] Event saved to database:", dbData);
    
    revalidatePath('/admin');
    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/');
    if (id) { 
        revalidatePath(`/admin/events/edit/${id}`);
        revalidatePath(`/events/${id}`);
    }
    
    return { success: true, message: id ? 'Event updated successfully!' : 'Event created successfully!', errors: {} };
}

export async function deleteEvent(eventId: number): Promise<ActionState> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user?.id || '').single();
    if (roleData?.role !== 'admin' && roleData?.role !== 'super_admin') {
        return { message: 'Unauthorized', success: false };
    }

    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
        console.error("Delete Event Error:", error);
        return { message: `Failed to delete event: ${error.message}`, success: false };
    }

    revalidatePath('/admin/events');
    revalidatePath('/admin');
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    revalidatePath('/');
    
    return { success: true, message: 'Event deleted successfully.' };
}