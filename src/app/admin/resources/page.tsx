'use client'

import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useAuth } from '@/context/AuthContext';
import ResourceForm from '@/components/forms/ResourceForm';

interface Resource {
  id?: number;
  title: string;
  description?: string;
  type: string;
  download_url: string;
  file_size?: string;
}

const initialResourceState: Resource = {
  title: '',
  description: '',
  type: '',
  download_url: '',
  file_size: '',
};

export default function ManageResourcesPage() {
  const { supabase } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource>(initialResourceState);

  // FIX: Wrap fetchResources in useCallback to stabilize the function
  const fetchResources = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      alert('Failed to fetch resources.');
    } else {
      setResources(data || []);
    }
    setLoading(false);
  }, [supabase]); // Dependency array for useCallback

  useEffect(() => {
    fetchResources();
  }, [fetchResources]); // FIX: Add fetchResources to the dependency array

  const openModalToCreate = () => {
    setSelectedResource(initialResourceState);
    setIsModalOpen(true);
  };

  const openModalToEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { id, ...resourceData } = selectedResource;

    let error;
    if (id) {
      ({ error } = await supabase.from('resources').update(resourceData).eq('id', id));
    } else {
      ({ error } = await supabase.from('resources').insert([resourceData]));
    }

    if (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource. Check the console for details.');
    } else {
      await fetchResources();
      closeModal();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (resourceId: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      const { error } = await supabase.from('resources').delete().eq('id', resourceId);
      if (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource.');
      } else {
        await fetchResources();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Resources</h1>
        <button
          onClick={openModalToCreate}
          className="bg-primary text-black font-medium py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
        >
          + Add New Resource
        </button>
      </div>

      {loading ? (
        <p>Loading resources...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openModalToEdit(resource)} className="text-accent hover:text-green-700">Edit</button>
                    <button onClick={() => handleDelete(resource.id!)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4">{selectedResource.id ? 'Edit Resource' : 'Add New Resource'}</h2>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
            <ResourceForm
              resource={selectedResource}
              setResource={setSelectedResource}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}