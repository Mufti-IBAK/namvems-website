'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import EventForm from '@/components/forms/EventForm';
import { Event } from '@/lib/types/event';

// FIX: Date is initialized as an empty string to match the form input
const initialEventState: Partial<Event> = {
  title: '',
  date: '',
  description: '',
  location: '',
  category: 'Other',
  maxAttendees: 0,
  imageUrl: '',
};

export default function ManageEventsPage() {
  const { supabase } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<Event>>(initialEventState);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
    if (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events.');
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openModalToCreate = () => {
    setSelectedEvent(initialEventState);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (event: Event) => {
    setSelectedEvent(event);
    setImageFile(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // FIX: Use const as imageUrl is not reassigned
    const initialImageUrl = selectedEvent.imageUrl || null;
    let finalImageUrl = initialImageUrl;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('event-images').upload(fileName, imageFile);
      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(uploadData.path);
      finalImageUrl = urlData.publicUrl;
    }

    const eventPayload = {
      title: selectedEvent.title,
      description: selectedEvent.description,
      date: selectedEvent.date,
      location: selectedEvent.location,
      category: selectedEvent.category,
      max_attendees: selectedEvent.maxAttendees,
      image_url: finalImageUrl,
    };

    let request;
    if (selectedEvent.id) {
      request = supabase.from('events').update(eventPayload).eq('id', selectedEvent.id);
    } else {
      request = supabase.from('events').insert([eventPayload]);
    }

    const { error } = await request;

    if (error) {
      alert('Error saving event: ' + error.message);
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
        alert('Error deleting event: ' + error.message);
      } else {
        await fetchEvents();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <button onClick={openModalToCreate} className="bg-primary text-black font-medium py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
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
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            <EventForm event={selectedEvent} setEvent={setSelectedEvent} onSubmit={handleSubmit} isLoading={isSubmitting} onFileChange={handleFileChange} />
          </div>
        </div>
      )}
    </div>
  );
}