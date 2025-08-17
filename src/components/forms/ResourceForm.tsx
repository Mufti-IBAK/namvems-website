'use client'

import React from 'react';

// FIX: Define a proper interface for the component's props
interface Resource {
    id?: number;
    title: string;
    description?: string;
    type: string;
    download_url: string;
    file_size?: string;
}

interface ResourceFormProps {
    resource: Resource;
    setResource: React.Dispatch<React.SetStateAction<Resource>>;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const ResourceForm = ({ resource, setResource, onSubmit, isLoading }: ResourceFormProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResource({ ...resource, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={resource.title || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          value={resource.description || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <input
          type="text"
          name="type"
          id="type"
          value={resource.type || ''}
          onChange={handleChange}
          required
          placeholder="e.g., handbook, guide, video"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="download_url" className="block text-sm font-medium text-gray-700">Download URL</label>
          <input
            type="text"
            name="download_url"
            id="download_url"
            value={resource.download_url || ''}
            onChange={handleChange}
            required
            placeholder="Link to the file (e.g., Google Drive)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="file_size" className="block text-sm font-medium text-gray-700">File Size (Optional)</label>
          <input
            type="text"
            name="file_size"
            id="file_size"
            value={resource.file_size || ''}
            onChange={handleChange}
            placeholder="e.g., 2.4 MB"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-primary hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Resource'}
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;