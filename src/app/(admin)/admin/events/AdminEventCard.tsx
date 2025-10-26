// src/app/(admin)/admin/events/AdminEventCard.tsx
'use client'

import { type Event } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useTransition } from 'react';
import { deleteEvent } from './actions';
import toast from 'react-hot-toast';

export default function AdminEventCard({ event }: { event: Event }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to permanently delete this event?')) {
            startTransition(async () => {
                const result = await deleteEvent(event.id);
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="h-48 bg-gray-200 relative">
                {event.image_url ? (
                    <Image src={event.image_url} alt={`Image for ${event.title}`} layout="fill" objectFit="cover" />
                ) : (
                    <div className="h-full bg-gradient-to-r from-primary to-accent flex items-center justify-center p-4">
                        <h3 className="text-xl font-bold text-white text-center text-shadow-md">{event.title}</h3>
                    </div>
                )}
                {event.category && (
                    <span className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">{event.category}</span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2" title={event.title}>{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        <span>{format(new Date(event.date), 'EEE, MMM d, yy @ h:mm a')}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-primary" />
                            <span>{event.location}</span>
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-700 flex-grow line-clamp-3 mb-4">
                    {event.description}
                </p>
                <div className="mt-auto border-t pt-3 flex flex-col sm:flex-row gap-2">
                    <Link href={`/admin/events/edit/${event.id}`} className="btn-secondary-outline flex-1 text-center py-2 px-3 text-sm">
                        Edit
                    </Link>
                    <Link href={`/admin/events/edit/${event.id}/form`} className="btn-secondary-outline flex-1 text-center py-2 px-3 text-sm">
                        Edit Form
                    </Link>
                    <button 
                        onClick={handleDelete} 
                        disabled={isPending}
                        className="bg-red-500 text-white font-semibold rounded-xl py-2 px-3 text-sm flex-1 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}