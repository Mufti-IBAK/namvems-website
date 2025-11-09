'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userRole, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- DERIVED STATE FOR CLARITY ---
  // This makes our JSX cleaner and less error-prone.
  // It checks if the user has ANY level of admin access.
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const UserDisplay = () => {
    if (!user) {
      return (
        <Link href="/login" className="hidden md:block bg-primary hover:bg-opacity-90 text-text font-semibold py-2 px-6 rounded-xl transition-all duration-300">
          Login
        </Link>
      );
    }
    return (
      <div className="hidden md:flex items-center space-x-4">
        <span className="font-medium text-gray-700">
          Welcome, {user.user_metadata?.full_name?.split(' ')[0] || 'Member'}
        </span>
        <button 
          onClick={signOut}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${ scrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-sm py-4' }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image src="/assets/logo.png" alt="NAMVEMS Logo" fill={true} style={{objectFit: 'contain'}} />
            </div>
            <span className="text-xl font-bold text-text">NAMVEMS</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium transition-colors duration-300 hover:text-primary text-text">Home</Link>
            <Link href="/events" className="font-medium transition-colors duration-300 hover:text-primary text-text">Events</Link>
            <Link href="/resources" className="font-medium transition-colors duration-300 hover:text-primary text-text">Resources</Link>
            <Link href="/payment" className="font-medium transition-colors duration-300 hover:text-primary text-text">Payment</Link>
            <Link href="/about" className="font-medium transition-colors duration-300 hover:text-primary text-text">About</Link>

            {/* Dashboard Link - visible when logged in */}
            {user && (
              <Link href="/dashboard" className="font-medium transition-colors duration-300 hover:text-primary text-text">
                Dashboard
              </Link>
            )}

            {/* --- FIX: Use our new 'isAdmin' variable --- */}
            {isAdmin && (
              <Link href="/admin" className="font-medium text-red-600 hover:text-primary transition-colors duration-300">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <UserDisplay />
            <button 
                className="md:hidden text-text focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-text rounded-sm transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                  <span className={`block w-6 h-0.5 bg-text rounded-sm my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block w-6 h-0.5 bg-text rounded-sm transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4" id="mobile-menu">
            <div className="flex flex-col space-y-3">
                <Link href="/" className="mobile-menu-item py-2 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 text-text" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link href="/events" className="mobile-menu-item py-2 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 text-text" onClick={() => setIsMenuOpen(false)}>Events</Link>
                <Link href="/resources" className="mobile-menu-item py-2 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 text-text" onClick={() => setIsMenuOpen(false)}>Resources</Link>
                <Link href="/payment" className="mobile-menu-item py-2 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 text-text" onClick={() => setIsMenuOpen(false)}>Payment</Link>
                <Link href="/about" className="mobile-menu-item py-2 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 text-text" onClick={() => setIsMenuOpen(false)}>About</Link>
                
                {/* Dashboard Link - visible when logged in */}
                {user && (
                    <Link href="/dashboard" className="mobile-menu-item py-2 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 text-text" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                    </Link>
                )}
                
                {/* --- FIX: Use our new 'isAdmin' variable here as well --- */}
                {isAdmin && (
                    <Link href="/admin" className="mobile-menu-item py-2 px-4 rounded-xl font-medium text-red-600 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                        Admin Panel
                    </Link>
                )}

                <div className="border-t border-gray-200 pt-4 mt-2">
                    {user ? (
                        <>
                            <p className="px-4 mb-2 font-medium text-gray-700">Welcome, {user.user_metadata?.full_name || 'Member'}</p>
                            <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="mobile-menu-item text-left w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="mobile-menu-item block text-center bg-primary hover:bg-opacity-90 text-text font-semibold py-3 px-4 rounded-xl transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                            Login
                        </Link>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}