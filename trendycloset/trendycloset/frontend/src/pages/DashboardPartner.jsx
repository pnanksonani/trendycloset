import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function DashboardPartner() {
  const { username, role, logout } = useAuth();
  const isPartner = useMemo(() => role === 'PARTNER', [role]);

  const [tab, setTab] = useState('products'); // 'products' | 'orders' | 'profile'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Products
  const [products, setProducts] = useState([]);
  const [pForm, setPForm] = useState({ title: '', price: '', stock: '', imageUrl: '', description: '' });

  // Orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isPartner) return;
    (async () => {
      try {
        setLoading(true);
        setMsg('');
        const [p, o] = await Promise.allSettled([
          api('/partner/products').catch(() => ({ items: [] })),
          api('/partner/orders?status=pending').catch(() => ({ items: [] })),
        ]);
        if (p.status === 'fulfilled') setProducts(p.value.items || []);
        if (o.status === 'fulfilled') setOrders(o.value.items || []);
      } catch (e) {
        setMsg(e.message || 'Load failed');
      } finally {
        setLoading(false);
      }
    })();
  }, [isPartner]);

  async function createProduct(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg('');
      const body = {
        title: pForm.title.trim(),
        price: Number(pForm.price || 0),
        stock: Number(pForm.stock || 0),
        imageUrl: pForm.imageUrl.trim(),
        description: pForm.description.trim(),
      };
      const res = await api('/partner/products', { method: 'POST', data: body });
      const newItem = res.item || body;
      setProducts((prev) => [newItem, ...prev]);
      setPForm({ title: '', price: '', stock: '', imageUrl: '', description: '' });
      setMsg('Product created');
    } catch (e) {
      setMsg(e.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  async function confirmOrder(orderId) {
    try {
      setLoading(true);
      setMsg('');
      await api(`/partner/orders/${orderId}/confirm`, { method: 'POST' });
      setOrders((prev) => prev.filter((o) => (o._id || o.id) !== orderId));
      setMsg('Order confirmed');
    } catch (e) {
      setMsg(e.message || 'Confirm failed');
    } finally {
      setLoading(false);
    }
  }

  if (!isPartner) {
    return <div className="p-4">Forbidden: must be logged in as PARTNER.</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Partner Dashboard</h1>
            <div className="text-sm text-zinc-600">
              Signed in as <b>{username}</b> — role: <b>{role}</b>
            </div>
          </div>
          <button
            onClick={logout}
            className="self-start md:self-auto inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm hover:shadow"
          >
            Logout
          </button>
        </header>

        {/* Tabs */}
        <nav className="mt-4 flex gap-2">
          <TabBtn active={tab === 'products'} onClick={() => setTab('products')}>My Products</TabBtn>
          <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')}>Incoming Orders</TabBtn>
          <TabBtn active={tab === 'profile'} onClick={() => setTab('profile')}>Profile</TabBtn>
        </nav>

        {/* Alert */}
        {msg && (
          <div
            role="alert"
            aria-live="polite"
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              msg.toLowerCase().includes('created') || msg.toLowerCase().includes('confirmed')
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {msg}
          </div>
        )}

        {loading && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-white border border-zinc-200 shadow-sm animate-pulse" />
            ))}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <section className="mt-6">
            {/* Create form */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
              <div className="text-lg font-bold">Add a product</div>
              <form onSubmit={createProduct} className="mt-4 grid gap-4 sm:grid-cols-2">
                <L label="Title">
                  <input
                    placeholder="Denim Jacket"
                    value={pForm.title}
                    onChange={(e) => setPForm({ ...pForm, title: e.target.value })}
                    required
                    className="rounded-lg border border-zinc-300 px-3 py-2 bg-white w-full"
                  />
                </L>
                <L label="Price">
                  <input
                    type="number" min="0" step="0.01" placeholder="49.99"
                    value={pForm.price}
                    onChange={(e) => setPForm({ ...pForm, price: e.target.value })}
                    required
                    className="rounded-lg border border-zinc-300 px-3 py-2 bg-white w-full"
                  />
                </L>
                <L label="Stock">
                  <input
                    type="number" min="0" step="1" placeholder="10"
                    value={pForm.stock}
                    onChange={(e) => setPForm({ ...pForm, stock: e.target.value })}
                    required
                    className="rounded-lg border border-zinc-300 px-3 py-2 bg-white w-full"
                  />
                </L>
                <L label="Image URL (optional)">
                  <input
                    placeholder="https://…"
                    value={pForm.imageUrl}
                    onChange={(e) => setPForm({ ...pForm, imageUrl: e.target.value })}
                    className="rounded-lg border border-zinc-300 px-3 py-2 bg-white w-full"
                  />
                </L>
                <L label="Description" full>
                  <textarea
                    rows={3}
                    placeholder="Classic denim jacket with modern fit."
                    value={pForm.description}
                    onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                    className="rounded-lg border border-zinc-300 px-3 py-2 bg-white w-full"
                  />
                  <span className="text-xs text-zinc-500 mt-1">Tip: keep under 200 characters.</span>
                </L>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding…' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPForm({ title: '', price: '', stock: '', imageUrl: '', description: '' })}
                    className="text-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 hover:bg-zinc-50"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <h3 className="mt-6 text-lg font-bold">My Products</h3>
            {products.length === 0 ? (
              <div className="mt-2 text-zinc-600">No products yet.</div>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p, idx) => (
                  <li key={p._id || p.id || idx} className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
                    <div className="flex gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-20 h-20 rounded-lg object-cover bg-zinc-100" />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-zinc-100" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.title}</div>
                        <div className="text-sm text-zinc-500 line-clamp-2">{p.description || '—'}</div>
                        <div className="mt-1 text-sm">
                          <span className="font-semibold">£{Number(p.price || 0).toFixed(2)}</span>
                          <span className="text-zinc-500"> • stock: {p.stock ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <section className="mt-6">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
              <div className="text-lg font-bold">Pending Orders</div>
              {orders.length === 0 ? (
                <div className="mt-2 text-zinc-600">No pending orders.</div>
              ) : (
                <ul className="mt-3 grid gap-3">
                  {orders.map((o) => (
                    <li key={o._id || o.id} className="border border-zinc-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm text-zinc-500">
                            Received: {new Date(o.createdAt).toLocaleString()}
                          </div>
                          <div className="font-semibold">
                            Order <span className="text-zinc-500">#{o._id || o.id}</span>
                          </div>
                          <div className="text-sm text-zinc-600">
                            Items: {o.items?.length || 0} • Total: ${Number(o.total || 0).toFixed(2)}
                          </div>
                        </div>
                        <span className="text-[11px] px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                          PENDING
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

                      <div className="mt-3">
                        <button
                          onClick={() => confirmOrder(o._id || o.id)}
                          disabled={loading}
                          className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Confirming…' : 'Confirm order'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <section className="mt-6">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
              <div className="text-lg font-bold">Profile</div>
              <div className="mt-3 grid gap-2 text-sm">
                <div><b>Username:</b> {username}</div>
                <div><b>Role:</b> {role}</div>
                <div className="text-zinc-500">You can add store details later (name, address, banner).</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* --- tiny UI helpers --- */
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
        active
          ? 'bg-black text-white border-black'
          : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50'
      }`}
    >
      {children}
    </button>
  );
}

function L({ label, full, children }) {
  return (
    <label className={`grid gap-1 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
