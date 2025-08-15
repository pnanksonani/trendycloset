// src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import logo from '../assets/logo.jpg';

export default function Navbar() {
  const auth = useAuth();
  if (!auth) return null;
  const { user, username, role, logout } = auth;
  const loc = useLocation();

  const [unread, setUnread] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // fetch small counts whenever route or auth changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        if (!cancelled) {
          setUnread(0);
          setCartCount(0);
        }
        return;
      }
      const tasks = [];

      // notifications
      tasks.push(
        api('/notifications')
          .then(r => {
            if (!cancelled) setUnread((r.items || []).filter(n => !n.read).length);
          })
          .catch(() => {})
      );

      // cart count for users
      if (role === 'USER') {
        tasks.push(
          api('/user/cart')
            .then(c => {
              if (!cancelled) setCartCount((c.items || []).length);
            })
            .catch(() => {})
        );
      } else {
        if (!cancelled) setCartCount(0);
      }

      await Promise.allSettled(tasks);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, role, loc.pathname]);

  const btnGhost =
    'inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 ' +
    'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300';

  const btnPrimary =
    'inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 ' +
    'text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md ' +
    'hover:shadow-lg hover:-translate-y-0.5 transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300';

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TrendyCloset" className="h-8 w-auto" />
          <span className="text-2xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            TrendyCloset
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden sm:flex items-center gap-3 text-sm">
          <NavItem to="/products">Products</NavItem>
          {role === 'USER' && (
            <>
              <NavItem to="/cart">
                Cart {cartCount > 0 && <Badge>{cartCount}</Badge>}
              </NavItem>
              <NavItem to="/orders">My Orders</NavItem>
            </>
          )}
          {role === 'PARTNER' && (
            <>
              <NavItem to="/partner/products">My Products</NavItem>
              <NavItem to="/partner/orders">Orders</NavItem>
            </>
          )}
          {user && (
            <NavItem to="/notifications">
              Notifications {unread > 0 && <Badge>{unread}</Badge>}
            </NavItem>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className={btnGhost}>
                Login
              </Link>
              <Link to="/signup/user" className={btnPrimary}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="hidden md:block text-sm text-zinc-600">
                Hi, <b>{username}</b>
              </span>
              <button onClick={logout} className={btnGhost}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile quick links */}
      <div className="sm:hidden border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3 overflow-x-auto text-sm">
          <NavItem to="/products">Products</NavItem>
          {role === 'USER' && (
            <>
              <NavItem to="/cart">
                Cart {cartCount > 0 && <Badge>{cartCount}</Badge>}
              </NavItem>
              <NavItem to="/orders">Orders</NavItem>
            </>
          )}
          {role === 'PARTNER' && (
            <>
              <NavItem to="/partner/products">My Products</NavItem>
              <NavItem to="/partner/orders">Orders</NavItem>
            </>
          )}
          {user && (
            <NavItem to="/notifications">
              Notifs {unread > 0 && <Badge>{unread}</Badge>}
            </NavItem>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
          isActive
            ? 'border-black bg-black text-white'
            : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function Badge({ children }) {
  return (
    <span className="ml-1 inline-flex min-w-[20px] h-5 items-center justify-center rounded-full text-[11px] px-1.5 border bg-indigo-50 text-indigo-700 border-indigo-200">
      {children}
    </span>
  );
}