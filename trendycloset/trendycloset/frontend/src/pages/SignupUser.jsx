import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import PasswordInput from '../components/PasswordInput';
import DOBInput from '../components/DOBInput';
import { api } from '../api/client';

export default function SignupUser() {
  const [form, setForm] = useState({ name: '', email: '', dob: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const disabled = loading || !form.name || !form.email || !form.dob || !form.password;

  const btnPrimaryFull =
    "inline-flex w-full items-center justify-center font-semibold rounded-xl px-5 py-3 " +
    "text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md " +
    "transition hover:shadow-lg hover:-translate-y-0.5 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg('');
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        dob: form.dob,                 // YYYY-MM-DD (backend converts to Date)
        password: form.password,
        role: 'USER',
      };
      const res = await api('/auth/register', { method: 'POST', data: payload });
      setMsg(res.message || 'Registered. OTP sent to your email.');
    } catch (err) {
      setMsg(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-tr from-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-black">Sign up as User</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Create a user account to browse products, build your cart, and place orders.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={onSubmit} noValidate className="grid gap-4">
            <TextInput
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="name"
            />

            <TextInput
              label="Email (username)"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              autoComplete="username"
            />

            <DOBInput
              label="Date of Birth"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              required
              autoComplete="bday"
            />

            <PasswordInput
              label="Password (min 6)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
            />

            <button type="submit" disabled={disabled} aria-disabled={disabled} aria-busy={loading} className={btnPrimaryFull}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>

            {/* Message */}
            {msg && (
              <div
                role="alert"
                aria-live="polite"
                className={`text-sm rounded-xl border px-3 py-2 ${
                  msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('success')
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {msg}
              </div>
            )}

            {/* Links */}
            <div className="text-sm text-zinc-700">
              After signing up, check your email for the OTP, then{' '}
              <Link to="/verify" className="text-indigo-600 hover:underline">
                verify your email
              </Link>
              .
            </div>

            <div className="text-sm text-zinc-700">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </div>

            <div className="text-sm text-zinc-700">
              Want a partner account instead?{' '}
              <Link to="/signup/partner" className="text-indigo-600 hover:underline">
                Sign up as Partner
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
