import React from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import Link from 'next/link';

interface EventCardProps {
  title: string;
  date: Date;
  description: string;
  location: string;
  category: string;
  maxAttendees?: number;
  registeredCount?: number;
  onRegister?: () => void;
  imageUrl?: string;
  eventId?: string; // Add event ID for navigation
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  description,
  location,
  category,
  maxAttendees = 0,
  registeredCount = 0,
  onRegister,
  imageUrl,
  eventId
}) => {
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy h:mm a');
  const spotsLeft = maxAttendees > 0 ? maxAttendees - registeredCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 stagger-item">
      {imageUrl ? (
        <div className="h-48 relative overflow-hidden">
          {eventId ? (
            <Link href={`/events/${eventId}`}>
              <img 
                src={imageUrl} 
                alt={`Event: ${title}`}
                className="w-full h-full object-cover cursor-pointer"
              />
            </Link>
          ) : (
            <img 
              src={imageUrl} 
              alt={`Event: ${title}`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-primary to-accent flex items-center justify-center" aria-label={`Event: ${title}`}>
          <div className="text-white text-center p-4">
            <FaCalendarAlt className="text-4xl mx-auto mb-2" aria-hidden="true" />
            <span className="font-bold text-lg">Event</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          {eventId ? (
            <Link href={`/events/${eventId}`} className="text-xl font-bold text-text line-clamp-2 hover:text-primary transition-colors">
              {title}
            </Link>
          ) : (
            <h3 className="text-xl font-bold text-text line-clamp-2">{title}</h3>
          )}
          <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
            {category}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-alert font-semibold">
            <FaCalendarAlt className="mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          
          {maxAttendees > 0 && (
            <div className="flex items-center text-gray-600">
              <FaUsers className="mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm">{registeredCount}/{maxAttendees} registered</span>
              {spotsLeft !== null && spotsLeft > 0 && (
                <span className="ml-2 text-accent font-semibold text-sm">
                  ({spotsLeft} spots left)
                </span>
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-6 line-clamp-3">{description}</p>
        
        <div className="flex gap-2">
          {eventId && (
            <Link
              href={`/events/${eventId}`}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center"
              aria-label={`View details for ${title}`}
            >
              Details
            </Link>
          )}
          
          {onRegister && (
            <button
              onClick={onRegister}
              disabled={isFull}
              className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
                isFull 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary text-black hover:bg-opacity-90 shadow-md hover:shadow-lg'
              }`}
              aria-label={isFull ? `Registration full for ${title}` : `Register for ${title}`}
            >
              {isFull ? 'Full' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;