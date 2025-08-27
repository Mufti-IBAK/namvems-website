// src/app/(admin)/admin/events/EventForm.tsx
'use client'

import { useActionState, useEffect } from 'react';
import { upsertEvent, type ActionState } from './actions';
import { type Event } from '@/lib/types';
import { format } from 'date-fns';
import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending ? 'Saving...' : label}
        </button>
    );
}

export default function EventForm({ event }: { event?: Event | null }) {
    const router = useRouter();
    const initialState: ActionState = { message: null, errors: {}, success: false };
    const [state, formAction] = useActionState(upsertEvent, initialState);

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
            router.push('/admin');
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        console.log("--- [CLIENT-SIDE] Form Data Being Submitted ---");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        console.log("------------------------------------------");
    };

    const defaultDate = event?.date ? format(new Date(event.date), "yyyy-MM-dd'T'HH:mm") : '';
        
    return (
        <form 
            action={formAction} 
            onSubmit={handleFormSubmit}
            className="space-y-6 bg-white p-8 rounded-xl card-shadow"
        >
            {event && <input type="hidden" name="id" value={event.id} />}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={event?.title}
                    className="mt-1 block w-full"
                    aria-describedby="title-error"
                />
                {state.errors?.title && <p id="title-error" className="mt-2 text-sm text-red-600">{state.errors.title[0]}</p>}
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
                <input
                    id="date"
                    name="date"
                    type="datetime-local"
                    required
                    defaultValue={defaultDate}
                    className="mt-1 block w-full"
                    aria-describedby="date-error"
                />
                {state.errors?.date && <p id="date-error" className="mt-2 text-sm text-red-600">{state.errors.date[0]}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={event?.description || ''}
                    className="mt-1 block w-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input id="location" name="location" type="text" defaultValue={event?.location || ''} className="mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <input id="category" name="category" type="text" defaultValue={event?.category || ''} className="mt-1 block w-full" />
                </div>
            </div>
            
            <div className="border-t pt-6">
                <p className="text-lg font-medium text-gray-900">Event Image</p>
                <p className="text-sm text-gray-500 mb-4">Provide a URL or upload a new image. Uploading an image will override the URL field.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input id="image_url" name="image_url" type="text" defaultValue={event?.image_url || ''} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="image_file" className="block text-sm font-medium text-gray-700">Or Upload New Image</label>
                        <input 
                            id="image_file" 
                            name="image_file"
                            type="file" 
                            accept="image/png, image/jpeg, image/webp"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-yellow-500"
                        />
                    </div>
                </div>
            </div>
            
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="max_attendees" className="block text-sm font-medium text-gray-700">Max Attendees (0 for unlimited)</label>
                    <input id="max_attendees" name="max_attendees" type="number" defaultValue={event?.max_attendees || 0} min="0" className="mt-1 block w-full" />
                </div>

                <div>
                    <label htmlFor="registration_type" className="block text-sm font-medium text-gray-700">Registration Type</label>
                    <select id="registration_type" name="registration_type" defaultValue={event?.registration_type || 'none'} className="mt-1 block w-full">
                        <option value="none">None</option>
                        <option value="google_form">Google Form</option>
                        <option value="internal_form">Internal Form</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="registration_link" className="block text-sm font-medium text-gray-700">Registration Link (if applicable)</label>
                <input id="registration_link" name="registration_link" type="text" placeholder="https://forms.gle/..." defaultValue={event?.registration_link || ''} className="mt-1 block w-full" />
            </div>

            <div className="pt-4">
                <SubmitButton label={event ? 'Update Event' : 'Create Event'} />
            </div>
        </form>
    );
}