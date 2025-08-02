import React from 'react';
import { FaDownload, FaFilePdf, FaBook, FaVideo, FaImage, FaFileAlt, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

interface ResourceCardProps {
  title: string;
  type: 'handbook' | 'guide' | 'video' | 'image' | 'research' | 'other';
  description: string;
  fileSize?: string;
  downloadUrl: string;
  onDownload?: () => void;
  thumbnailUrl?: string;
  resourceId?: string; // Add resource ID for navigation
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  type,
  description,
  fileSize,
  downloadUrl,
  onDownload,
  thumbnailUrl,
  resourceId
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'handbook': return <FaBook className="text-2xl" />;
      case 'guide': return <FaFilePdf className="text-2xl" />;
      case 'video': return <FaVideo className="text-2xl" />;
      case 'image': return <FaImage className="text-2xl" />;
      case 'research': return <FaFileAlt className="text-2xl" />;
      default: return <FaFilePdf className="text-2xl" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'handbook': return 'bg-yellow-100 text-yellow-800';
      case 'guide': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'research': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) onDownload();
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 stagger-item">
      {thumbnailUrl && (
        <div className="relative h-40 rounded-lg overflow-hidden mb-4">
          {resourceId ? (
            <Link href={`/resources/${resourceId}`}>
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-full object-cover cursor-pointer"
              />
            </Link>
          ) : (
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${getTypeColor()}`}>
          {getTypeIcon()}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor()}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      
      <div className="mb-3">
        {resourceId ? (
          <Link href={`/resources/${resourceId}`} className="text-lg font-bold text-text line-clamp-2 hover:text-primary transition-colors">
            {title}
          </Link>
        ) : (
          <h3 className="text-lg font-bold text-text line-clamp-2">{title}</h3>
        )}
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
      
      {fileSize && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaDownload className="mr-2" />
          <span>{fileSize}</span>
        </div>
      )}
      
      <div className="flex gap-2">
        {resourceId && (
          <Link
            href={`/resources/${resourceId}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-semibold py-2 px-3 rounded-xl transition-all duration-300 text-center text-sm flex items-center justify-center"
            aria-label={`View details for ${title}`}
          >
            <FaSearch className="mr-1" />
            Details
          </Link>
        )}
        
        <button
          onClick={handleDownload}
          className="flex-1 bg-accent hover:bg-opacity-90 text-white font-semibold py-2 px-3 rounded-xl transition-all duration-300 flex items-center justify-center text-sm"
          aria-label={`Download ${title}`}
        >
          <FaDownload className="mr-1" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;