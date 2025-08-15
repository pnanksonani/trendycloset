import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function PartnerProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', price: '', stock: '', imageUrl: '', description: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await api('/partner/products'); // same endpoint
      setItems(res.items || []);
    } catch (e) {
      setMsg(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createProduct(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg('');
      const body = {
        title: form.title.trim(),
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
      };
      const res = await api('/partner/products', { method: 'POST', data: body }); // same endpoint
      setItems((prev) => [res.item, ...prev]);
      setForm({ title: '', price: '', stock: '', imageUrl: '', description: '' });
      setMsg('Product created');
    } catch (e) {
      setMsg(e.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">My Products</h1>
            <span className="text-xs px-2.5 py-1 rounded-full border bg-zinc-100 text-zinc-700 border-zinc-200">
              {items.length} total
            </span>
          </div>
          <button
            onClick={load}
            className="text-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>

        {/* Alert */}
        {msg && (
          <div
            role="alert"
            aria-live="polite"
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              msg.toLowerCase().includes('created')
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {msg}
          </div>
        )}

        {/* Create form */}
        <div className="mt-6 bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
          <div className="text-lg font-bold">Add a product</div>
          <form onSubmit={createProduct} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Title</span>
              <input
                placeholder="Denim Jacket"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="rounded-lg border border-zinc-300 px-3 py-2 bg-white"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="49.99"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="rounded-lg border border-zinc-300 px-3 py-2 bg-white"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Stock</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="10"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
                className="rounded-lg border border-zinc-300 px-3 py-2 bg-white"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Image URL (optional)</span>
              <input
                placeholder="https://…"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="rounded-lg border border-zinc-300 px-3 py-2 bg-white"
              />
            </label>

            <label className="grid gap-1 sm:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <textarea
                placeholder="Classic denim jacket with modern fit."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="rounded-lg border border-zinc-300 px-3 py-2 bg-white"
              />
              <span className="text-xs text-zinc-500 mt-1">Tip: keep it under 200 characters.</span>
            </label>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding…' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => setForm({ title: '', price: '', stock: '', imageUrl: '', description: '' })}
                className="text-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 hover:bg-zinc-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Loading skeletons */}
        {loading && items.length === 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-white border border-zinc-200 shadow-sm animate-pulse" />
            ))}
          </div>
        )}

        {/* Existing products */}
        <h3 className="mt-8 text-lg font-bold">Existing</h3>
        {items.length === 0 ? (
          <div className="mt-2 text-zinc-600">No products yet.</div>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p._id} className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
                <div className="flex gap-3">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-20 h-20 rounded-lg object-cover bg-zinc-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-zinc-100" />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.title}</div>
                    <div className="text-sm text-zinc-500 line-clamp-2">
                      {p.description || '—'}
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-semibold">£{Number(p.price || 0).toFixed(2)}</span>
                      <span className="text-zinc-500"> • stock: {p.stock}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
