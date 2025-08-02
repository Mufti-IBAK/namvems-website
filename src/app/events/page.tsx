'use client'

import { useState, useEffect } from 'react'
import { eventsService } from '@/lib/services/eventsService'
import { Event } from '@/lib/types/event'
import EventCard from '@/components/cards/EventCard'
import PrimaryButton from '@/components/buttons/PrimaryButton'

export default function EventsPage() {
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
    { value: 'Networking', label: 'Networking' },
    { value: 'Other', label: 'Other Events' }
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(
        events.filter(event => event.category === selectedCategory)
      )
    }
  }, [selectedCategory, events])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await eventsService.getAllEvents()
      setEvents(data)
      setFilteredEvents(data)
    } catch (err) {
      setError('Failed to load events. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId: string) => {
    try {
      const success = await eventsService.registerForEvent(eventId)
      if (success) {
        // Update the event's registered count
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, registeredCount: event.registeredCount + 1 } 
              : event
          )
        )
        alert('Successfully registered for the event!')
      }
    } catch (err) {
      alert('Failed to register for the event. Please try again.')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-alert mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="inline-block">
            <PrimaryButton onClick={fetchEvents}>
              Try Again
            </PrimaryButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
          Our Events
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
          Join us for upcoming conferences, workshops, and networking opportunities
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`Filter by ${category.label}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-text mb-2">No Events Found</h3>
          <p className="text-gray-700">
            There are no upcoming events in this category.
          </p>
          <button 
            onClick={() => setSelectedCategory('all')}
            className="mt-4 text-accent hover:text-opacity-80 font-semibold"
          >
            View All Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              eventId={event.id}
              title={event.title}
              date={event.date}
              description={event.description}
              location={event.location}
              category={event.category}
              maxAttendees={event.maxAttendees}
              registeredCount={event.registeredCount}
              onRegister={() => handleRegister(event.id)}
              imageUrl={event.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}