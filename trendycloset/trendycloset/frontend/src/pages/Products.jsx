import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('latest'); // latest | priceAsc | priceDesc

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api('/products'); // same endpoint
        setItems(res.items || []);
      } catch (e) {
        setMsg(e.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function addToCart(p) {
    try {
      await api('/user/cart', { method: 'POST', data: { productId: p._id || p.id, qty: 1 } }); // same endpoint
      setMsg('Added to cart');
      setTimeout(() => setMsg(''), 1200);
    } catch (e) {
      if ((e.message || '').toLowerCase().includes('unauth')) {
        setMsg('Please login to add items to cart.');
      } else {
        setMsg(e.message || 'Could not add to cart');
      }
    }
  }

  const visible = useMemo(() => {
    let arr = items;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      arr = arr.filter(
        p =>
          (p.title || '').toLowerCase().includes(needle) ||
          (p.description || '').toLowerCase().includes(needle)
      );
    }
    if (sort === 'priceAsc') {
      arr = [...arr].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === 'priceDesc') {
      arr = [...arr].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else {
      // latest (keep backend default which is createdAt desc, but ensure stable)
      arr = [...arr];
    }
    return arr;
  }, [items, q, sort]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">Products</h1>
            <span className="text-xs px-2.5 py-1 rounded-full border bg-zinc-100 text-zinc-700 border-zinc-200">
              {visible.length} shown
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
            <Link to="/dashboard/user" className="text-zinc-700 hover:underline">User Dashboard</Link>
            <Link to="/dashboard/partner" className="text-zinc-700 hover:underline">Partner Dashboard</Link>
          </nav>
        </header>

        {/* Controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full sm:w-48 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm"
          >
            <option value="latest">Sort: Latest</option>
            <option value="priceAsc">Sort: Price (Low → High)</option>
            <option value="priceDesc">Sort: Price (High → Low)</option>
          </select>
        </div>

        {/* Alert */}
        {msg && (
          <div
            role="alert"
            aria-live="polite"
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              msg.toLowerCase().includes('added')
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {msg}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-white border border-zinc-200 shadow-sm animate-pulse" />
            ))}
          </div>
        )}

        {/* List */}
        {!loading && visible.length === 0 ? (
          <div className="mt-16 text-center text-zinc-600">
            No products{q.trim() ? ' match your search' : ''}.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p._id || p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
