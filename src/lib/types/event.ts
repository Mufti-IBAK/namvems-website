export interface Event {
  id?: number;
  title: string;
  description: string;
  date: Date | string;
  location: string;
  category: string;
  maxAttendees: number;
  registeredCount: number;
  imageUrl?: string | null;
  // --- FIX: Add the new properties here ---
  registration_type?: 'google_form' | 'internal_form' | 'none';
  registration_link?: string | null;
}