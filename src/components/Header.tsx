'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          <span className="text-xl font-bold text-text">NAMVEMS</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-text hover:text-primary transition-colors">Home</Link>
          <Link href="/events" className="text-text hover:text-primary transition-colors">Events</Link>
          <Link href="/resources" className="text-text hover:text-primary transition-colors">Resources</Link>
          <Link href="/about" className="text-text hover:text-primary transition-colors">About</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-primary hover:bg-opacity-90 text-text font-semibold py-2 px-4 rounded-xl transition-colors">
            Login
          </button>
        </div>
      </div>
    </nav>
  )
}