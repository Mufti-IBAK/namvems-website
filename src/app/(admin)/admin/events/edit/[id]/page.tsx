// src/app/(admin)/admin/events/edit/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import EventForm from '../../EventForm';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';

async function getEventById(id: number) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
    if (roleData?.role !== 'admin' && roleData?.role !== 'super_admin') {
        redirect('/admin');
    }

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Failed to fetch event for editing:", error);
        notFound();
    }
    return data;
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventId = Number(id);
    if (isNaN(eventId)) {
        notFound();
    }
    
    const event = await getEventById(eventId);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FaEdit /> Edit Event
                </h1>
                {/* --- FIX: The href now correctly points to the admin events list --- */}
                <Link href="/admin/events" className="btn-ghost">
                    Back to Events List
                </Link>
            </div>
            
            <EventForm event={event} />
        </div>
    );
}