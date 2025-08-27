// src/app/(admin)/admin/events/create/page.tsx
import EventForm from '../EventForm';
import { FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function CreateEventPage() {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FaPlusCircle /> Create New Event
                </h1>
                <Link href="/admin/events" className="btn-ghost">
                    Back to Events
                </Link>
            </div>
            <EventForm />
        </div>
    );
}