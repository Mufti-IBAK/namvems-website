// src/app/(admin)/layout-component.tsx
'use client'

import { useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { 
    FaCalendarAlt, FaBook, FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes, FaUsers, FaSpinner,
    FaHome, FaGlobe, FaUserCheck, FaImage, FaMoneyBillWave, FaCog
} from 'react-icons/fa';

function NavLink({ href, icon: Icon, label, isSidebarOpen, onNavigate }: { href: string, icon: React.ElementType, label: string, isSidebarOpen: boolean, onNavigate?: () => void }) {
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = () => {
        if (onNavigate) onNavigate();
    };
    return (
        <Link href={href} className="flex items-center py-3 px-6 text-gray-700 hover:bg-primary hover:text-black transition-colors duration-200" onClick={handleClick}>
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

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, loading, signOut, userRole } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
  
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    
    // GSAP Animation for mobile menu
    useEffect(() => {
        const sidebar = sidebarRef.current;
        const backdrop = backdropRef.current;
        
        if (sidebar && backdrop) {
            if (isMobileMenuOpen) {
                // Animate sidebar in
                gsap.set(sidebar, { x: '-100%' });
                gsap.set(backdrop, { opacity: 0, display: 'block' });
                
                gsap.timeline()
                    .to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' })
                    .to(sidebar, { x: '0%', duration: 0.4, ease: 'power3.out' }, '-=0.1');
            } else {
                // Animate sidebar out
                gsap.timeline()
                    .to(sidebar, { x: '-100%', duration: 0.3, ease: 'power2.in' })
                    .to(backdrop, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1')
                    .set(backdrop, { display: 'none' });
            }
        }
    }, [isMobileMenuOpen]);
    
    // Mobile toggle function
    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    // Collapse sidebar when clicking outside (desktop only)
    useEffect(() => {
        const onClickAway = (e: MouseEvent) => {
            const sidebar = sidebarRef.current;
            if (!sidebar) return;
            const target = e.target as Node;
            const clickedOutside = !sidebar.contains(target);
            if (!isMobileMenuOpen && isSidebarOpen && clickedOutside) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickAway);
        return () => document.removeEventListener('mousedown', onClickAway);
    }, [isMobileMenuOpen, isSidebarOpen]);
    
    // This state is the key to fixing the mobile reload bug.
    const [initialCheckCompleted, setInitialCheckCompleted] = useState(false);

    useEffect(() => {
        // This effect runs when the auth state changes.
        if (!loading) {
            const hasAdminRole = user && (userRole === 'admin' || userRole === 'super_admin');
            if (hasAdminRole) {
                // If they are an admin, we lock in the state. The loading screen will disappear.
                setInitialCheckCompleted(true);
            } else {
                // If they are not an admin, redirect.
                router.replace('/login');
            }
        }
    }, [user, userRole, loading, router]);

    // Handle body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // This effect handles closing the mobile menu on navigation.
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // This is the stable guard. It will only show the loading screen on the very first load.
    // It will NOT re-trigger on mobile tab focus.
    if (!initialCheckCompleted) {
        return <AdminLoadingScreen />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside 
                ref={sidebarRef}
                data-mobile-open={isMobileMenuOpen}
                className={`fixed md:sticky md:top-0 inset-y-0 left-0 bg-white shadow-xl z-50 md:z-30 
                           ${isMobileMenuOpen ? '' : '-translate-x-full md:translate-x-0'} 
${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col h-screen overflow-y-auto`}>
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between h-16 flex-shrink-0">
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
                
                {/* Scrollable Navigation Content - Contains ALL navigation items */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {/* Top Navigation - Dashboard and main links */}
                    <div className="px-2 py-4 space-y-2">
<NavLink href="/admin" icon={FaTachometerAlt} label="Dashboard" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
<NavLink href="/admin/events" icon={FaCalendarAlt} label="Manage Events" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
<NavLink href="/admin/resources" icon={FaBook} label="Manage Resources" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
<NavLink href="/admin/gallery" icon={FaImage} label="Gallery" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
<NavLink href="/admin/registrations" icon={FaUserCheck} label="Event Registrations" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
<NavLink href="/admin/payments" icon={FaMoneyBillWave} label="Payments" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
<NavLink href="/admin/settings/payments" icon={FaCog} label="Payment Settings" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
                        {userRole === 'super_admin' && (
<NavLink href="/admin/users" icon={FaUsers} label="Manage Users" isSidebarOpen={isSidebarOpen} onNavigate={() => { if (isMobileMenuOpen) { setIsMobileMenuOpen(false) } else { setIsSidebarOpen(false) } }} />
                        )}
                    </div>
                    
                    {/* Spacer for better mobile layout */}
                    <div className="h-8"></div>
                    
                    {/* Public Site Links */}
                    <div className="px-2 pb-2 border-t mt-4">
                        <div className="pt-4">
                            <p className={`px-6 text-xs text-gray-400 font-semibold uppercase tracking-wider transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>
                                Public Site
                            </p>
                            <div className="mt-2 space-y-2">
                                <NavLink href="/" icon={FaHome} label="Homepage" isSidebarOpen={isSidebarOpen} />
                                <NavLink href="/events" icon={FaGlobe} label="Events Page" isSidebarOpen={isSidebarOpen} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Sign Out - At bottom of scrollable area */}
                    <div className="px-2 pb-4 border-t mt-4">
                        <div className="pt-4">
                            <button onClick={() => signOut()} className="flex items-center w-full py-3 px-6 text-red-500 hover:bg-red-100 rounded-md transition-colors text-sm">
                                <FaSignOutAlt size={20} className="flex-shrink-0"/>
                                <span className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>Sign Out</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Extra padding at bottom for better mobile scrolling */}
                    <div className="h-8 md:h-0"></div>
                </div>
            </aside>
            
            {/* Backdrop */}
            <div 
                ref={backdropRef}
                onClick={() => setIsMobileMenuOpen(false)} 
                className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                style={{ display: 'none' }}
                aria-hidden="true" 
            />

            <div className="flex-1 flex flex-col w-full">
                <header className="md:hidden bg-white shadow-md flex items-center justify-between p-4 h-16 sticky top-0 z-50">
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