'use client'

import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useAuth } from '@/context/AuthContext';
import EventForm from '@/components/forms/EventForm';

interface Event {
  id?: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  category?: string;
  max_attendees?: number;
  image_url?: string;
}

const initialEventState: Event = {
  title: '',
  date: '',
  description: '',
  location: '',
  category: '',
  max_attendees: 0,
  image_url: '',
};

export default function ManageEventsPage() {
  const { supabase } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>(initialEventState);

  // FIX: Wrap fetchEvents in useCallback to stabilize the function
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events.');
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }, [supabase]); // Dependency array for useCallback

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // FIX: Add fetchEvents to the dependency array

  const openModalToCreate = () => {
    setSelectedEvent(initialEventState);
    setIsModalOpen(true);
  };

  const openModalToEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { id, ...eventData } = selectedEvent;

    let error;
    if (id) {
      ({ error } = await supabase.from('events').update(eventData).eq('id', id));
    } else {
      ({ error } = await supabase.from('events').insert([eventData]));
    }

    if (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Check the console for details.');
    } else {
      await fetchEvents();
      closeModal();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
      } else {
        await fetchEvents();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <button
          onClick={openModalToCreate}
          className="bg-primary text-black font-medium py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
        >
          + Add New Event
        </button>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.date).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openModalToEdit(event)} className="text-accent hover:text-green-700">Edit</button>
                    <button onClick={() => handleDelete(event.id!)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4">{selectedEvent.id ? 'Edit Event' : 'Add New Event'}</h2>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
            <EventForm
              event={selectedEvent}
              setEvent={setSelectedEvent}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}