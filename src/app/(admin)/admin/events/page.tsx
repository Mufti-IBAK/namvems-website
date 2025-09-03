// src/app/(admin)/admin/events/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from 'next/link';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { type Event } from '@/lib/types';
import AdminEventCard from './AdminEventCard';

async function getEvents() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    return data;
}

export default async function ManageEventsPage() {
    const events: Event[] = await getEvents();

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaCalendarAlt className="text-primary" />
                        Manage Events
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Create, edit, and manage all events for the community.
                    </p>
                </div>
                <Link href="/admin/events/create" className="btn-primary flex items-center gap-2 w-full md:w-auto">
                    <FaPlus /> Create New Event
                </Link>
            </div>
            
            {events.length === 0 ? (
                <div className="text-center text-gray-500 p-12 bg-white rounded-xl shadow-md">
                    <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Events Found
                    </h3>
                    <p className="text-gray-500 mb-6">
                        You haven &apso;t created any events yet. Let &apso; s create the first one.
                    </p>
                    <Link href="/admin/events/create" className="btn-primary inline-flex items-center gap-2">
                        <FaPlus /> Create Your First Event
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => (
                        <AdminEventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}