'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-sm py-4 px-6" role="navigation" aria-label="Main navigation">
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
                className={`font-medium transition-colors duration-300 hover:text-primary ${
                  pathname === link.path ? 'text-primary' : 'text-text'
                }`}
                aria-current={pathname === link.path ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="hidden md:block bg-primary hover:bg-opacity-90 text-text font-semibold py-2 px-6 rounded-xl transition-all duration-300 interactive-button shadow-md hover:shadow-lg"
              aria-label="Login to your account"
            >
              Login
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-text focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen || undefined}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-6 h-0.5 bg-text rounded-sm transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}></span>
                <span className={`block w-6 h-0.5 bg-text rounded-sm my-1 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`block w-6 h-0.5 bg-text rounded-sm transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`mobile-menu-item py-2 px-4 rounded-xl font-medium transition-colors duration-300 hover:bg-gray-100 ${
                    pathname === link.path ? 'text-primary bg-primary/10' : 'text-text'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={pathname === link.path ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                className="mobile-menu-item bg-primary hover:bg-opacity-90 text-text font-semibold py-3 px-4 rounded-xl transition-all duration-300 mt-2 interactive-button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Login to your account"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}