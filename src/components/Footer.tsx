import Link from 'next/link'
import { FaTelegram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-text mb-4">NAMVEMS</h3>
            <p className="text-gray-700">
              Nigerian Association of Muslim Veterinary Medical Students
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-700 hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/events" className="text-gray-700 hover:text-accent transition-colors">Events</Link></li>
              <li><Link href="/resources" className="text-gray-700 hover:text-accent transition-colors">Resources</Link></li>
              <li><Link href="/elibrary" className="text-gray-700 hover:text-accent transition-colors flex items-center">
                <FaTelegram className="mr-2" /> E-Library
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-text mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/resources" className="text-gray-700 hover:text-accent transition-colors">Website Resources</Link></li>
              <li><Link href="/elibrary" className="text-gray-700 hover:text-accent transition-colors flex items-center">
                <FaTelegram className="mr-2" /> Telegram Library
              </Link></li>
              <li><a href="https://t.me/namvemslibrary" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-700 hover:text-accent transition-colors flex items-center">
                <FaTelegram className="mr-2" /> Direct Telegram Link
              </a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-text mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="text-gray-700 hover:text-accent transition-colors">Twitter</a>
              <a href="#" className="text-gray-700 hover:text-accent transition-colors">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} NAMVEMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}