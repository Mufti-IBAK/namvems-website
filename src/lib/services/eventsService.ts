import { Event } from '../types/event';

// Mock data for development
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Conference 2024',
    description: 'Join us for our annual conference featuring keynote speakers and networking opportunities with industry professionals.',
    date: new Date('2024-03-15T09:00:00'),
    location: 'Convention Center, Abuja',
    category: 'Conference',
    maxAttendees: 150,
    registeredCount: 87,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    registrationLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '2',
    title: 'Study Group Session',
    description: 'Weekly study group for veterinary board exam preparation with peer support and expert guidance.',
    date: new Date('2024-02-20T18:00:00'),
    location: 'Online via Zoom',
    category: 'Study Group',
    maxAttendees: 30,
    registeredCount: 24,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    registrationLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '3',
    title: 'Career Development Workshop',
    description: 'Learn about career paths in veterinary medicine and get resume review from industry professionals.',
    date: new Date('2024-04-05T14:00:00'),
    location: 'University Campus, Lagos',
    category: 'Workshop',
    maxAttendees: 50,
    registeredCount: 48,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    registrationLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '4',
    title: 'Networking Mixer',
    description: 'Connect with fellow students and professionals in a relaxed environment.',
    date: new Date('2024-05-12T19:00:00'),
    location: 'Hotel Conference Room, Port Harcourt',
    category: 'Networking',
    maxAttendees: 75,
    registeredCount: 32,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    registrationLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

export const eventsService = {
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 500);
    });
  },

  // Get upcoming events
  getUpcomingEvents: async (): Promise<Event[]> => {
    const events = await eventsService.getAllEvents();
    const now = new Date();
    return events
      .filter(event => event.date > now && event.isActive)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  },

  // Get event by ID
  getEventById: async (id: string): Promise<Event | null> => {
    const events = await eventsService.getAllEvents();
    return events.find(event => event.id === id) || null;
  },

  // Get events by category
  getEventsByCategory: async (category: string): Promise<Event[]> => {
    const events = await eventsService.getAllEvents();
    return events.filter(event => 
      event.category.toLowerCase() === category.toLowerCase() && event.isActive
    );
  },

  // Register for an event
  registerForEvent: async (eventId: string): Promise<boolean> => {
    // In a real app, this would update the server
    console.log(`Registered for event ${eventId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
};