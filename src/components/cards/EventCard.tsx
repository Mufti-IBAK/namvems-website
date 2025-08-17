'use client'

import React from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// FIX: Restore the props interface
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
  const { user } = useAuth();
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy h:mm a');
  // FIX: Restore the calculation logic
  const spotsLeft = maxAttendees > 0 ? maxAttendees - registeredCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const ActionButton = () => {
    if (!user) {
      return (
        <Link href="/login" className="w-full block text-center font-semibold py-2 px-4 rounded-xl transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300">
          Login to Register
        </Link>
      );
    }
    return (
      <button
        onClick={onRegister}
        disabled={isFull}
        className={`w-full font-semibold py-2 px-4 rounded-xl transition-colors ${
          isFull 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-primary hover:bg-yellow-500 text-black'
        }`}
      >
        {isFull ? 'Event Full' : 'Register Now'}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 stagger-item">
      {imageUrl ? (
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <span className="text-white font-bold text-lg">NAMVEMS Event</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-black">{title}</h3>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
            {category}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center text-red-700 font-semibold mb-1">
            <FaCalendarAlt className="mr-2" />
            {formattedDate}
          </div>
          
          {location && (
            <div className="flex items-center text-gray-600 text-sm">
              <FaMapMarkerAlt className="mr-2" />
              {location}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-4 h-24 overflow-hidden">{description}</p>
        
        <ActionButton />
      </div>
    </div>
  );
};

export default EventCard;