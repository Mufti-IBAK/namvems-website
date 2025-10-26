// src/app/(public)/events/page.tsx
import { createClient } from "@/lib/supabase/server";
import EventCard from '@/components/cards/EventCard';
import { FaCalendarAlt } from 'react-icons/fa';
import { type Event } from '@/lib/types';
import Link from 'next/link';

// Database return type - matches Supabase response structure
type DatabaseEvent = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  category: string | null;
  image_url: string | null;
  max_attendees: number | null;
  created_at: string | null;
  registration_type: 'none' | 'external_link' | 'internal_form';
  registration_link: string | null;
  registration_deadline: string | null;
  event_fee: number | null;
  event_fee_student: number | null;
  event_fee_alumni: number | null;
  event_fee_non_vet: number | null;
  event_fee_other: number | null;
  internal_form_schema: unknown | null;
};

export const dynamic = 'force-dynamic';

function isValidDate(date: unknown): date is Date | string {
  if (!date) return false;
  // Type-safe date validation without using 'any'
  if (typeof date === 'string' || date instanceof Date) {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }
  return false;
}

// Type-safe data sanitization function
function sanitizeEventData(events: DatabaseEvent[]): Event[] {
  return events
    .filter((event): event is DatabaseEvent => {
      if (!event || !event.title || !event.date || !isValidDate(event.date)) {
        console.warn('Filtering out event with missing/invalid data:', event?.id);
        return false;
      }
      return true;
    })
    .map((event): Event => ({
      ...event,
      max_attendees: Number(event.max_attendees) || 0,
      description: event.description || '',
      location: event.location || '',
      category: event.category || 'General',
      registration_deadline: event.registration_deadline || null,
      internal_form_schema: null,
    }));
}

async function getEvents(): Promise<Event[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    
    // Type-safe handling: Supabase returns DatabaseEvent[] which we sanitize to Event[]
    if (!data) {
        return [];
    }
    
    return sanitizeEventData(data as DatabaseEvent[]);
}

export default async function EventsPage() {
    const events = await getEvents();
    
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.date) >= now);
    const pastEvents = events.filter(event => new Date(event.date) < now);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-primary via-accent to-primary pt-20 md:pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 bg-white/10 rounded-full mr-4">
                                <FaCalendarAlt className="text-5xl md:text-6xl text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-shadow-md">
                                Events
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed text-shadow">
                            Join us for exciting events, workshops, and activities designed to enhance your veterinary education and professional development.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Upcoming Events
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
                        </div>
                        
                        {upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {upcomingEvents.map((event, index) => (
                                    <div 
                                        key={event.id} 
                                        className="fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <EventCard event={event} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl card-shadow">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                    No Upcoming Events
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We&apos;re planning something amazing! Check back soon.
                                </p>
                            </div>
                        )}
                    </div>

                    {pastEvents.length > 0 && (
                        <div className="mb-20">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Past Events
                                </h2>
                                <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {pastEvents.map((event, index) => (
                                    <div 
                                        key={event.id}
                                        className="fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <EventCard event={event} isPastEvent={true} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="relative overflow-hidden rounded-2xl card-shadow-hover">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"></div>
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="relative text-center py-16 px-8">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Want to Stay Updated?
                            </h3>
                            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Don&apos;t miss out on our latest events, workshops, and educational opportunities. Join our community today!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/about" 
                                    className="inline-flex items-center justify-center bg-white text-primary font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                                >
                                    Get In Touch
                                </Link>
                                <Link
                                    href="/resources" 
                                    className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    View Resources
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}