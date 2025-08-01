import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
          Welcome to <span className="text-primary">NAMVEMS</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
          Nigerian Association of Muslim Veterinary Medical Students
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/join" 
            className="bg-primary hover:bg-opacity-90 text-text font-semibold py-3 px-6 rounded-xl transition-colors inline-block text-center"
          >
            Join Us
          </Link>
          <Link 
            href="/events" 
            className="bg-accent hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-block text-center"
          >
            View Events
          </Link>
        </div>
      </div>
    </div>
  )
}