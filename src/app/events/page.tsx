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

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'Conference', label: 'Conferences' },
    { value: 'Workshop', label: 'Workshops' },
    { value: 'Study Group', label: 'Study Groups' },
  ]

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error("Error fetching public events:", error);
      setError('Failed to load events. Please try again later.');
    } else {
      const formattedData = data.map(event => ({
          ...event,
          date: new Date(event.date),
          maxAttendees: event.max_attendees,
          imageUrl: event.image_url,
          registeredCount: 0 
      }));
      setEvents(formattedData);
      setFilteredEvents(formattedData);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === selectedCategory));
    }
  }, [selectedCategory, events]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center pt-24">
        <h2 className="text-2xl font-bold text-text mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <PrimaryButton onClick={fetchEvents}>Try Again</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">Our Events</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Join us for upcoming conferences, workshops, and networking opportunities.
        </p>
      </div>

      <div className="mb-12 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              selectedCategory === category.value
                ? 'bg-primary text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-text mb-2">No Events Found</h3>
          <p className="text-gray-700">There are no upcoming events in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              description={event.description}
              location={event.location}
              category={event.category}
              maxAttendees={event.maxAttendees}
              registeredCount={event.registeredCount} 
              onRegister={() => alert(`Registering for ${event.title}`)}
              imageUrl={event.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}