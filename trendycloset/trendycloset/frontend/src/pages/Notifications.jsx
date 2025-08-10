import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const unread = useMemo(() => items.filter(n => !n.read).length, [items]);

  async function load() {
    if (!user) return;
    try {
      setLoading(true);
      setMsg('');
      const res = await api('/notifications');
      setItems(res.items || []);
    } catch (e) {
      setMsg(e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  async function markAll() {
    try {
      await api('/notifications/read-all', { method: 'PATCH' });
      setItems(items.map(n => ({ ...n, read: true })));
    } catch (e) {
      setMsg(e.message || 'Could not mark all read');
    }
  }

  async function markOne(id) {
    try {
      await api(`/notifications/${id}/read`, { method: 'PATCH' });
      setItems(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
    } catch (e) {
      setMsg(e.message || 'Could not mark read');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">Notifications</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              unread > 0
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200'
            }`}>
              {unread} unread
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="text-sm rounded-lg border border-zinc-200 px-3 py-2 bg-white hover:bg-zinc-50"
            >
              Refresh
            </button>
            <button
              onClick={markAll}
              className="text-sm rounded-lg px-3 py-2 font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm hover:shadow"
              disabled={unread === 0}
            >
              Mark all read
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
            {[...Array(4)].map((_, i) => (
              <li key={i} className="h-20 rounded-xl bg-white border border-zinc-200 shadow-sm animate-pulse" />
            ))}
          </ul>
        )}

        {/* List */}
        {!loading && (
          <ul className="mt-6 grid gap-3">
            {items.length === 0 && (
              <li className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 text-center text-zinc-600">
                No notifications.
              </li>
            )}

            {items.map(n => (
              <li
                key={n._id}
                className={`bg-white border rounded-xl shadow-sm p-4 flex items-start gap-3 ${
                  n.read ? 'border-zinc-200' : 'border-indigo-200'
                }`}
              >
                {/* dot */}
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  n.read ? 'bg-zinc-300' : 'bg-indigo-500'
                }`} />

                {/* content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      n.type === 'ORDER_CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}>
                      {n.type || 'INFO'}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 font-semibold truncate">{n.message}</div>
                </div>

                {/* actions */}
                {!n.read && (
                  <button
                    onClick={() => markOne(n._id)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
