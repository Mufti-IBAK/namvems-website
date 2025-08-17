'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event } from '@/lib/types/event'
import EventCard from '@/components/cards/EventCard'
import PrimaryButton from '@/components/buttons/PrimaryButton'

export default function EventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [ /* ... */ ];

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });

    if (error) {
      setError('Failed to load events. Please try again later.');
    } else {
      const formattedData = data.map(event => ({ ...event, date: new Date(event.date), maxAttendees: event.max_attendees, imageUrl: event.image_url, registeredCount: 0, registration_type: event.registration_type, registration_link: event.registration_link }));
      setEvents(formattedData);
      setFilteredEvents(formattedData);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  useEffect(() => {
    if (selectedCategory === 'all') setFilteredEvents(events);
    else setFilteredEvents(events.filter(event => event.category === selectedCategory));
  }, [selectedCategory, events]);

  if (loading) { /* ...loading JSX... */ }
  if (error) { /* ...error JSX... */ }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-12">{/* ... */}</div>
      <div className="mb-12 flex flex-wrap gap-2 justify-center">{/* ... */}</div>
      {filteredEvents.length === 0 ? (<div className="text-center ...">{/* ... */}</div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            // FIX: This now correctly passes a guaranteed Date object.
            const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
            return (
              <EventCard
                key={event.id}
                title={event.title}
                date={eventDate} // This is now error-free
                description={event.description}
                location={event.location}
                category={event.category}
                maxAttendees={event.maxAttendees}
                registeredCount={event.registeredCount}
                onRegister={() => alert(`Registering for ${event.title}`)}
                imageUrl={event.imageUrl}
                registration_type={event.registration_type}
                registration_link={event.registration_link}
              />
            )
          })}
        </div>
      )}
    </div>
  );
}