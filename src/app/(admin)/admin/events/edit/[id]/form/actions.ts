// src/app/(admin)/admin/events/edit/[id]/form/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type FormSaveState = { message: string | null; success: boolean };

export async function saveEventFormSchema(_prev: FormSaveState, formData: FormData): Promise<FormSaveState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'Unauthorized', success: false };

  const eventIdStr = String(formData.get('event_id') ?? '');
  const schemaStr = String(formData.get('internal_form_schema') ?? '[]');
  const eventId = Number(eventIdStr);
  if (!eventId || Number.isNaN(eventId)) return { message: 'Invalid event id', success: false };

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
  const role = roleData?.role || 'member';
  if (role !== 'admin' && role !== 'super_admin') return { message: 'Unauthorized', success: false };

  let schema: unknown = [];
  try { schema = JSON.parse(schemaStr); } catch { schema = []; }

  const { error } = await supabase
    .from('events')
    .update({ internal_form_schema: schema })
    .eq('id', eventId);

  if (error) return { message: `Failed to save: ${error.message}`, success: false };

  revalidatePath(`/admin/events/edit/${eventId}/form`);
  revalidatePath(`/events/${eventId}`);
  return { message: 'Form saved!', success: true };
}