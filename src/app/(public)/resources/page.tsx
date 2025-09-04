'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Resource } from '@/lib/types/resource'
import ResourceCard from '@/components/cards/ResourceCard'
import PrimaryButton from '@/components/buttons/PrimaryButton'

export default function ResourcesPage() {
  const supabase = createClient();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'handbook', label: 'Handbooks' },
    { value: 'guide', label: 'Guides' },
    { value: 'video', label: 'Videos' },
    { value: 'research', label: 'Research' },
  ];

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public resources:', error);
      setError('Failed to load resources. Please try again later.');
    } else {
      const formattedData = data.map(resource => ({
        ...resource,
        downloadUrl: resource.download_url,
        fileSize: resource.file_size,
      }));
      setResources(formattedData);
      setFilteredResources(formattedData);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    let result = [...resources];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(lowerQuery) ||
        (resource.description && resource.description.toLowerCase().includes(lowerQuery))
      );
    }
    
    if (selectedType !== 'all') {
      result = result.filter(resource => resource.type === selectedType);
    }
    
    setFilteredResources(result);
  }, [resources, searchQuery, selectedType]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-16 text-center pt-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
    );
  }

  if (error) {
     return (
        <div className="container mx-auto px-4 py-16 text-center pt-24">
            <h2 className="text-2xl font-bold text-text mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <PrimaryButton onClick={fetchResources}>Try Again</PrimaryButton>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">Resource Library</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Download handbooks, guides, videos, and other educational materials.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label htmlFor="search-resources" className="sr-only">Search Resources</label>
              <input
                id="search-resources"
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
          </div>
          <div>
              <label htmlFor="resource-type-filter" className="sr-only">Filter by Resource Type</label>
              <select
                id="resource-type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
          </div>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-text mb-2">No Resources Found</h3>
          <p className="text-gray-700">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              type={resource.type}
              description={resource.description}
              {...(resource.fileSize ? { fileSize: resource.fileSize } : {})}
              downloadUrl={resource.downloadUrl}
              onDownload={() => console.log('Download initiated')}
            />
          ))}
        </div>
      )}
    </div>
  );
}