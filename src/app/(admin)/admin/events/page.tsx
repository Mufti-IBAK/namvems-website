// src/app/(admin)/admin/events/page.tsx
// FIXED: This was incorrectly showing dashboard content instead of events management
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import AdminEventCard from './AdminEventCard';
import { type Event } from '@/lib/types';

// --- DATA FETCHING ---
async function getEventsData() {
    const supabase = createClient();
    
    // Fetch all events ordered by date
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
        
    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }
    
    return events as Event[];
}

// --- MAIN PAGE ---
export default async function AdminEventsPage() {
    const events = await getEventsData();
    
    return (
        <div className="animate-fade-in space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaCalendarAlt className="text-primary" />
                        Manage Events
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Create, edit, and manage all events for the community.
                    </p>
                </div>
                <Link href="/admin/events/create" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Create New Event
                </Link>
            </div>
            
            {/* Stats Section */}
            <div className="bg-white p-6 rounded-xl card-shadow">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{events.length}</p>
                        <p className="text-gray-500 text-sm">Total Events</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                            {events.filter(e => new Date(e.date) > new Date()).length}
                        </p>
                        <p className="text-gray-500 text-sm">Upcoming Events</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-600">
                            {events.filter(e => new Date(e.date) < new Date()).length}
                        </p>
                        <p className="text-gray-500 text-sm">Past Events</p>
                    </div>
                </div>
            </div>
            
            {/* Events Grid */}
            {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <AdminEventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-xl card-shadow text-center">
                    <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Events Found
                    </h3>
                    <p className="text-gray-500 mb-6">
                        You haven't created any events yet. Start by creating your first event.
                    </p>
                    <Link href="/admin/events/create" className="btn-primary inline-flex items-center gap-2">
                        <FaPlus /> Create Your First Event
                    </Link>
                </div>
            )}
        </div>
    );
}
