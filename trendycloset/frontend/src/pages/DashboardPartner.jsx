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
    // Try to load initial data (ignore if endpoints aren’t ready)
    (async () => {
      try {
        setLoading(true);
        setMsg('');
        const [p, o] = await Promise.allSettled([
          api('/partner/products').catch(() => ({ items: [] })), // safe if 404
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
      // This endpoint is a placeholder you’ll implement on the backend
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
      // Placeholder endpoint
      await api(`/partner/orders/${orderId}/confirm`, { method: 'POST' });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setMsg('Order confirmed');
    } catch (e) {
      setMsg(e.message || 'Confirm failed');
    } finally {
      setLoading(false);
    }
  }

  if (!isPartner) {
    return <div style={{ padding: 16 }}>Forbidden: must be logged in as PARTNER.</div>;
  }

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Partner Dashboard</h1>
          <div style={{ fontSize: 14, color: '#555' }}>
            Signed in as <b>{username}</b> — role: <b>{role}</b>
          </div>
        </div>
        <button onClick={logout} style={{ padding: '8px 12px' }}>Logout</button>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('products')} style={btnStyle(tab === 'products')}>My Products</button>
        <button onClick={() => setTab('orders')} style={btnStyle(tab === 'orders')}>Incoming Orders</button>
        <button onClick={() => setTab('profile')} style={btnStyle(tab === 'profile')}>Profile</button>
      </nav>

      {msg && <div style={{ marginBottom: 12, color: '#0a7', fontSize: 14 }}>{msg}</div>}
      {loading && <div style={{ marginBottom: 12 }}>Loading…</div>}

      {tab === 'products' && (
        <section>
          <h2 style={{ marginTop: 0 }}>Create a product</h2>
          <form onSubmit={createProduct} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr', marginBottom: 16 }}>
            <input placeholder="Title" value={pForm.title} onChange={e => setPForm({ ...pForm, title: e.target.value })} required />
            <input placeholder="Price" type="number" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} required />
            <input placeholder="Stock" type="number" value={pForm.stock} onChange={e => setPForm({ ...pForm, stock: e.target.value })} required />
            <input placeholder="Image URL" value={pForm.imageUrl} onChange={e => setPForm({ ...pForm, imageUrl: e.target.value })} />
            <textarea placeholder="Description" style={{ gridColumn: '1 / -1', minHeight: 80 }} value={pForm.description} onChange={e => setPForm({ ...pForm, description: e.target.value })} />
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" disabled={loading}>Add Product</button>
            </div>
          </form>

          <h3 style={{ marginTop: 0 }}>My Products</h3>
          {products.length === 0 ? (
            <div>No products yet.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
              {products.map((p, idx) => (
                <li key={p.id || p._id || idx} style={cardStyle}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} /> : <div style={placeholderImg} />}
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>{p.description || '—'}</div>
                      <div style={{ marginTop: 6 }}>${p.price ?? '0'} • stock: {p.stock ?? 0}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'orders' && (
        <section>
          <h2 style={{ marginTop: 0 }}>Incoming Orders</h2>
          {orders.length === 0 ? (
            <div>No pending orders.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
              {orders.map((o) => (
                <li key={o.id || o._id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div><b>Order:</b> {o.id || o._id}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>
                        Items: {o.items?.length || 0} • Total: ${o.total ?? 0}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => confirmOrder(o.id || o._id)} disabled={loading}>Confirm</button>
                      {/* Add Reject button later if needed */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'profile' && (
        <section>
          <h2 style={{ marginTop: 0 }}>Profile</h2>
          <div style={cardStyle}>
            <div><b>Username:</b> {username}</div>
            <div><b>Role:</b> {role}</div>
            {/* You can add a “store name”, address, etc. later */}
          </div>
        </section>
      )}
    </div>
  );
}

function btnStyle(active) {
  return {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ddd',
    background: active ? '#000' : '#f7f7f7',
    color: active ? '#fff' : '#000',
    cursor: 'pointer',
  };
}

const cardStyle = {
  border: '1px solid #eee',
  borderRadius: 8,
  padding: 12,
  background: '#fff',
};

const placeholderImg = {
  width: 80,
  height: 80,
  borderRadius: 8,
  background: '#f0f0f0',
  display: 'inline-block',
};
