// src/lib/types/index.ts
export type EventFormQuestionType = 'short_text' | 'long_text' | 'select' | 'radio' | 'checkbox' | 'date' | 'number';
export type EventFormQuestion = {
    id: string;
    label: string;
    type: EventFormQuestionType;
    required?: boolean;
    options?: string[];
};

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
    registration_type: 'none' | 'external_link' | 'internal_form';
    registration_link: string | null;
    registration_deadline: string | null;
    event_fee: number | null; // fallback
    event_fee_student: number | null;
    event_fee_alumni: number | null;
    event_fee_non_vet: number | null;
    event_fee_other: number | null;
    internal_form_schema: EventFormQuestion[] | null;
};

export type EventRegistration = {
    id: string;
    event_id: number;
    user_id: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    university: string | null;
    level_of_study: string | null;
    additional_info: string | null;
    registration_date: string;
    attendance_status: 'registered' | 'attended' | 'absent' | 'cancelled';
    created_at: string;
    updated_at: string;
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