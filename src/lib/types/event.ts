export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  location: string;
  category: string;
  maxAttendees: number;
  registeredCount: number;
  imageUrl?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  registration_type?: 'google_form' | 'internal_form' | 'none';
  registration_link?: string | null;
}
