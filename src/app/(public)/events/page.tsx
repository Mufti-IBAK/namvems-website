// src/app/events/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from "next/link";

// This is the most important line. It tells Next.js to never cache this page
// and to always run the data fetching function on every visit.
export const dynamic = 'force-dynamic';

async function getEvent(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching event with id ${id}. This likely means no event with this ID exists in the database.`, error);
        notFound();
    }
    return data;
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const event = await getEvent(params.id);

    const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
    const formattedTime = format(new Date(event.date), 'h:mm a');

    return (
        <div className="container mx-auto px-4 py-8 pt-24 md:pt-32">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-64 md:h-96 bg-gray-200 relative">
                        {event.image_url ? (
                            <Image src={event.image_url} alt={`Image for ${event.title}`} layout="fill" objectFit="cover" />
                        ) : (
                            <div className="h-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                                <h2 className="text-4xl font-bold text-white text-shadow-md">{event.title}</h2>
                            </div>
                        )}
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{event.title}</h1>
                            {event.category && (
                                <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">{event.category}</span>
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 text-gray-600 mb-6 border-b pb-6">
                            <div className="flex items-center text-lg">
                                <FaCalendarAlt className="mr-3 text-primary" />
                                <div>
                                    <p className="font-semibold">{formattedDate}</p>
                                    <p className="text-sm">{formattedTime}</p>
                                </div>
                            </div>
                            {event.location && (
                                <div className="flex items-center text-lg">
                                    <FaMapMarkerAlt className="mr-3 text-primary" />
                                    <p className="font-semibold">{event.location}</p>
                                </div>
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">About this Event</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>

                         <div className="mt-8 pt-6 border-t">
                            {event.registration_type === 'google_form' && event.registration_link && (
                                <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="btn-primary w-full md:w-auto text-center">
                                    Register Now
                                </a>
                            )}
                             {event.registration_type === 'none' && (
                                 <p className="text-center font-semibold text-gray-700 p-3 bg-gray-100 rounded-md">No Registration Required</p>
                            )}
                        </div>
                    </div>
                </div>
                 <div className="text-center mt-8">
                    <Link href="/events" className="font-semibold text-primary hover:underline">
                        &larr; Back to All Events
                    </Link>
                </div>
            </div>
        </div>
    );
}