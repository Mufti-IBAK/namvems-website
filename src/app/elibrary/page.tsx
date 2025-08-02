'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import SecondaryButton from '@/components/buttons/SecondaryButton'
import { FaTelegram, FaBook, FaVideo, FaGraduationCap, FaMosque } from 'react-icons/fa'

export default function ELibraryPage() {
  const router = useRouter()

  const telegramLink = "https://t.me/namvemslibrary"

  const handleRedirect = () => {
    window.open(telegramLink, '_blank')
  }

  const resourceCategories = [
    {
      icon: <FaBook className="text-2xl" />,
      title: "E-Books",
      description: "Comprehensive textbooks and reference materials for veterinary courses"
    },
    {
      icon: <FaVideo className="text-2xl" />,
      title: "Video Lectures",
      description: "Recorded lectures and educational videos from experts"
    },
    {
      icon: <FaGraduationCap className="text-2xl" />,
      title: "Academic Resources",
      description: "Study guides, research papers, and academic materials"
    },
    {
      icon: <FaMosque className="text-2xl" />,
      title: "Islamic Courses",
      description: "Religious education materials and Islamic studies resources"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-6">
          <FaTelegram className="text-white text-3xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
          NAMVEMS E-Library
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Access our extensive collection of veterinary and Islamic educational resources
        </p>
      </div>

      {/* Telegram Info Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
            <div className="bg-white/20 rounded-full p-6">
              <FaTelegram className="text-6xl" />
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">Join Our Telegram Library</h2>
            <p className="text-lg mb-6">
              Access hundreds of veterinary textbooks, lecture videos, research papers, 
              and Islamic educational materials in our dedicated Telegram channel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <PrimaryButton 
                onClick={handleRedirect}
                className="bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center"
                aria-label="Join Telegram library"
              >
                <FaTelegram className="mr-2" />
                Join Telegram Channel
              </PrimaryButton>
              <SecondaryButton 
                onClick={() => router.push('/resources')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                aria-label="Browse website resources"
              >
                Browse Website Resources
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-8 text-center">Available Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-primary mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-bold text-text mb-2">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-text mb-6 text-center">Why Join Our E-Library?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="text-black font-bold text-xl">100+</span>
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Extensive Collection</h3>
            <p className="text-gray-600">Hundreds of resources covering veterinary and Islamic studies</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Expert Curated</h3>
            <p className="text-gray-600">Resources selected by veterinary professionals and scholars</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-alert rounded-full mb-4">
              <span className="text-white font-bold text-xl">Free</span>
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Completely Free</h3>
            <p className="text-gray-600">All resources available at no cost to members</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Ready to Access Our Resources?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Join our Telegram channel to get instant access to our complete library of educational materials
        </p>
        <PrimaryButton 
          onClick={handleRedirect}
          size="lg"
          className="flex items-center justify-center mx-auto"
          aria-label="Join Telegram library now"
        >
          <FaTelegram className="mr-2" />
          Join Telegram Library Now
        </PrimaryButton>
      </div>
    </div>
  )
}