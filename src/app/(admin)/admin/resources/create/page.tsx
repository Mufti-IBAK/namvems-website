// src/app/(admin)/admin/resources/create/page.tsx
import ResourceForm from '../ResourceForm';
import { FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function CreateResourcePage() {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FaPlusCircle /> Upload New Resource
                </h1>
                <Link href="/admin/resources" className="btn-ghost">Back to Resources</Link>
            </div>
            <ResourceForm />
        </div>
    );
}