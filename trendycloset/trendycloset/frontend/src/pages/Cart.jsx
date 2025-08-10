import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import QuantityInput from '../components/QuantityInput';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await api('/user/cart');
      setItems(res.items || []);
    } catch (e) {
      setMsg(e.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const total = useMemo(
    () => items.reduce((s, i) => s + Number(i.price || 0) * (i.qty || 1), 0),
    [items]
  );

  async function setQty(item, qty) {
    try {
      await api(`/user/cart/${item.productId || item._id}`, { method: 'PATCH', data: { qty } });
      setItems((prev) => prev.map(i => (same(item, i) ? { ...i, qty } : i)));
    } catch (e) {
      setMsg(e.message || 'Could not update quantity');
    }
  }

  async function remove(item) {
    try {
      await api(`/user/cart/${item.productId || item._id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter(i => !same(i, item)));
    } catch (e) {
      setMsg(e.message || 'Could not remove');
    }
  }

  async function placeOrder() {
    if (items.length === 0) return setMsg('Your cart is empty');
    try {
      setLoading(true);
      await api('/user/orders', { method: 'POST' });
      setItems([]);
      setMsg('Order placed! You will receive a confirmation email when the partner approves.');
    } catch (e) {
      setMsg(e.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">Your Cart</h1>
          <Link to="/products" className="text-indigo-600 hover:underline text-sm">
            Continue shopping →
          </Link>
        </div>

        {/* Alert */}
        {msg && (
          <div
            role="alert"
            aria-live="polite"
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              msg.toLowerCase().includes('order placed')
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {msg}
          </div>
        )}

        {/* Loading state */}
        {loading && items.length === 0 && (
          <div className="mt-8 grid gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white border border-zinc-200 shadow-sm animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="mt-16 grid place-items-center text-center">
            <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-sm p-8">
              <div className="text-2xl font-black">Your cart is empty</div>
              <p className="text-zinc-600 mt-1">Add some products to get started.</p>
              <Link
                to="/products"
                className="inline-flex mt-4 items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm hover:shadow md:mt-5"
              >
                Browse products
              </Link>
            </div>
          </div>
        )}

        {/* Cart list + summary */}
        {items.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
            {/* Items */}
            <ul className="grid gap-3">
              {items.map((c, idx) => (
                <li
                  key={c.productId || c._id || idx}
                  className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="w-20 h-20 rounded-lg object-cover bg-zinc-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-zinc-100" />
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{c.title}</div>
                      <div className="text-sm text-zinc-500 line-clamp-2">
                        {c.description || '—'}
                      </div>
                      <div className="mt-1 text-sm text-zinc-700">
                        ${Number(c.price || 0).toFixed(2)}
                      </div>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center gap-3">
                      <QuantityInput value={c.qty} onChange={(q) => setQty(c, q)} />
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-right font-semibold">
                      ${(Number(c.price || 0) * (c.qty || 1)).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => remove(c)}
                      className="ml-2 text-sm text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary card */}
            <div className="h-fit bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
              <div className="text-lg font-bold">Order Summary</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {/* Add taxes/shipping later if needed */}
              </div>
              <div className="mt-4 border-t border-zinc-200 pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={placeOrder}
                disabled={loading}
                aria-busy={loading}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing…' : 'Place Order'}
              </button>

              <div className="mt-3 text-xs text-zinc-500">
                You’ll get an email + in-app notification after partner confirmation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* helpers */
const same = (a, b) => (a.productId || a._id) === (b.productId || b._id);
