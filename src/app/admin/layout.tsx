'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user is found, redirect to login
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    }
  }, [user, loading, router]);

  // While loading, show a spinner or a blank screen to prevent content flashing
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in, show the admin layout and content
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-800">Admin Dashboard</Link>
            </div>
            <div className="flex items-center space-x-4">
               <Link href="/admin/events" className="text-gray-600 hover:text-primary">Manage Events</Link>
               <Link href="/admin/resources" className="text-gray-600 hover:text-primary">Manage Resources</Link>
               <button onClick={signOut} className="bg-primary text-black text-sm font-medium py-2 px-4 rounded-md hover:bg-yellow-500">
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}