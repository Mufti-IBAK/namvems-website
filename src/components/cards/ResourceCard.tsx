import React from 'react';
import { FaDownload, FaFilePdf, FaBook, FaVideo, FaImage } from 'react-icons/fa';

interface ResourceCardProps {
  title: string;
  type: 'handbook' | 'guide' | 'video' | 'image' | 'other';
  description: string;
  fileSize?: string;
  downloadUrl: string;
  onDownload?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  type,
  description,
  fileSize,
  downloadUrl,
  onDownload
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'handbook': return <FaBook className="text-2xl" aria-hidden="true" />;
      case 'guide': return <FaFilePdf className="text-2xl" aria-hidden="true" />;
      case 'video': return <FaVideo className="text-2xl" aria-hidden="true" />;
      case 'image': return <FaImage className="text-2xl" aria-hidden="true" />;
      default: return <FaFilePdf className="text-2xl" aria-hidden="true" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'handbook': return 'bg-yellow-100 text-yellow-800';
      case 'guide': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = () => {
    if (onDownload) onDownload();
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 stagger-item">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${getTypeColor()}`} aria-label={`${type} resource`}>
          {getTypeIcon()}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor()}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-text mb-2 line-clamp-2">{title}</h3>
      
      <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
      
      {fileSize && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaDownload className="mr-2" aria-hidden="true" />
          <span>{fileSize}</span>
        </div>
      )}
      
      <button
        onClick={handleDownload}
        className="w-full bg-accent hover:bg-opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center interactive-button shadow-md hover:shadow-lg"
        aria-label={`Download ${title}`}
      >
        <FaDownload className="mr-2" aria-hidden="true" />
        Download
      </button>
    </div>
  );
};

export default ResourceCard;