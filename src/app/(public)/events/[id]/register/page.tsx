'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import EventRegistrationForm from '@/components/forms/EventRegistrationForm';
import { Event, type EventFormQuestion } from '@/lib/types';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [regLevel, setRegLevel] = useState<'student'|'alumni'|'non_vet'|'other'>('student');
  const [regUniversity, setRegUniversity] = useState<string>('');

  const eventId = params?.id ? parseInt(params.id as string) : null;

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (fetchError) {
        setError('Event not found');
        return;
      }

      setEvent(data);
      
      // Check if registration is allowed
      if (data.registration_type === 'none') {
        setError('This event does not require registration');
        return;
      }
      
      if (data.registration_type === 'external_link' && data.registration_link) {
        // Redirect to external form with flexible URL formatting
        let externalUrl = data.registration_link;
        // Handle Telegram links
        if (externalUrl.startsWith('t.me/')) {
          externalUrl = 'https://' + externalUrl;
        }
        // Handle other URLs that don't start with protocol
        else if (!externalUrl.startsWith('http://') && !externalUrl.startsWith('https://')) {
          externalUrl = 'https://' + externalUrl;
        }
        window.location.href = externalUrl;
        return;
      }
      
      // Check if event has passed
      const eventDate = new Date(data.date);
      if (eventDate < new Date()) {
        setError('Registration is closed - this event has already passed');
        return;
      }
      
      // Check if registration deadline has passed
      if (data.registration_deadline) {
        const registrationDeadline = new Date(data.registration_deadline);
        if (registrationDeadline < new Date()) {
          setError('Registration deadline has passed');
          return;
        }
      }
      
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [eventId, supabase]);

  useEffect(() => {
    if (!eventId) {
      setError('Invalid event ID');
      setLoading(false);
      return;
    }

    fetchEvent();
  }, [eventId, fetchEvent]);


  const handleRegistrationSuccess = (payload?: { level: 'student'|'alumni'|'non_vet'|'other'; university: string }) => {
    if (payload) {
      setRegLevel(payload.level);
      setRegUniversity(payload.university);
    }
    setRegistrationComplete(true);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-300 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Registration Unavailable</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleGoBack}
              className="btn-primary inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (registrationComplete) {
    const isPaidEvent = Boolean(event?.event_fee && Number(event?.event_fee) > 0);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <h3 className="text-xl font-semibold text-primary mb-6">{event?.title}</h3>
            {isPaidEvent ? (
              <>
                <p className="text-gray-600 mb-6">Next step: proceed to the payment page to complete your registration.</p>
                <Link
                  href={`/payment?eventId=${event?.id}&level=${regLevel}&university=${encodeURIComponent(regUniversity)}&lock=1`}
                  className="btn-primary"
                >
                  Go to Payment
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">This event is free. You are all set!</p>
                <Link href="/" className="btn-primary">Go to Home</Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Event
        </button>

        {/* Event Summary */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-3 text-primary" />
                <span>
                  {event.date 
                    ? format(new Date(event.date), 'EEEE, MMMM d, yyyy h:mm a')
                    : 'Date TBD'
                  }
                </span>
              </div>
              
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-3 text-primary" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            
            {event.description && (
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            )}
          </div>
        </div>

        {/* Registration Form */}
        <EventRegistrationForm
          eventId={event.id}
          eventTitle={event.title}
          isPaid={Boolean(event.event_fee && Number(event.event_fee) > 0)}
          feeAmount={Number(event.event_fee || 0)}
          formSchema={(event.internal_form_schema ?? []) as EventFormQuestion[]}
          onSuccess={handleRegistrationSuccess}
          onCancel={handleGoBack}
        />
      </div>
    </div>
  );
}
