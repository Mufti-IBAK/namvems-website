// src/lib/types/index.ts
export type Event = {
    id: number;
    title: string;
    description: string | null;
    date: string;
    location: string | null;
    category: string | null;
    image_url: string | null;
    max_attendees: number | null;
    created_at: string | null;
    registration_type: 'none' | 'google_form' | 'internal_form';
    registration_link: string | null;
};

export type Resource = {
    id: number;
    title: string;
    description: string | null;
    type: string;
    download_url: string;
    file_size: string | null;
    created_at: string | null;
};