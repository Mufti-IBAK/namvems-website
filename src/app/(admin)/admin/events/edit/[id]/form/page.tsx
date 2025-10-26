// src/app/(admin)/admin/events/edit/[id]/form/page.tsx
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

import FormBuilderPageClient from './FormBuilderPageClient';

export default async function AdminEventFormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const { id } = await params;
  const eventId = Number(id);
  const { data: event } = await supabase
    .from('events')
    .select('id, title, registration_type, internal_form_schema')
    .eq('id', eventId)
    .maybeSingle();

  if (!event) {
    return <div className="text-red-600">Event not found</div>;
  }

  const initialSchema = JSON.stringify(event.internal_form_schema ?? []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
        <p className="text-gray-600">Design the internal registration form for: {event.title}</p>
      </div>

      {event.registration_type !== 'internal_form' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          Registration type is not set to Internal Form. Set it on the event edit page first.
        </div>
      )}

      <FormBuilderPageClient eventId={eventId} initialSchemaJSON={initialSchema} />
    </div>
  );
}