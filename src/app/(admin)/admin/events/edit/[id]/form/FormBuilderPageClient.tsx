'use client'

import { useActionState, useEffect } from 'react';
import { saveEventFormSchema, type FormSaveState } from './actions';
import FormBuilderClient from '@/components/admin/FormBuilderClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function FormBuilderPageClient({ eventId, initialSchemaJSON }: { eventId: number; initialSchemaJSON: string }) {
  const initial: FormSaveState = { message: null, success: false };
  const [state, action] = useActionState(saveEventFormSchema, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
        router.push('/admin');
      }
    }
  }, [state, router]);

  return (
    <form action={action} className="bg-white p-6 rounded-xl card-shadow">
      <input type="hidden" name="event_id" value={String(eventId)} />
      <div className="mb-4">
        <FormBuilderClient initialSchemaJSON={initialSchemaJSON} fieldName="internal_form_schema" />
      </div>
      <button type="submit" className="btn-primary">Save Form</button>
    </form>
  );
}