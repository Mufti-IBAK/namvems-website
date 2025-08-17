'use client'

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {user?.user_metadata?.full_name || user?.email}
            </h1>
            <p className="text-gray-600 mb-8">
                From here you can manage the content of the NAMVEMS website.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/events" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-bold mb-2">Manage Events</h2>
                    <p className="text-gray-700">Create, edit, and delete event listings.</p>
                </Link>
                <Link href="/admin/resources" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-bold mb-2">Manage Resources</h2>
                    <p className="text-gray-700">Add, edit, and delete downloadable resources.</p>
                </Link>
            </div>
        </div>
    );
}