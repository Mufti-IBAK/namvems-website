'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FaTelegram, FaUser, FaSignOutAlt } from 'react-icons/fa'
import gsap from 'gsap'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Resources', path: '/resources' },
    { name: 'E-Library', path: '/elibrary' },
    { name: 'About', path: '/about' },
  ]

  // GSAP animation for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      // Animate menu items
      gsap.fromTo('.mobile-menu-item-animate',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.1,
          ease: 'power2.out'
        }
      )
      
      // Animate menu container
      gsap.fromTo('.mobile-menu-container',
        { opacity: 0, height: 0 },
        { 
          opacity: 1, 
          height: 'auto',
          duration: 0.3,
          ease: 'power2.out'
        }
      )
    } else {
      // Animate menu closing
      gsap.to('.mobile-menu-container',
        { 
          opacity: 0, 
          height: 0,
          duration: 0.3,
          ease: 'power2.in'
        }
      )
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm py-4 px-4 md:px-6" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2" aria-label="NAMVEMS Home">
            {/* Logo Image */}
            <div className="relative w-10 h-10">
              <Image
                src="/assets/logo.png"
                alt="NAMVEMS Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-text">NAMVEMS</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium transition-colors duration-300 hover:text-primary flex items-center ${
                  pathname === link.path ? 'text-primary' : 'text-text'
                }`}
                aria-current={pathname === link.path ? 'page' : undefined}
              >
                {link.name === 'E-Library' && <FaTelegram className="mr-1" />}
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center text-text hover:text-primary transition-colors"
                >
                  <FaUser className="mr-2" />
                  <span className="hidden lg:inline">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center text-text hover:text-alert transition-colors"
                  aria-label="Sign out"
                >
                  <FaSignOutAlt className="mr-1" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden md:block bg-primary hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Login to your account"
              >
                Login
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-text focus:outline-none w-10 h-10 flex items-center justify-center"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen.toString()}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-menu"
            >
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block absolute w-6 h-0.5 bg-text rounded-sm transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}></span>
                <span className={`block absolute w-6 h-0.5 bg-text rounded-sm transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`block absolute w-6 h-0.5 bg-text rounded-sm transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          id="mobile-menu" 
          className="mobile-menu-container md:hidden overflow-hidden"
        >
          <div className="pb-4 pt-2">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`mobile-menu-item-animate py-3 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 flex items-center ${
                    pathname === link.path ? 'text-primary bg-primary/10' : 'text-text'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={pathname === link.path ? 'page' : undefined}
                >
                  {link.name === 'E-Library' && <FaTelegram className="mr-2" />}
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="mobile-menu-item-animate py-3 px-4 rounded-xl font-medium text-text hover:bg-gray-100 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="mobile-menu-item-animate py-3 px-4 rounded-xl font-medium text-alert hover:bg-gray-100 flex items-center w-full text-left"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  className="mobile-menu-item-animate bg-primary hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-300 mt-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Login to your account"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}