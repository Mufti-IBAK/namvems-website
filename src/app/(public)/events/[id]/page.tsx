'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { eventsService } from '@/lib/services/eventsService'
import { Event } from '@/lib/types/event'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import SecondaryButton from '@/components/buttons/SecondaryButton'
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowLeft } from 'react-icons/fa'
import { format } from 'date-fns'

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  useEffect(() => {
    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const eventData = await eventsService.getEventById(eventId)
      if (eventData) {
        setEvent(eventData)
      } else {
        setError('Event not found')
      }
    } catch (err) {
      setError('Failed to load event details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!event) return
    
    try {
      setIsRegistering(true)
      const success = await eventsService.registerForEvent(eventId)
      if (success) {
        alert('Successfully registered for the event!')
        // Update local state
        setEvent(prev => prev ? {
          ...prev,
          registeredCount: prev.registeredCount + 1
        } : null)
      }
    } catch (err) {
      alert('Failed to register for the event. Please try again.')
      console.error(err)
    } finally {
      setIsRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-alert mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <button 
            onClick={() => router.push('/events')}
            className="text-accent hover:text-opacity-80 font-semibold flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const formattedDate = format(event.date, 'EEEE, MMMM d, yyyy h:mm a')
  const spotsLeft = event.maxAttendees > 0 ? event.maxAttendees - event.registeredCount : null
  const isFull = spotsLeft !== null && spotsLeft <= 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => router.push('/events')}
          className="text-accent hover:text-opacity-80 font-semibold flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {event.imageUrl && (
          <div className="h-80 relative">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
              <div className="flex items-center mt-2">
                <FaCalendarAlt className="mr-2" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {!event.imageUrl && (
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">{event.title}</h1>
              <div className="flex items-center text-alert font-semibold">
                <FaCalendarAlt className="mr-2" />
                <span>{formattedDate}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-4">Event Details</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-4">Location</h2>
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-3 text-xl" />
                  <span className="text-lg">{event.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-text mb-4">Event Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-600">Category</h3>
                  <p className="text-text">{event.category}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-600">Date & Time</h3>
                  <p className="text-text">{formattedDate}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-600">Location</h3>
                  <p className="text-text">{event.location}</p>
                </div>
                
                {event.maxAttendees > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-600">Attendance</h3>
                    <p className="text-text">
                      {event.registeredCount}/{event.maxAttendees} registered
                      {spotsLeft !== null && spotsLeft > 0 && (
                        <span className="block text-accent font-semibold">
                          {spotsLeft} spots left
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleRegister}
                  disabled={isFull || isRegistering}
                  className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
                    isFull || isRegistering
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary text-black hover:bg-opacity-90 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isRegistering ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></span>
                      Registering...
                    </span>
                  ) : isFull ? (
                    'Event Full'
                  ) : (
                    'Register Now'
                  )}
                </button>
                
                {isFull && (
                  <p className="text-alert text-sm text-center mt-2">
                    This event has reached maximum capacity
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}