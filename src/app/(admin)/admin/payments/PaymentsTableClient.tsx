'use client'

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export interface PaymentRow {
  id: string;
  created_at: string;
  paid_at: string | null;
  user_id: string | null;
  full_name: string;
  email: string;
  item_type: string;
  event_id: number | null;
  description: string | null;
  amount: number;
  currency: string;
  status: string;
  tx_ref: string;
  flutterwave_tx_id: string | null;
}

function toCSV(rows: PaymentRow[]): string {
  const headers = [
    'date','full_name','email','item_type','description','amount','currency','status','tx_ref','flutterwave_tx_id','event_id','user_id'
  ];
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    const date = new Date(r.paid_at || r.created_at).toISOString();
    const vals = [
      date,
      r.full_name,
      r.email,
      r.item_type,
      r.description ?? '',
      (Number(r.amount).toFixed(2)),
      r.currency,
      r.status,
      r.tx_ref,
      r.flutterwave_tx_id ?? '',
      r.event_id ?? '',
      r.user_id ?? ''
    ];
    lines.push(vals.map(escape).join(','));
  }
  return lines.join('\n');
}

export default function PaymentsTableClient({ initialData }: { initialData: PaymentRow[] }) {
  const [rows, setRows] = useState<PaymentRow[]>(initialData || []);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const refresh = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      setRows((data as unknown as PaymentRow[]) || []);
      toast.success('Payments refreshed');
    } catch (e) {
      toast.error('Failed to refresh payments');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    try {
      const csv = toCSV(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ts = new Date().toISOString().slice(0,10);
      a.download = `payments_${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={refresh} disabled={loading} className="btn-secondary">
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <button onClick={exportCSV} className="btn-secondary">Export CSV</button>
      </div>

      <div className="bg-white rounded-xl card-shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Payer</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">What</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Tx Ref</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">No payments yet.</td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{new Date(p.paid_at || p.created_at).toLocaleString()}</td>
                  <td className="p-3">{p.full_name}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.description || p.item_type}</td>
                  <td className="p-3 text-right">{p.currency} {Number(p.amount).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${p.status === 'successful' ? 'bg-green-100 text-green-800' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 truncate max-w-[160px]" title={p.tx_ref}>{p.tx_ref}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}