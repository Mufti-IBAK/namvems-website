// src/app/(admin)/admin/resources/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from 'next/link';
import { FaBook, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import ResourceActions from './ResourceActions';

type Resource = { id: number; title: string; type: string; created_at: string; };

async function getResources() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('resources')
        .select('id, title, type, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching resources:", error);
        return [];
    }
    return data;
}

export default async function ManageResourcesPage() {
    const resources: Resource[] = await getResources();

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FaBook /> Manage Resources
                </h1>
                <Link href="/admin/resources/create" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Upload New Resource
                </Link>
            </div>

            <div className="bg-white rounded-xl card-shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Title</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Type</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Upload Date</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {resources.map((resource) => (
                            <tr key={resource.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{resource.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{resource.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{format(new Date(resource.created_at), 'PPP')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center"><ResourceActions resourceId={resource.id} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {resources.length === 0 && (
                    <p className="text-center text-gray-500 p-8">No resources found. Upload one to get started!</p>
                )}
            </div>
        </div>
    );
}