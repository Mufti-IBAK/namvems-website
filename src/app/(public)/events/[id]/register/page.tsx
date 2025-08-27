'use client'

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Event } from '@/lib/types/event';

export default function RegisterEventPage() {
    const { user, loading: authLoading } = useAuth();
    const supabase = createClient();
    const params = useParams();
    const router = useRouter();
    const eventId = params.id;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkRegistration = useCallback(async (currentUserId: string) => {
        const { data, error } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', currentUserId)
            .maybeSingle();
        if (data) setIsRegistered(true);
    }, [supabase, eventId]);

    const fetchEvent = useCallback(async () => {
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (error) {
            setError("Event not found or an error occurred.");
            console.error(error);
        } else {
            setEvent(data as Event);
            if (user) checkRegistration(user.id);
        }
        setLoading(false);
    }, [supabase, eventId, user, checkRegistration]);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push(`/login?redirect=/events/${eventId}/register`);
            } else {
                fetchEvent();
            }
        }
    }, [user, authLoading, router, eventId, fetchEvent]);

    const handleRegister = async () => {
        if (!user || !event) return;
        setIsSubmitting(true);
        setError(null);

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        const { error } = await supabase.from('event_registrations').insert({
            event_id: event.id,
            user_id: user.id,
            full_name: profile?.full_name,
            university: profile?.university,
            email: user.email,
            level: profile?.level_of_study,
        });

        if (error) {
            setError(error.code === '23505' ? 'You are already registered for this event.' : 'Registration failed. Please try again.');
        } else {
            setIsRegistered(true);
        }
        setIsSubmitting(false);
    };

    if (loading || authLoading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!event) return <div className="text-center py-20">Event not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600 mb-6">Confirm your registration</p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                {isRegistered ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">You are Registered!</h2>
                        <p className="text-gray-700 mb-6">Thank you for registering for this event. We look forward to seeing you there.</p>
                        <Link href="/events" className="text-primary hover:underline">Back to Events</Link>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Registration Details</h3>
                        <div className="space-y-3 text-gray-700">
                            <p><strong>Name:</strong> {user?.user_metadata.full_name || user?.email}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Event:</strong> {event.title}</p>
                            <p><strong>Date:</strong> {new Date(event.date as string).toLocaleString()}</p>
                        </div>
                        <div className="border-t my-6"></div>
                        <button 
                            onClick={handleRegister} 
                            disabled={isSubmitting}
                            className="w-full bg-primary text-black font-bold py-3 px-6 rounded-lg transition hover:bg-yellow-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm Registration'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}