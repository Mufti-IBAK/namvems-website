// src/app/(admin)/admin/events/EventActions.tsx
'use client'

import Link from 'next/link';
import { useTransition } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteEvent } from './actions';
import toast from 'react-hot-toast';

export default function EventActions({ eventId }: { eventId: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to permanently delete this event?')) {
            startTransition(async () => {
                const result = await deleteEvent(eventId);
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            });
        }
    };

    return (
        <div className="flex justify-center items-center gap-4">
            {/* The "View" button has been removed */}
            
            <Link href={`/admin/events/edit/${eventId}`} className="text-blue-600 hover:text-blue-800" title="Edit Event">
                <FaEdit size={18} />
            </Link>
            
            <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-800 disabled:opacity-50" title="Delete Event">
                {isPending ? '...' : <FaTrash size={18} />}
            </button>
        </div>
    );
}