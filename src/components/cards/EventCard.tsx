'use client'

import React from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
  title: string;
  date: Date;
  description?: string;
  location?: string;
  category?: string;
  maxAttendees?: number;
  registeredCount?: number;
  onRegister?: () => void;
  imageUrl?: string | null;
  registration_type?: 'google_form' | 'internal_form' | 'none';
  registration_link?: string | null;
}

// FIX: This is the complete, un-corrupted function signature
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
  registration_type,
  registration_link
}) => {
  const { user } = useAuth();
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy h:mm a');
  const spotsLeft = maxAttendees > 0 ? maxAttendees - registeredCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const ActionButton = () => {
    if (!user) return <Link href="/login" className="w-full block text-center ...">Login to Register</Link>;
    
    switch (registration_type) {
        case 'google_form':
            return <a href={registration_link || '#'} target="_blank" rel="noopener noreferrer" className="w-full block text-center ...">Register Now</a>;
        case 'none':
            return <div className="w-full text-center font-semibold ...">No Registration Needed</div>;
        default:
             return <button onClick={onRegister} disabled={isFull} className={`w-full font-semibold ...`}>{isFull ? 'Event Full' : 'Register'}</button>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden ... group">
      <div className="h-48 bg-gray-200 relative">
        {imageUrl ? <Image src={imageUrl} alt={`Image for ${title}`} layout="fill" objectFit="cover" className="..."/> : <div className="h-full bg-gradient-to-r from-primary to-accent ...">...</div>}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3"><h3 className="text-xl font-bold ...">{title}</h3><span className="bg-green-100 ...">{category}</span></div>
        <div className="mb-3"><div className="flex items-center ..."><FaCalendarAlt className="mr-2"/>{formattedDate}</div>{location && (<div className="flex items-center ..."><FaMapMarkerAlt className="mr-2"/>{location}</div>)}</div>
        <p className="text-gray-700 mb-4 h-24 overflow-hidden">{description}</p>
        <ActionButton />
      </div>
    </div>
  );
};

export default EventCard;