'use client'

import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import toast from 'react-hot-toast';

export type PaymentItemType = 'event' | 'donation' | 'association_dues' | 'other';

type FlutterwaveCallbackResponse = {
  status?: string;
  transaction_id?: string | number;
  tx_ref?: string;
};

type FlutterwaveCheckoutConfig = Record<string, unknown> & {
  public_key: string | undefined;
  tx_ref: string;
  amount: number;
  currency: string;
  customer: { email: string; name: string };
  meta?: Record<string, unknown>;
  customizations?: { title?: string; description?: string; logo?: string };
  callback: (response: FlutterwaveCallbackResponse) => void;
  onclose?: () => void;
};

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: FlutterwaveCheckoutConfig) => void;
  }
}

interface EventOption { id: number; title: string; date: string; event_fee: number | null; event_fee_student: number | null; event_fee_alumni: number | null; event_fee_non_vet: number | null; event_fee_other: number | null }

export default function PaymentFormClient({
  userId,
  userName,
  userEmail,
  events,
  currency = 'NGN',
  associationDuesAmount = 0,
  defaultEventId,
  defaultLevel,
  defaultUniversity,
  lockSelection = false,
}: {
  userId: string;
  userName: string;
  userEmail: string;
  events: EventOption[];
  currency?: string | undefined;
  associationDuesAmount?: number | undefined;
  defaultEventId?: number | undefined;
  defaultLevel?: string | undefined;
  defaultUniversity?: string | undefined;
  lockSelection?: boolean | undefined;
}) {
  const [itemType, setItemType] = useState<PaymentItemType>(defaultEventId ? 'event' : 'donation');
  const [eventId, setEventId] = useState<number | ''>(defaultEventId ?? '');
  const [otherDesc, setOtherDesc] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [fwReady, setFwReady] = useState(false);

  // New fields
  type Level = 'student' | 'alumni' | 'non_vet' | 'other';
  const [level, setLevel] = useState<Level>((defaultLevel as Level) || 'student');
  const [university, setUniversity] = useState<string>(defaultUniversity || '');

  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

  useEffect(() => {
    if (!publicKey) {
      // Warn developer in console; user will add it to env
      console.warn('Missing NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY');
    }
  }, [publicKey]);

  const canSubmit = useMemo(() => {
    const amt = Number(amount);
    const levelOk = ['student','alumni','non_vet','other'].includes(level);
    const univOk = university.trim().length >= 3;
    if (!levelOk || !univOk) return false;
    if (itemType === 'event') return !!eventId && amt > 0;
    if (itemType === 'association_dues') return amt > 0; // fixed by admin
    if (!amt || isNaN(amt) || amt <= 0) return false;
    if (itemType === 'other') return otherDesc.trim().length > 2;
    return true;
  }, [amount, itemType, eventId, otherDesc, level, university]);

  async function initiatePayment() {
    const payload = {
      itemType,
      eventId: itemType === 'event' ? Number(eventId) : undefined,
      description: itemType === 'other' ? otherDesc.trim() : undefined,
      amount: Number(amount),
      currency,
      level,
      university: university.trim(),
    };

    const res = await fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || 'Failed to initiate payment');
    }
    return (await res.json()) as { tx_ref: string; description: string };
  }

  function openFlutterwave(tx_ref: string) {
    if (!window.FlutterwaveCheckout) {
      throw new Error('Flutterwave script not loaded');
    }

    const description = buildDescription();

    window.FlutterwaveCheckout({
      public_key: publicKey,
      tx_ref,
      amount: Number(amount),
      currency,
      customer: {
        email: userEmail,
        name: userName,
      },
      meta: {
        user_id: userId,
        item_type: itemType,
        event_id: itemType === 'event' ? Number(eventId) : null,
        description,
      },
      customizations: {
        title: 'NAMVEMS',
        description,
        logo: '/assets/logo.png',
      },
      callback: async (response: FlutterwaveCallbackResponse) => {
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction_id: response?.transaction_id, tx_ref }),
          });
          const v = await verifyRes.json().catch(() => ({}));
          if (verifyRes.ok && v?.ok) {
            toast.success('Payment successful');
            // Redirect to user dashboard per requirement
            window.location.href = '/dashboard';
          } else {
            toast.error(v?.error || 'Payment verification failed');
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Verification error';
          toast.error(msg);
        }
      },
      onclose: () => {
        // optional: could signal cancellation to server
      },
    });
  }

  function buildDescription() {
    if (itemType === 'event') {
      const ev = events.find(e => e.id === Number(eventId));
      return ev ? `Event: ${ev.title}` : 'Event Payment';
    }
    if (itemType === 'association_dues') return 'Association Dues';
    if (itemType === 'donation') return 'Donation';
    return `Other: ${otherDesc.trim()}`;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      const { tx_ref } = await initiatePayment();
      openFlutterwave(tx_ref);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unable to start payment';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Update amount lock based on selection
  useEffect(() => {
    if (itemType === 'event') {
      const ev = events.find(e => e.id === Number(eventId));
      let fee = 0;
      if (ev) {
        if (level === 'student' && typeof ev.event_fee_student === 'number' && ev.event_fee_student > 0) fee = ev.event_fee_student;
        else if (level === 'alumni' && typeof ev.event_fee_alumni === 'number' && ev.event_fee_alumni > 0) fee = ev.event_fee_alumni;
        else if (level === 'non_vet' && typeof ev.event_fee_non_vet === 'number' && ev.event_fee_non_vet > 0) fee = ev.event_fee_non_vet;
        else if (level === 'other' && typeof ev.event_fee_other === 'number' && ev.event_fee_other > 0) fee = ev.event_fee_other;
        else fee = ev.event_fee ?? 0;
      }
      setAmount(String(fee || 0));
    } else if (itemType === 'association_dues') {
      setAmount(String(associationDuesAmount || 0));
    } else if (itemType === 'donation') {
      // keep user-entered amount
    }
  }, [itemType, eventId, events, associationDuesAmount, level]);

  return (
    <>
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        strategy="afterInteractive"
        onLoad={() => setFwReady(true)}
      />
      <form onSubmit={handleSubmit} noValidate aria-label="Payment form">
        <fieldset className="space-y-4" disabled={submitting}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
            <input id="name" value={userName} readOnly className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={userEmail} readOnly className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="item" className="block text-sm font-medium text-gray-700">What are you paying for?</label>
            <select
              id="item"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={itemType === 'event' ? `event:${eventId || ''}` : itemType}
              onChange={(e) => {
                const v = e.target.value;
                if (v.startsWith('event:')) {
                  setItemType('event');
                  setEventId(Number(v.split(':')[1]) || '');
                } else {
                  setItemType(v as PaymentItemType);
                  setEventId('');
                }
              }}
              aria-describedby={itemType === 'other' ? 'other-help' : undefined}
              disabled={lockSelection}
            >
              <option value="donation">Donation</option>
              <option value="association_dues">Association Dues</option>
              <optgroup label="Upcoming Events">
                {events.map((e) => (
                  <option key={e.id} value={`event:${e.id}`}>
                    {e.title}
                  </option>
                ))}
              </optgroup>
              <option value="other">Other (specify)</option>
            </select>
          </div>

          {itemType === 'event' && (
            <p className="text-sm text-gray-500">Selected event ID: {eventId}</p>
          )}

          {itemType === 'other' && (
            <div>
              <label htmlFor="other" className="block text-sm font-medium text-gray-700">Please describe</label>
              <input
                id="other"
                value={otherDesc}
                onChange={(e) => setOtherDesc(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="e.g., Merch, Special project, etc."
                aria-describedby="other-help"
              />
              <p id="other-help" className="mt-1 text-xs text-gray-500">Provide enough detail to identify your payment.</p>
            </div>
          )}

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
            <select
              id="level"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              <option value="non_vet">Non-Vet</option>
              <option value="other">Others</option>
            </select>
          </div>

          {/* University */}
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700">University</label>
            <input
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Usmanu Danfodiyo University, Sokoto (UDUS)"
              aria-describedby="university-help"
            />
            <p id="university-help" className="mt-1 text-xs text-gray-500">Type the full name followed by the acronym in brackets. Example: Usmanu Danfodiyo University, Sokoto (UDUS)</p>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ({currency})</label>
            <input
              id="amount"
              inputMode="decimal"
              pattern="^[0-9]*([.][0-9]{1,2})?$"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0.00"
              required
              aria-invalid={!canSubmit}
              disabled={itemType === 'event' || itemType === 'association_dues' || lockSelection}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!canSubmit || submitting || !fwReady || !publicKey}
              aria-disabled={!canSubmit || submitting || !fwReady || !publicKey}
              className="w-full inline-flex items-center justify-center bg-primary text-black font-semibold py-3 px-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-60"
            >
              {submitting ? 'Processing...' : 'Pay with Flutterwave'}
            </button>
            {!publicKey && (
              <p className="mt-2 text-xs text-red-600">Missing NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY. Please add it to your environment.</p>
            )}
          </div>
        </fieldset>
      </form>
    </>
  );
}