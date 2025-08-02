'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { resourcesService } from '@/lib/services/resourcesService'
import { Resource } from '@/lib/types/resource'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import { FaArrowLeft, FaDownload, FaEye, FaFileDownload } from 'react-icons/fa'
import { format } from 'date-fns'

export default function ResourceDetailPage() {
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const params = useParams()
  const router = useRouter()
  const resourceId = params.id as string

  useEffect(() => {
    if (resourceId) {
      fetchResource()
    }
  }, [resourceId])

  const fetchResource = async () => {
    try {
      setLoading(true)
      const resourceData = await resourcesService.getResourceById(resourceId)
      if (resourceData) {
        setResource(resourceData)
        // Update view count
        setResource(prev => prev ? {
          ...prev,
          views: prev.views + 1
        } : null)
      } else {
        setError('Resource not found')
      }
    } catch (err) {
      setError('Failed to load resource details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!resource) return
    
    try {
      setIsDownloading(true)
      const success = await resourcesService.downloadResource(resourceId)
      if (success) {
        // Update download count
        setResource(prev => prev ? {
          ...prev,
          downloads: prev.downloads + 1
        } : null)
        
        // Open download link in new tab
        window.open(resource.downloadUrl, '_blank')
      }
    } catch (err) {
      console.error('Failed to download resource', err)
    } finally {
      setIsDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resource details...</p>
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-alert mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">Resource Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The resource you are looking for does not exist.'}</p>
          <button 
            onClick={() => router.push('/resources')}
            className="text-accent hover:text-opacity-80 font-semibold flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Resources
          </button>
        </div>
      </div>
    )
  }

  const getTypeColor = () => {
    switch (resource.type) {
      case 'handbook': return 'bg-yellow-100 text-yellow-800';
      case 'guide': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'research': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = () => {
    switch (resource.category) {
      case 'academic': return 'bg-indigo-100 text-indigo-800';
      case 'career': return 'bg-orange-100 text-orange-800';
      case 'professional': return 'bg-teal-100 text-teal-800';
      case 'personal': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => router.push('/resources')}
          className="text-accent hover:text-opacity-80 font-semibold flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Resources
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {resource.thumbnailUrl && (
          <div className="h-80 relative">
            <img 
              src={resource.thumbnailUrl} 
              alt={resource.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{resource.title}</h1>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {!resource.thumbnailUrl && (
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">{resource.title}</h1>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-4">Description</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-4">Resource Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-600 mb-1">Type</h3>
                    <p className="text-text capitalize">{resource.type}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-600 mb-1">Category</h3>
                    <p className="text-text capitalize">{resource.category}</p>
                  </div>
                  
                  {resource.fileSize && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-600 mb-1">File Size</h3>
                      <p className="text-text">{resource.fileSize}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-600 mb-1">Date Added</h3>
                    <p className="text-text">
                      {format(resource.createdAt, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-text mb-6">Download Resource</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaEye className="mr-2" />
                  <span>{resource.views} views</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FaDownload className="mr-2" />
                  <span>{resource.downloads} downloads</span>
                </div>
              </div>

              <div className="mb-4">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor()}`}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </div>
                <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor()}`}>
                  {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-accent hover:bg-opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {isDownloading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Downloading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaFileDownload className="mr-2" />
                    Download Resource
                  </span>
                )}
              </button>
              
              {resource.fileSize && (
                <p className="text-gray-600 text-sm text-center mt-2">
                  File size: {resource.fileSize}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}