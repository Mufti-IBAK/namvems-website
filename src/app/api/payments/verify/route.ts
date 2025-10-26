// src/app/api/payments/verify/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Missing FLUTTERWAVE_SECRET_KEY on server' }, { status: 500 });
  }

  try {
    const { transaction_id, tx_ref } = await req.json();
    if (!transaction_id || !tx_ref) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const resp = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(transaction_id))}/verify`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
    });

    const data = await resp.json();
    const ok = data?.status === 'success' && data?.data?.status === 'successful' && data?.data?.tx_ref === tx_ref;

    // Update row regardless, to log attempt
    const { error: upErr } = await supabase
      .from('payments')
      .update({
        status: ok ? 'successful' : 'failed',
        paid_at: ok ? new Date().toISOString() : null,
        flutterwave_tx_id: String(transaction_id),
        metadata: data ?? {},
      })
      .eq('tx_ref', tx_ref)
      .eq('user_id', user.id);

    if (upErr) {
      return NextResponse.json({ error: 'Could not update payment record' }, { status: 500 });
    }

    if (!ok) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}