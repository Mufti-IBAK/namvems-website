/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react';

// This is a generic form. It receives the event data, a setter function,
// and the submit handler from its parent. This makes it highly reusable.
const EventForm = ({ event, setEvent, onSubmit, isLoading }: any) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle number inputs correctly
    const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setEvent({ ...event, [name]: finalValue });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={event.title || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          value={event.description || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
        <input
          type="datetime-local"
          name="date"
          id="date"
          value={event.date ? new Date(event.date).toISOString().slice(0, 16) : ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={event.location || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            value={event.category || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="max_attendees" className="block text-sm font-medium text-gray-700">Max Attendees</label>
          <input
            type="number"
            name="max_attendees"
            id="max_attendees"
            value={event.max_attendees || ''}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
          <input
            type="text"
            name="image_url"
            id="image_url"
            value={event.image_url || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-primary hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;