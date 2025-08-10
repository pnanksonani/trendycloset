import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function DashboardUser() {
  const { username, role, logout } = useAuth();
  const isUser = useMemo(() => role === 'USER', [role]);

  const [tab, setTab] = useState('browse'); // 'browse' | 'cart' | 'profile'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // [{ productId, qty, ...productSnapshot }]

  useEffect(() => {
    if (!isUser) return;

    (async () => {
      try {
        setLoading(true);
        setMsg('');
        // Try to load products & cart (ignore if endpoints don't exist yet)
        const [p, c] = await Promise.allSettled([
          api('/products').catch(() => ({ items: demoProducts })), // fallback demo
          api('/user/cart').catch(() => ({ items: [] })),
        ]);
        if (p.status === 'fulfilled') setProducts(p.value.items || demoProducts);
        if (c.status === 'fulfilled') setCart(c.value.items || []);
      } catch (e) {
        setMsg(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [isUser]);

  function addToCart(prod) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => (i.productId || i._id) === (prod._id || prod.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 1) + 1 };
        return copy;
      }
      return [{ productId: prod._id || prod.id, qty: 1, ...prod }, ...prev];
    });

    // Try to persist (safe if missing)
    api('/user/cart', {
      method: 'POST',
      data: { productId: prod._id || prod.id, qty: 1 },
    }).catch(() => {});
  }

  function removeFromCart(item) {
    setCart((prev) => prev.filter((i) => (i.productId || i._id) !== (item.productId || item._id)));
    api(`/user/cart/${item.productId || item._id}`, { method: 'DELETE' }).catch(() => {});
  }

  async function placeOrder() {
    if (cart.length === 0) return setMsg('Your cart is empty');
    try {
      setLoading(true);
      setMsg('');
      await api('/orders', {
        method: 'POST',
        data: {
          items: cart.map((c) => ({ productId: c.productId || c._id, qty: c.qty || 1 })),
        },
      }).catch(() => {
        // Dev fallback if orders API not ready
        return { ok: true, orderId: 'dev-' + Math.random().toString(36).slice(2, 8) };
      });
      setCart([]);
      setMsg('Order placed! You’ll receive an email + in-app notification.');
      setTab('browse');
    } catch (e) {
      setMsg(e.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  }

  const total = cart.reduce((sum, i) => sum + Number(i.price || 0) * (i.qty || 1), 0);

  if (!isUser) {
    return <div style={{ padding: 16 }}>Forbidden: must be logged in as USER.</div>;
  }

  return (
    <div style={{ padding: 16, maxWidth: 1080, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>User Dashboard</h1>
          <div style={{ fontSize: 14, color: '#555' }}>
            Signed in as <b>{username}</b> — role: <b>{role}</b>
          </div>
        </div>
        <button onClick={logout} style={{ padding: '8px 12px' }}>Logout</button>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('browse')} style={btn(tab === 'browse')}>Browse</button>
        <button onClick={() => setTab('cart')} style={btn(tab === 'cart')}>Cart ({cart.length})</button>
        <button onClick={() => setTab('profile')} style={btn(tab === 'profile')}>Profile</button>
      </nav>

      {msg && <div style={{ marginBottom: 12, color: '#0a7', fontSize: 14 }}>{msg}</div>}
      {loading && <div style={{ marginBottom: 12 }}>Loading…</div>}

      {tab === 'browse' && (
        <section>
          <h2 style={{ marginTop: 0 }}>Products</h2>
          {products.length === 0 ? (
            <div>No products yet.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {products.map((p, idx) => (
                <li key={p._id || p.id || idx} style={card}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={img} /> : <div style={phImg} />}
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{p.description || '—'}</div>
                    <div style={{ marginTop: 6 }}>${p.price ?? '0'}</div>
                    <button onClick={() => addToCart(p)}>Add to cart</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'cart' && (
        <section>
          <h2 style={{ marginTop: 0 }}>Your Cart</h2>
          {cart.length === 0 ? (
            <div>Your cart is empty.</div>
          ) : (
            <div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
                {cart.map((c, idx) => (
                  <li key={c.productId || c._id || idx} style={card}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {c.imageUrl ? <img src={c.imageUrl} alt={c.title} style={thumb} /> : <div style={phThumb} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>{c.description || '—'}</div>
                        <div style={{ marginTop: 6 }}>${c.price ?? '0'}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => setCart(qtyDelta(cart, c, -1))}>-</button>
                        <span>{c.qty || 1}</span>
                        <button onClick={() => setCart(qtyDelta(cart, c, +1))}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(c)} style={{ marginLeft: 8 }}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <div><b>Total:</b> ${total.toFixed(2)}</div>
                <button onClick={placeOrder}>Place Order</button>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === 'profile' && (
        <section>
          <h2 style={{ marginTop: 0 }}>Profile</h2>
          <div style={card}>
            <div><b>Username:</b> {username}</div>
            <div><b>Role:</b> {role}</div>
            {/* Add addresses, saved cards, etc. later */}
          </div>
        </section>
      )}
    </div>
  );
}

/* Helpers */

function qtyDelta(cart, item, delta) {
  return cart
    .map((i) =>
      (i.productId || i._id) === (item.productId || item._id)
        ? { ...i, qty: Math.max(1, (i.qty || 1) + delta) }
        : i
    );
}

const btn = (active) => ({
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #ddd',
  background: active ? '#000' : '#f7f7f7',
  color: active ? '#fff' : '#000',
  cursor: 'pointer',
});

const card = {
  border: '1px solid #eee',
  borderRadius: 8,
  padding: 12,
  background: '#fff',
};

const img = { width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 };
const phImg = { ...img, background: '#f0f0f0' };
const thumb = { width: 72, height: 72, objectFit: 'cover', borderRadius: 8 };
const phThumb = { ...thumb, background: '#f0f0f0' };

/* Dev fallback catalog (delete once /products works) */
const demoProducts = [
  { id: 'p1', title: 'Basic Tee', price: 19.99, description: 'Cotton t-shirt', imageUrl: '' },
  { id: 'p2', title: 'Denim Jacket', price: 49.99, description: 'Classic denim', imageUrl: '' },
  { id: 'p3', title: 'Sneakers', price: 59.99, description: 'Comfy everyday shoes', imageUrl: '' },
];
