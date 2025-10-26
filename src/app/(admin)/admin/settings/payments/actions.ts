// src/app/(admin)/admin/settings/payments/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type SettingsActionState = { message: string | null; success: boolean; errors?: { amount?: string[] } };

export async function updateAssociationDues(_prev: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'Unauthorized', success: false };

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
  const role = roleData?.role || 'member';
  if (role !== 'admin' && role !== 'super_admin') {
    return { message: 'Unauthorized', success: false };
  }

  const amountStr = String(formData.get('association_dues_amount') ?? '').trim();
  const amount = Number(amountStr);
  if (!amount || isNaN(amount) || amount <= 0) {
    return { message: 'Invalid amount', success: false, errors: { amount: ['Enter a valid amount > 0'] } };
  }

  const { error } = await supabase
    .from('app_settings')
    .upsert({ key: 'association_dues_amount', value: { amount } }, { onConflict: 'key' });

  if (error) {
    return { message: `Failed to save: ${error.message}`, success: false };
  }

  revalidatePath('/payment');
  revalidatePath('/admin/settings/payments');
  return { message: 'Association dues updated', success: true };
}