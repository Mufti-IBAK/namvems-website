// src/app/(admin)/admin/events/AdminEventCard.tsx
'use client'

import { type Event } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';
import EventActions from './EventActions';

export default function AdminEventCard({ event }: { event: Event }) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="h-40 bg-gray-200 relative">
                {event.image_url ? (
                    <Image src={event.image_url} alt={`Image for ${event.title}`} layout="fill" objectFit="cover" />
                ) : (
                    <div className="h-full bg-gradient-to-r from-primary to-accent flex items-center justify-center p-4">
                        <h3 className="text-lg font-bold text-white text-center text-shadow-md">{event.title}</h3>
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={event.title}>{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                    {format(new Date(event.date), 'EEE, MMM d, yyyy')}
                </p>
                <div className="mt-auto border-t pt-3">
                    <EventActions eventId={event.id} />
                </div>
            </div>
        </div>
    );
}