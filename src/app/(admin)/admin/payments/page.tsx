// src/app/(admin)/admin/payments/page.tsx
import { createClient } from '@/lib/supabase/server';
import PaymentsTableClient, { type PaymentRow } from './PaymentsTableClient';

export const dynamic = 'force-dynamic';

async function getPayments(): Promise<PaymentRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('Error fetching payments', error);
    return [];
  }
  return (data as unknown as PaymentRow[]) || [];
}

export default async function PaymentsAdminPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">All transactions recorded in the system.</p>
      </div>

      <PaymentsTableClient initialData={payments} />
    </div>
  );
}
