'use client'

import React from 'react';
import Image from 'next/image';
import { Event } from '@/lib/types/event';

// Define the props interface correctly
interface EventFormProps {
    event: Partial<Event>;
    setEvent: React.Dispatch<React.SetStateAction<Partial<Event>>>;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventForm = ({ event, setEvent, onSubmit, isLoading, onFileChange }: EventFormProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setEvent({ ...event, [name]: finalValue });
  };

  const dateValue = event.date && typeof event.date === 'string' ? event.date.slice(0, 16) : event.date ? new Date(event.date).toISOString().slice(0, 16) : '';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" name="title" id="title" value={event.title || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={event.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
        <input type="datetime-local" name="date" id="date" value={dateValue} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={event.location || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" name="category" id="category" value={event.category || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">Max Attendees</label>
          <input type="number" name="maxAttendees" id="maxAttendees" value={event.maxAttendees || ''} onChange={handleChange} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
        </div>
        <div>
          <label htmlFor="image_upload" className="block text-sm font-medium text-gray-700">Event Image</label>
          <input type="file" name="image_upload" id="image_upload" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-yellow-500"/>
        </div>
      </div>
      {event.imageUrl && (
        <div className="mt-2"><p className="text-sm text-gray-500">Current Image:</p><div className="relative mt-2 h-32 w-48 rounded-md overflow-hidden"><Image src={event.imageUrl} alt="Current event" layout="fill" objectFit="cover"/></div></div>
      )}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Method</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <input id="google_form" name="registration_type" type="radio" value="google_form" checked={event.registration_type === 'google_form'} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary mt-1"/>
            <div className="ml-3 text-sm"><label htmlFor="google_form" className="font-medium text-gray-700">External Link</label><p className="text-gray-500">Send users to an external URL (e.g., Google Form).</p></div>
          </div>
          {event.registration_type === 'google_form' && (
            <div className="pl-7"><label htmlFor="registration_link" className="block text-sm font-medium text-gray-700">Registration Link</label><input type="url" name="registration_link" id="registration_link" value={event.registration_link || ''} onChange={handleChange} placeholder="https://forms.gle/..." className="mt-1 block w-full ..."/></div>
          )}
          <div className="flex items-start">
            <input id="none" name="registration_type" type="radio" value="none" checked={!event.registration_type || event.registration_type === 'none'} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary mt-1"/>
            <div className="ml-3 text-sm"><label htmlFor="none" className="font-medium text-gray-700">No Registration</label><p className="text-gray-500">The event is open and does not require registration.</p></div>
          </div>
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-primary hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;