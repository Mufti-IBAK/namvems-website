// src/app/api/payments/initiate/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const itemType = body?.itemType as 'event' | 'donation' | 'association_dues' | 'other';
    const eventId = body?.eventId as number | undefined;
    const description = (body?.description as string | undefined)?.trim();
    const currency = (body?.currency as string | undefined) || 'NGN';
    const level = String(body?.level || '').toLowerCase();
    const university = String(body?.university || '').trim();

    const allowed: string[] = ['event', 'donation', 'association_dues', 'other'];
    if (!allowed.includes(itemType)) {
      return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 });
    }

    // Validate level/university
    const levelAllowed = ['student','alumni','non_vet','other'];
    if (!levelAllowed.includes(level) || university.length < 3) {
      return NextResponse.json({ error: 'Invalid level or university' }, { status: 400 });
    }

    let amount = Number(body?.amount);

    if (itemType === 'event') {
      if (!eventId) return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
      const nowIso = new Date().toISOString();
      const { data: ev, error: evErr } = await supabase
.from('events')
        .select('id, title, date, event_fee, event_fee_student, event_fee_alumni, event_fee_non_vet, event_fee_other')
        .eq('id', eventId)
        .gte('date', nowIso)
        .single();
      if (evErr || !ev) {
        return NextResponse.json({ error: 'Event not found or not upcoming' }, { status: 400 });
      }
      // Enforce server-side amount based on level-specific event fees
      const evObj = ev as { event_fee: number | null; event_fee_student: number | null; event_fee_alumni: number | null; event_fee_non_vet: number | null; event_fee_other: number | null };
      let eventFee = 0;
      if (level === 'student' && evObj.event_fee_student && evObj.event_fee_student > 0) eventFee = evObj.event_fee_student;
      else if (level === 'alumni' && evObj.event_fee_alumni && evObj.event_fee_alumni > 0) eventFee = evObj.event_fee_alumni;
      else if (level === 'non_vet' && evObj.event_fee_non_vet && evObj.event_fee_non_vet > 0) eventFee = evObj.event_fee_non_vet;
      else if (level === 'other' && evObj.event_fee_other && evObj.event_fee_other > 0) eventFee = evObj.event_fee_other;
      else eventFee = Number(evObj.event_fee ?? 0);
      if (!eventFee || isNaN(eventFee) || eventFee <= 0) {
        return NextResponse.json({ error: 'This event is free or has no fee set' }, { status: 400 });
      }
      amount = eventFee;
    } else if (itemType === 'association_dues') {
      const { data: settingsRow } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'association_dues_amount')
        .maybeSingle();
      const assocFee = typeof settingsRow?.value?.amount === 'number'
        ? settingsRow.value.amount as number
        : (typeof settingsRow?.value === 'number' ? (settingsRow.value as number) : 0);
      if (!assocFee || isNaN(assocFee) || assocFee <= 0) {
        return NextResponse.json({ error: 'Association dues not configured' }, { status: 400 });
      }
      amount = assocFee;
    } else if (itemType === 'other' && !description) {
      return NextResponse.json({ error: 'Description required for \"other\"' }, { status: 400 });
    } else if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const tx_ref = `NAMVEMS-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    // Prepare description stored in DB
    let storedDesc = description || '';
    if (itemType === 'donation') storedDesc = 'Donation';
    if (itemType === 'association_dues') storedDesc = 'Association Dues';
    if (itemType === 'event' && eventId) {
      const { data: e } = await supabase.from('events').select('title').eq('id', eventId).single();
      storedDesc = e?.title ? `Event: ${e.title}` : 'Event Payment';
    }

    const full_name = (user.user_metadata?.full_name as string) || '';
    const email = user.email || '';

    const { error: insertErr } = await supabase.from('payments').insert({
      user_id: user.id,
      full_name,
      email,
      item_type: itemType,
      event_id: itemType === 'event' ? eventId! : null,
      description: storedDesc,
      amount,
      currency,
      status: 'pending',
      tx_ref,
      level,
      university,
      metadata: { ua: req.headers.get('user-agent') || '' },
    });

    if (insertErr) {
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
    }

    return NextResponse.json({ tx_ref, description: storedDesc });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}