export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-text mb-4">NAMVEMS</h3>
            <p className="text-gray-700">
              Nigerian Association of Muslim Veterinary Medical Students
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-accent transition-colors">Events</a></li>
              <li><a href="#" className="text-gray-700 hover:text-accent transition-colors">Resources</a></li>
              <li><a href="#" className="text-gray-700 hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-700 hover:text-accent transition-colors">Contact</a></li>
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