// src/app/(admin)/admin/resources/edit/[id]/page.tsx
import ResourceForm from '../../ResourceForm';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';

async function getResourceById(id: number) {
    const supabase = createClient();
    const { data, error } = await supabase.from('resources').select('*').eq('id', id).single();
    if (error) notFound();
    return data;
}

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const resourceId = Number(id);
    if (isNaN(resourceId)) notFound();
    
    const resource = await getResourceById(resourceId);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FaEdit /> Edit Resource
                </h1>
                <Link href="/admin/resources" className="btn-ghost">Back to Resources</Link>
            </div>
            <ResourceForm resource={resource} />
        </div>
    );
}