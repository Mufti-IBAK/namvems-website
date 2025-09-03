// src/app/(admin)/layout.tsx
'use client'

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link'; // --- FIX: Restore the correct Next.js Link component ---
import Image from 'next/image';
import { 
    FaCalendarAlt, FaBook, FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes, FaUsers, FaSpinner,
    FaHome, FaGlobe
} from 'react-icons/fa';
import { AdminLayoutProvider, useAdminLayout } from '@/context/AdminLayoutContext';

// --- FIX: Simplified the NavLink to use the proper Link component ---
function NavLink({ href, icon: Icon, label, isSidebarOpen }: { href: string, icon: React.ElementType, label: string, isSidebarOpen: boolean }) {
    return (
        <Link href={href} className="flex items-center py-3 px-6 text-gray-700 hover:bg-primary hover:text-black transition-colors duration-200">
            <Icon size={20} className="flex-shrink-0" />
            <span className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>{label}</span>
        </Link>
    );
}

function AdminLoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <FaSpinner className="animate-spin text-primary text-4xl" />
                <p className="text-gray-600">Verifying Admin Access...</p>
            </div>
        </div>
    );
}

function AdminLayoutShell({ children }: { children: ReactNode }) {
    const { userRole, signOut } = useAuth();
    const pathname = usePathname();
    const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useAdminLayout();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        }
    }, [pathname, closeMobileMenu, isMobileMenuOpen]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside 
                className={`fixed md:relative inset-y-0 left-0 bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out 
                           ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                           md:translate-x-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="p-4 border-b flex items-center justify-between h-16">
                    {/* --- FIX: Using Link component --- */}
                    <Link href="/admin" className={`flex items-center space-x-2 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 md:opacity-100 md:sr-only'}`}>
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <Image src="/assets/logo.png" alt="NAMVEMS Logo" fill={true} style={{objectFit: 'contain'}} />
                        </div>
                        <span className="text-xl font-bold text-text">NAMVEMS</span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100 hidden md:block">
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <nav className="mt-4 flex flex-col h-[calc(100vh-64px)]">
                    <div className="flex-grow space-y-2">
                        <NavLink href="/admin" icon={FaTachometerAlt} label="Dashboard" isSidebarOpen={isSidebarOpen} />
                        <NavLink href="/admin/events" icon={FaCalendarAlt} label="Manage Events" isSidebarOpen={isSidebarOpen} />
                        <NavLink href="/admin/resources" icon={FaBook} label="Manage Resources" isSidebarOpen={isSidebarOpen} />
                        {userRole === 'super_admin' && (
                            <NavLink href="/admin/users" icon={FaUsers} label="Manage Users" isSidebarOpen={isSidebarOpen} />
                        )}
                    </div>
                    <div className="border-t mt-4 pt-2">
                         <p className={`px-6 text-xs text-gray-400 font-semibold uppercase tracking-wider transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>
                           Public Site
                         </p>
                        <div className="mt-2 space-y-2">
                            <NavLink href="/" icon={FaHome} label="Homepage" isSidebarOpen={isSidebarOpen} />
                            <NavLink href="/events" icon={FaGlobe} label="Events Page" isSidebarOpen={isSidebarOpen} />
                        </div>
                    </div>
                    <div className="border-t mt-4 p-4">
                        <button onClick={() => signOut()} className="flex items-center w-full py-3 px-6 text-red-500 hover:bg-red-100 rounded-md transition-colors text-sm">
                            <FaSignOutAlt size={20} className="flex-shrink-0"/>
                            <span className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>Sign Out</span>
                        </button>
                    </div>
                </nav>
            </aside>
            
            <div onClick={closeMobileMenu} className={`fixed inset-0 bg-black/50 z-20 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} aria-hidden="true" />

            <div className="flex-1 flex flex-col w-full">
                <header className="md:hidden bg-white shadow-md flex items-center justify-between p-4 h-16 sticky top-0 z-10">
                    {/* --- FIX: Using Link component --- */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="relative w-10 h-10">
                            <Image src="/assets/logo.png" alt="NAMVEMS Logo" fill={true} style={{objectFit: 'contain'}} />
                        </div>
                        <span className="text-xl font-bold text-text">NAMVEMS</span>
                    </Link>
                    <button onClick={toggleMobileMenu} className="p-2 rounded-md hover:bg-gray-100">
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, loading, userRole } = useAuth();
    const router = useRouter();
    const [initialAuthCompleted, setInitialAuthCompleted] = useState(false);

    useEffect(() => {
        if (!loading) {
            const hasAdminRole = user && (userRole === 'admin' || userRole === 'super_admin');
            if (!hasAdminRole) {
                router.replace('/login');
            } else {
                setInitialAuthCompleted(true);
            }
        }
    }, [loading, user, userRole, router]);

    if (!initialAuthCompleted) {
        return <AdminLoadingScreen />;
    }

    return (
        <AdminLayoutProvider>
            <AdminLayoutShell>{children}</AdminLayoutShell>
        </AdminLayoutProvider>
    );
}