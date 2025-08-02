import React from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

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
  imageUrl
}) => {
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy h:mm a');
  const spotsLeft = maxAttendees > 0 ? maxAttendees - registeredCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 stagger-item">
      {imageUrl ? (
        <div className="h-48 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <div className="text-white text-center p-4">
            <FaCalendarAlt className="text-4xl mx-auto mb-2" />
            <span className="font-bold text-lg">Event</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-text line-clamp-2">{title}</h3>
          <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
            {category}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-alert font-semibold">
            <FaCalendarAlt className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          {maxAttendees > 0 && (
            <div className="flex items-center text-gray-600">
              <FaUsers className="mr-2" />
              <span>{registeredCount}/{maxAttendees} registered</span>
              {spotsLeft !== null && spotsLeft > 0 && (
                <span className="ml-2 text-accent font-semibold">
                  ({spotsLeft} spots left)
                </span>
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-6 line-clamp-3">{description}</p>
        
        <button
          onClick={onRegister}
          disabled={isFull}
          className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
            isFull 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-primary text-black hover:bg-opacity-90 shadow-md hover:shadow-lg interactive-button'
          }`}
        >
          {isFull ? 'Event Full' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;