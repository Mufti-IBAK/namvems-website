'use client'

import { useEffect, useState} from 'react'; // REMOVED: Unused 'ReactNode' import is no longer needed
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
// FIXED: Removed FaSignOutAlt as it was unused, but let's re-add it and use it.
import { FaCalendarAlt, FaBook, FaSignOutAlt, FaHome, FaBars, FaTimes } from 'react-icons/fa';

// FIXED: The type for children is React.ReactNode
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // FIXED: Removed 'signOut' as it was unused, but now let's use it.
  const { user, loading, signOut, userRole } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      router.push('/login');
    }
  }, [user, userRole, loading, router]);

  if (loading || !user || userRole !== 'admin') {
    return <div>Loading...</div>; // Or a proper loading spinner component
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- COLLAPSIBLE SIDEBAR --- */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b flex items-center justify-between">
            <Link href="/" className={`text-2xl font-bold text-primary transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>NAMVEMS</Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
        </div>
        <nav className="mt-6 flex-1"> {/* Added flex-1 to push the bottom content down */}
            <Link href="/admin/events" className="flex items-center py-3 px-6 text-gray-700 hover:bg-primary hover:text-black transition-colors">
                <FaCalendarAlt size={20} />
                <span className={`ml-4 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>Manage Events</span>
            </Link>
            <Link href="/admin/resources" className="flex items-center py-3 px-6 text-gray-700 hover:bg-primary hover:text-black transition-colors">
                <FaBook size={20} />
                <span className={`ml-4 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>Manage Resources</span>
            </Link>
        </nav>
        <div className={`border-t p-4 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <Link href="/" className="flex items-center py-3 px-6 text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-sm mb-2">
                <FaHome size={20} />
                <span className={`ml-4 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>Back to Site</span>
            </Link>
            {/* ADDED: A sign-out button to use the 'signOut' function and 'FaSignOutAlt' icon */}
            <button onClick={() => signOut()} className="flex items-center w-full py-3 px-6 text-red-500 hover:bg-red-100 rounded-md transition-colors text-sm">
                <FaSignOutAlt size={20} />
                <span className={`ml-4 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>Sign Out</span>
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
              {/* FIXED: Render the children prop here */}
              {children}
          </main>
      </div>
    </div>
  );
}