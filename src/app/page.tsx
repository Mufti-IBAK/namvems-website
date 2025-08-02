'use client'

import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import SecondaryButton from '@/components/buttons/SecondaryButton'
import EventCard from '@/components/cards/EventCard'
import ResourceCard from '@/components/cards/ResourceCard'
import ParallaxSection from '@/components/ParallaxSection'
import { FaTelegram } from 'react-icons/fa'

export default function Home() {
  useGSAPAnimations()

  const handleRegister = () => {
    console.log('Register button clicked')
  }

  const handleDownload = () => {
    console.log('Download button clicked')
  }

  // Veterinary and African-related image URLs
  const heroImageUrl = "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  const aboutImageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
  const communityImageUrl = "https://images.unsplash.com/photo-1577962916589-48cd4d594a51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
  const statsImageUrl = "https://images.unsplash.com/photo-1581595219310-3c40e30f8484?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  const event1ImageUrl = "https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  const event2ImageUrl = "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  const event3ImageUrl = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center parallax-element parallax-bg"
          style={{ 
            backgroundImage: `url(${heroImageUrl})`
          }}
          role="img"
          aria-label="Veterinary students working together"
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Welcome to <span className="text-primary">NAMVEMS</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
              Empowering Nigerian Veterinary Medical Students Nationwide
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row justify-center gap-4">
              <PrimaryButton size="lg" aria-label="Join our community">
                Join Our Community
              </PrimaryButton>
              <SecondaryButton size="lg" variant="outline" aria-label="Explore events">
                Explore Events
              </SecondaryButton>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center">
            <div className="w-1 h-3 bg-white mt-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 fade-in-up" aria-labelledby="about-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-text mb-4">
              About Our Organization
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-text mb-6">
                Supporting the Next Generation of Veterinary Professionals
              </h3>
              <p className="text-gray-700 mb-6 text-lg">
                The Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS) 
                is dedicated to fostering a supportive community for Muslim students pursuing 
                careers in veterinary medicine. We provide academic resources, professional 
                networking opportunities, and spiritual guidance.
              </p>
              <p className="text-gray-700 mb-8 text-lg">
                Our mission is to create an inclusive environment where students can thrive 
                academically and personally while maintaining their faith and values.
              </p>
              <PrimaryButton aria-label="Learn more about NAMVEMS">
                Learn More About Us
              </PrimaryButton>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${aboutImageUrl})` }}
                  role="img"
                  aria-label="Veterinary students in a classroom"
                ></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-xl z-[-1]"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent rounded-xl z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <ParallaxSection 
        backgroundImageUrl={statsImageUrl}
        height="h-80"
        overlayOpacity={0.7}
        aria-label="Organization statistics"
      >
        <div className="container mx-auto px-4 text-center text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in-up">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl">Active Members</div>
            </div>
            <div className="fade-in-up">
              <div className="text-5xl font-bold mb-2">25+</div>
              <div className="text-xl">Campus Chapters</div>
            </div>
            <div className="fade-in-up">
              <div className="text-5xl font-bold mb-2">15</div>
              <div className="text-xl">Years of Service</div>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Events Preview */}
      <section className="py-20 bg-gray-50 stagger-container" aria-labelledby="events-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="events-heading" className="text-3xl md:text-4xl font-bold text-text mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Join us for conferences, workshops, and networking opportunities
            </p>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventCard
              title="Annual Conference 2024"
              date={new Date('2024-03-15T09:00:00')}
              description="Join us for our annual conference featuring keynote speakers and networking opportunities with industry professionals."
              location="Convention Center, Abuja"
              category="Conference"
              maxAttendees={150}
              registeredCount={87}
              onRegister={handleRegister}
              imageUrl={event1ImageUrl}
            />
            <EventCard
              title="Study Group Session"
              date={new Date('2024-02-20T18:00:00')}
              description="Weekly study group for veterinary board exam preparation with peer support and expert guidance."
              location="Online via Zoom"
              category="Study Group"
              onRegister={handleRegister}
              imageUrl={event2ImageUrl}
            />
            <EventCard
              title="Career Development Workshop"
              date={new Date('2024-04-05T14:00:00')}
              description="Learn about career paths in veterinary medicine and get resume review from industry professionals."
              location="University Campus, Lagos"
              category="Workshop"
              maxAttendees={50}
              registeredCount={48}
              onRegister={handleRegister}
              imageUrl={event3ImageUrl}
            />
          </div>
          
          <div className="text-center mt-12">
            <SecondaryButton size="lg" aria-label="View all events">
              View All Events
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* Resources Preview */}
   <section className="py-20 stagger-container" aria-labelledby="resources-heading">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 id="resources-heading" className="text-3xl md:text-4xl font-bold text-text mb-4">
        Featured Resources
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Download handbooks, guides, and educational materials
      </p>
      <div className="w-20 h-1 bg-primary mx-auto"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ResourceCard
        title="Student Handbook 2024"
        type="handbook"
        description="Complete guide for new members with organization policies and resources."
        fileSize="2.4 MB"
        downloadUrl="#"
        onDownload={handleDownload}
      />
      <ResourceCard
        title="Career Development Guide"
        type="guide"
        description="Tips and resources for building a successful career in veterinary medicine."
        fileSize="1.8 MB"
        downloadUrl="#"
        onDownload={handleDownload}
      />
      <ResourceCard
        title="Interview Preparation Video"
        type="video"
        description="Expert tips for veterinary school interviews and common questions."
        fileSize="45.2 MB"
        downloadUrl="#"
        onDownload={handleDownload}
      />
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white flex flex-col justify-between">
        <div>
          <div className="flex justify-center mb-4">
            <FaTelegram className="text-4xl" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-center">E-Library Access</h3>
          <p className="text-sm mb-4 text-center">
            Join our Telegram channel for hundreds of veterinary and Islamic resources
          </p>
        </div>
        <Link 
          href="/elibrary"
          className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-center text-sm"
          aria-label="Access our Telegram e-library"
        >
          Join Now
        </Link>
      </div>
    </div>
  </div>
</section>
      {/* Community Section */}
      <ParallaxSection 
        backgroundImageUrl={communityImageUrl}
        height="h-96"
        overlayOpacity={0.6}
        aria-label="Join our community"
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in-up">
            Join Our Growing Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto fade-in-up">
            Connect with fellow students, professionals, and mentors who share your passion
          </p>
          <div className="fade-in-up">
            <PrimaryButton size="lg" variant="outline" aria-label="Become a member">
              Become a Member
            </PrimaryButton>
          </div>
        </div>
      </ParallaxSection>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-black mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already part of our community
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <PrimaryButton size="lg" aria-label="Sign up now">
              Sign Up Now
            </PrimaryButton>
            <SecondaryButton size="lg" variant="outline" aria-label="Contact us">
              Contact Us
            </SecondaryButton>
          </div>
        </div>
      </section>
    </div>
  )
}