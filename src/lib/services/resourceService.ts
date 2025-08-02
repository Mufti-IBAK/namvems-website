import { Resource } from '../types/resource';

// Mock data for development
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Student Handbook 2024',
    description: 'Complete guide for new members with organization policies, procedures, and resources.',
    type: 'handbook',
    category: 'academic',
    fileSize: '2.4 MB',
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 124,
    downloads: 87
  },
  {
    id: '2',
    title: 'Career Development Guide',
    description: 'Comprehensive guide to building a successful career in veterinary medicine with expert advice.',
    type: 'guide',
    category: 'career',
    fileSize: '1.8 MB',
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589561457537-7ec0c794f4f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 98,
    downloads: 65
  },
  {
    id: '3',
    title: 'Interview Preparation Video',
    description: 'Expert tips and common questions for veterinary school interviews with sample responses.',
    type: 'video',
    category: 'career',
    fileSize: '45.2 MB',
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024456-444381957517?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 156,
    downloads: 112
  },
  {
    id: '4',
    title: 'Campus Map',
    description: 'Detailed map of the veterinary school campus with key locations and facilities marked.',
    type: 'image',
    category: 'academic',
    fileSize: '3.1 MB',
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 78,
    downloads: 54
  },
  {
    id: '5',
    title: 'Research Methodology Guide',
    description: 'Step-by-step guide to conducting research in veterinary sciences with examples.',
    type: 'guide',
    category: 'academic',
    fileSize: '3.7 MB',
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589561457537-7ec0c794f4f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 89,
    downloads: 67
  },
  {
    id: '6',
    title: 'Professional Networking Tips',
    description: 'Strategies for building professional relationships in the veterinary community.',
    type: 'guide',
    category: 'professional',
    fileSize: '1.2 MB',
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 112,
    downloads: 78
  }
];

export const resourcesService = {
  // Get all resources
  getAllResources: async (): Promise<Resource[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockResources);
      }, 500);
    });
  },

  // Get resources by type
  getResourcesByType: async (type: string): Promise<Resource[]> => {
    const resources = await resourcesService.getAllResources();
    return resources.filter(resource => resource.type === type);
  },

  // Get resources by category
  getResourcesByCategory: async (category: string): Promise<Resource[]> => {
    const resources = await resourcesService.getAllResources();
    return resources.filter(resource => resource.category === category);
  },

  // Search resources
  searchResources: async (query: string): Promise<Resource[]> => {
    const resources = await resourcesService.getAllResources();
    const lowerQuery = query.toLowerCase();
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.description.toLowerCase().includes(lowerQuery)
    );
  },

  // Get resource by ID
  getResourceById: async (id: string): Promise<Resource | null> => {
    const resources = await resourcesService.getAllResources();
    return resources.find(resource => resource.id === id) || null;
  },

  // Download resource
  downloadResource: async (resourceId: string): Promise<boolean> => {
    // In a real app, this would track the download
    console.log(`Downloaded resource ${resourceId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
};