export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  registrationLink?: string;
  imageUrl?: string;
  category: 'Conference' | 'Workshop' | 'Study Group' | 'Networking' | 'Other';
  maxAttendees: number;
  registeredCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  registrationLink?: string;
  imageUrl?: string;
  category: 'Conference' | 'Workshop' | 'Study Group' | 'Networking' | 'Other';
  maxAttendees: number;
}