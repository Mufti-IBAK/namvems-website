// src/app/(public)/payment/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PaymentFormClient from './PaymentFormClient';

export const dynamic = 'force-dynamic';

interface EventOption {
  id: number;
  title: string;
  date: string;
  event_fee: number | null;
  event_fee_student: number | null;
  event_fee_alumni: number | null;
  event_fee_non_vet: number | null;
  event_fee_other: number | null;
}

export default async function PaymentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/payment');
  }

  const nowIso = new Date().toISOString();
  const { data: eventsData } = await supabase
    .from('events')
.select('id, title, date, event_fee, event_fee_student, event_fee_alumni, event_fee_non_vet, event_fee_other')
    .gte('date', nowIso)
    .order('date', { ascending: true });

const rows = (eventsData ?? []) as { id: number; title: string; date: string; event_fee: number | null; event_fee_student: number | null; event_fee_alumni: number | null; event_fee_non_vet: number | null; event_fee_other: number | null }[];
  const events: EventOption[] = rows.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    event_fee: e.event_fee ?? null,
    event_fee_student: e.event_fee_student ?? null,
    event_fee_alumni: e.event_fee_alumni ?? null,
    event_fee_non_vet: e.event_fee_non_vet ?? null,
    event_fee_other: e.event_fee_other ?? null,
  }));

  // Association dues amount from settings
  const { data: settingsRow } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'association_dues_amount')
    .maybeSingle();
  const associationDuesAmount = typeof settingsRow?.value?.amount === 'number'
    ? settingsRow.value.amount as number
    : (typeof settingsRow?.value === 'number' ? (settingsRow.value as number) : 0);

  const userName = (user.user_metadata?.full_name as string) || (user.email?.split('@')[0] ?? '');
  const userEmail = user.email ?? '';

  // Prefill/lock from search params
  const sp = await searchParams;
  const preEventId = sp?.eventId ? Number(Array.isArray(sp.eventId) ? sp.eventId[0] : sp.eventId) : undefined;
  const preLevel = sp?.level ? String(Array.isArray(sp.level) ? sp.level[0] : sp.level) : undefined;
  const preUniversity = sp?.university ? String(Array.isArray(sp.university) ? sp.university[0] : sp.university) : undefined;
  const lock = sp?.lock === '1' || sp?.lock === 'true';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary via-accent to-primary pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Make a Payment</h1>
          <p className="text-white/90 mt-3">Secure payments for events, donations, and dues.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <PaymentFormClient
            userId={user.id}
            userName={userName}
            userEmail={userEmail}
            events={events}
            currency="NGN"
            associationDuesAmount={associationDuesAmount}
            defaultEventId={preEventId}
            defaultLevel={preLevel}
            defaultUniversity={preUniversity}
            lockSelection={Boolean(lock)}
          />
        </div>
      </div>
    </div>
  );
}