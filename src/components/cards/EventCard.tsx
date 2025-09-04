// src/components/cards/EventCard.tsx
'use client'

import React from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { type Event } from '@/lib/types';

// --- FIX: The props are now clean and accept the master Event type ---
interface EventCardProps {
  event: Event;
  isPastEvent?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isPastEvent = false }) => {
  const { user } = useAuth();

  // Gracefully handle potentially invalid dates
  const formattedDate = event.date && new Date(event.date).toString() !== 'Invalid Date'
    ? format(new Date(event.date), 'EEEE, MMMM d, yyyy h:mm a')
    : 'Date TBD';
  
  // Check if event has passed (if not explicitly set)
  const eventDate = event.date ? new Date(event.date) : null;
  const isEventPassed = !isPastEvent && eventDate ? eventDate < new Date() : isPastEvent;
  
  // Check if registration deadline has passed
  const registrationDeadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
  const isRegistrationClosed = registrationDeadline ? registrationDeadline < new Date() : false;
  
  // Default this to 0 as it's not currently calculated
  const registeredCount = 0; 
  const spotsLeft = event.max_attendees && event.max_attendees > 0 ? event.max_attendees - registeredCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const ActionButton = () => {
    // Show "Event Concluded" for past events
    if (isEventPassed) {
      return (
        <div className="w-full text-center font-semibold py-3 px-6 rounded-xl bg-gray-100 text-gray-500 border border-gray-200">
          Event Concluded
        </div>
      );
    }
    
    // Show "Registration Closed" if deadline has passed
    if (isRegistrationClosed && event.registration_type !== 'none') {
      return (
        <div className="w-full text-center font-semibold py-3 px-6 rounded-xl bg-red-100 text-red-600 border border-red-200">
          Registration Closed
        </div>
      );
    }
    
    // Show login prompt for non-authenticated users
    if (!user) {
      return (
        <Link href="/login" className="w-full block text-center btn-primary">
          Login to Register
        </Link>
      );
    }
    
    // Handle different registration types
    switch (event.registration_type) {
      case 'external_link':
        // Handle various URL formats flexibly
        let externalUrl = event.registration_link || '#';
        if (externalUrl !== '#') {
          // Handle Telegram links
          if (externalUrl.startsWith('t.me/')) {
            externalUrl = 'https://' + externalUrl;
          }
          // Handle other URLs that don't start with protocol
          else if (!externalUrl.startsWith('http://') && !externalUrl.startsWith('https://')) {
            externalUrl = 'https://' + externalUrl;
          }
        }
        return (
          <a 
            href={externalUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full block text-center btn-primary hover:scale-105 transition-transform"
          >
            Register Now
          </a>
        );
        
      case 'internal_form':
        return (
          <Link 
            href={`/events/${event.id}/register`} 
            className="w-full block text-center btn-primary hover:scale-105 transition-transform"
          >
            Register Now
          </Link>
        );
        
      case 'none':
        return (
          <div className="w-full text-center font-semibold py-3 px-6 rounded-xl bg-green-100 text-green-700 border border-green-200">
            No Registration Needed
          </div>
        );
        
      default:
        // Fallback for internal form registration
        return (
          <Link 
            href={`/events/${event.id}/register`} 
            className={`w-full block text-center font-semibold btn-primary hover:scale-105 transition-transform ${isFull ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
          >
            {isFull ? 'Event Full' : 'Register'}
          </Link>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* --- FIX: The Link now correctly uses event.id --- */}
      <Link href={`/events/${event.id}`} className="block h-48 bg-gray-200 relative overflow-hidden">
        {event.image_url ? 
            <Image src={event.image_url} alt={event.title} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110"/> 
            : <div className="h-full bg-gradient-to-r from-primary to-accent flex items-center justify-center p-4"><h3 className="text-xl font-bold text-white text-center text-shadow-md">{event.title}</h3></div>
        }
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
            {/* --- FIX: The Link now correctly uses event.id --- */}
            <Link href={`/events/${event.id}`}><h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors duration-200 line-clamp-2">{event.title}</h3></Link>
            {event.category && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">{event.category}</span>}
        </div>
        <div className="mb-3 space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2 text-gray-400"/>
                {formattedDate}
            </div>
            {event.location && (
                <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-gray-400"/>
                    {event.location}
                </div>
            )}
        </div>
        <p className="text-gray-700 mb-4 flex-grow h-24 overflow-hidden line-clamp-4">
            {event.description}
        </p>
        <div className="mt-auto pt-4 border-t">
            <ActionButton />
        </div>
      </div>
    </div>
  );
};

export default EventCard;