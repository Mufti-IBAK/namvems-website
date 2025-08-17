'use client'

import React from 'react';
import { FaDownload, FaFilePdf, FaBook, FaVideo, FaImage, FaFlask } from 'react-icons/fa'; // Added FaFlask for research
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// FIX: Update this interface to include 'research'
interface ResourceCardProps {
  title: string;
  type: 'handbook' | 'guide' | 'video' | 'image' | 'research' | 'other';
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
  const { user } = useAuth();

  const handleDownload = () => {
    if (onDownload) onDownload();
    window.open(downloadUrl, '_blank');
  };
  
  const ActionButton = () => {
    if (!user) {
      return (
        <Link href="/login" className="w-full block text-center bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold py-2 px-4 rounded-xl transition-colors">
          Login to Download
        </Link>
      );
    }
    return (
      <button
        onClick={handleDownload}
        className="bg-accent hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors w-full"
      >
        Download
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded capitalize`}>
            {type}
          </span>
        </div>
        <p className="text-gray-700 mb-4 h-20 overflow-hidden">{description}</p>
        {fileSize && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FaDownload className="mr-1" />
            <span>{fileSize}</span>
          </div>
        )}
      </div>
      <ActionButton />
    </div>
  );
};

export default ResourceCard;