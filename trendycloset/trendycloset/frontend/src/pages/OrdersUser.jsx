import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

export default function OrdersUser() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('all'); // all | PENDING | CONFIRMED | REJECTED

  async function load() {
    try {
      setLoading(true);
      setMsg('');
      const res = await api('/user/orders'); // ← same endpoint
      setItems(res.items || []);
    } catch (e) {
      setMsg(e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (status === 'all') return items;
    return items.filter(o => (o.status || '').toUpperCase() === status);
  }, [items, status]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">My Orders</h1>
            <span className="text-xs px-2.5 py-1 rounded-full border bg-zinc-100 text-zinc-700 border-zinc-200">
              {items.length} total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="text-sm rounded-lg border border-zinc-200 bg-white px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button
              onClick={load}
              className="text-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 hover:bg-zinc-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Alert */}
        {msg && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm"
          >
            {msg}
          </div>
        )}

        {/* Skeletons */}
        {loading && (
          <ul className="mt-6 grid gap-3">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="h-28 rounded-xl bg-white border border-zinc-200 shadow-sm animate-pulse" />
            ))}
          </ul>
        )}

        {/* List */}
        {!loading && filtered.length === 0 ? (
          <div className="mt-10 text-center text-zinc-600">
            No orders{status !== 'all' ? ` (${status.toLowerCase()})` : ''}.
          </div>
        ) : (
          <ul className="mt-6 grid gap-4">
            {filtered.map((o) => (
              <li key={o._id} className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
                {/* Top row: meta */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-zinc-500">
                      Placed: {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="font-semibold">
                      Order <span className="text-zinc-500">#{o._id}</span>
                    </div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border ${
                    badgeClass(o.status)
                  }`}>
                    {o.status}
                  </span>
                </div>

                {/* Items table */}
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-zinc-500">
                      <tr>
                        <th className="text-left py-1.5">Item</th>
                        <th className="text-right py-1.5">Qty</th>
                        <th className="text-right py-1.5">Price</th>
                        <th className="text-right py-1.5">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items?.map((i, idx) => (
                        <tr key={idx} className="border-t border-zinc-100">
                          <td className="py-2">{i.title}</td>
                          <td className="py-2 text-right">{i.qty}</td>
                          <td className="py-2 text-right">£{Number(i.priceAtPurchase || 0).toFixed(2)}</td>
                          <td className="py-2 text-right">£{Number(i.subtotal || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-zinc-200">
                        <td colSpan={3} className="py-2 text-right font-semibold">Total</td>
                        <td className="py-2 text-right font-bold">
                          ${Number(o.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Status hint */}
                {o.status === 'PENDING' && (
                  <div className="mt-2 text-xs text-zinc-600">
                    Awaiting partner confirmation. You’ll get an email + in-app notification when confirmed.
                  </div>
                )}
                {o.status === 'CONFIRMED' && o.confirmedAt && (
                  <div className="mt-2 text-xs text-emerald-700">
                    Confirmed on {new Date(o.confirmedAt).toLocaleString()}.
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* style helper — matches status colors */
function badgeClass(status = '') {
  const s = status.toUpperCase();
  if (s === 'CONFIRMED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'PENDING') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (s === 'REJECTED') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-zinc-100 text-zinc-700 border-zinc-200';
}
