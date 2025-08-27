// src/app/(admin)/admin/resources/ResourceActions.tsx
'use client'

import Link from 'next/link';
import { useTransition } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteResource } from './actions';
import toast from 'react-hot-toast';

export default function ResourceActions({ resourceId }: { resourceId: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this resource? This cannot be undone.')) {
            // startTransition wraps the server action call
            startTransition(async () => {
                const result = await deleteResource(resourceId);
                if (result.success) {
                    toast.success(result.message || 'Resource deleted successfully!');
                } else {
                    toast.error(result.message || 'Failed to delete resource.');
                }
            });
        }
    };

    return (
        <div className="flex justify-center items-center gap-4">
            <Link href={`/admin/resources/edit/${resourceId}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                <FaEdit size={18} />
            </Link>
            <button 
                onClick={handleDelete} 
                disabled={isPending}
                className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                aria-label="Delete resource"
            >
                {isPending ? '...' : <FaTrash size={18} />}
            </button>
        </div>
    );
}