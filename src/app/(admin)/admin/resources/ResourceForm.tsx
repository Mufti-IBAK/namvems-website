// src/app/(admin)/admin/resources/ResourceForm.tsx
'use client'

import { useActionState, useEffect, useState } from 'react';
import { upsertResource, type ActionState } from './actions';
import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaFilePdf, FaFileUpload } from 'react-icons/fa';
import { type Resource } from '@/lib/types';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending ? 'Saving...' : label}
        </button>
    );
}

export default function ResourceForm({ resource }: { resource?: Resource | null }) {
    const router = useRouter();
    const initialState: ActionState = { message: null, errors: {}, success: false };
    const [state, formAction] = useActionState(upsertResource, initialState);
    
    const [fileName, setFileName] = useState<string | null>(null);
    // const [isUploading, setIsUploading] = useState(false); // MOBILE FIX: Track upload state

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : null);
        
        // MOBILE FIX: Prevent page reload/navigation on mobile file selection
        // that could trigger authentication re-validation
        e.stopPropagation();
        
        // Additional logging for debugging mobile file selection
        if (file) {
            console.log('File selected on mobile:', {
                name: file.name,
                size: file.size,
                type: file.type,
                timestamp: new Date().toISOString()
            });
        }
    };

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
            router.push('/admin/resources');
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);
        
    return (
        <form action={formAction} className="space-y-6 bg-white p-8 rounded-xl card-shadow">
            {resource && <input type="hidden" name="id" value={resource.id} />}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Resource Title</label>
                <input id="title" name="title" type="text" required defaultValue={resource?.title} className="mt-1 block w-full" />
                {state.errors?.title && <p className="mt-2 text-sm text-red-600">{state.errors.title[0]}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" rows={4} defaultValue={resource?.description || ''} className="mt-1 block w-full" />
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Resource Type (e.g., PDF, Handbook, Video)</label>
                <input id="type" name="type" type="text" required defaultValue={resource?.type} className="mt-1 block w-full" />
                {state.errors?.type && <p className="mt-2 text-sm text-red-600">{state.errors.type[0]}</p>}
            </div>

            <div className="border-t pt-6">
                <label htmlFor="resource_file" className="block text-sm font-medium text-gray-700">Upload File</label>
                {!resource && <p className="text-xs text-gray-500 mb-2">A file is required for new resources.</p>}
                {resource && <p className="text-xs text-gray-500 mb-2">Current file: <a href={resource.download_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Current File</a>. Uploading a new file will replace it.</p>}
                
                <div className="mt-2 flex items-center gap-4">
                    <label htmlFor="resource_file" className="btn-secondary-outline cursor-pointer flex items-center gap-2">
                        <FaFileUpload />
                        <span>Choose File</span>
                    </label>
                    <input id="resource_file" name="resource_file" type="file" className="sr-only" onChange={handleFileChange} />
                    {fileName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaFilePdf className="text-red-500" />
                            <span>{fileName}</span>
                        </div>
                    )}
                </div>
                {state.errors?.resource_file && <p className="mt-2 text-sm text-red-600">{state.errors.resource_file[0]}</p>}
            </div>

            <div className="pt-4">
                <SubmitButton label={resource ? 'Update Resource' : 'Create Resource'} />
            </div>
        </form>
    );
}