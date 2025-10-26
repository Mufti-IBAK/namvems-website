// src/app/(admin)/admin/settings/payments/page.tsx
import { createClient } from '@/lib/supabase/server';
import PaymentSettingsClient from './PaymentSettingsClient';

export const dynamic = 'force-dynamic';

async function getAssocFee() {
  const supabase = createClient();
  const { data } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'association_dues_amount')
    .maybeSingle();
  const amount = typeof data?.value?.amount === 'number'
    ? (data!.value.amount as number)
    : (typeof data?.value === 'number' ? (data!.value as number) : 0);
  return amount;
}

export default async function PaymentSettingsPage() {
  const amount = await getAssocFee();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
        <p className="text-gray-600">Configure association dues amount.</p>
      </div>

      <PaymentSettingsClient defaultAmount={amount} />
    </div>
  );
}