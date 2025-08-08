import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function VerifyOtp() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const btnPrimaryFull =
    "inline-flex w-full items-center justify-center font-semibold rounded-xl px-5 py-3 " +
    "text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md " +
    "transition hover:shadow-lg hover:-translate-y-0.5 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const btnSecondaryFull =
    "inline-flex w-full items-center justify-center font-semibold rounded-xl px-5 py-3 " +
    "border border-zinc-200 bg-zinc-50 text-zinc-900 transition hover:bg-zinc-100 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  async function onVerify(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setMsg('OTP must be 6 digits');
    try {
      setLoading(true);
      setMsg('');
      const res = await api('/auth/verify-otp', {
        method: 'POST',
        data: { email: email.trim().toLowerCase(), otp },
      });
      setMsg(res.message || 'Verified! Redirecting to login…');
      setTimeout(() => nav('/login', { replace: true }), 900);
    } catch (err) {
      setMsg(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!email.trim()) return setMsg('Enter your email first');
    try {
      setLoading(true);
      setMsg('');
      const res = await api('/auth/resend-otp', {
        method: 'POST',
        data: { email: email.trim().toLowerCase() },
      });
      setMsg(res.message || 'OTP resent. Check your inbox.');
    } catch (err) {
      setMsg(err.message || 'Could not resend OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-tr from-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-black">Verify your email</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Enter the 6-digit code we sent to your email.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={onVerify} noValidate className="grid gap-4">
            {/* Email */}
            <label className="block">
              <div className="mb-1.5 text-sm font-semibold text-zinc-800">Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            {/* OTP */}
            <label className="block">
              <div className="mb-1.5 text-sm font-semibold text-zinc-800">OTP (6 digits)</div>
              <input
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="123456"
                required
                autoComplete="one-time-code"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-center tracking-widest text-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              aria-disabled={loading}
              aria-busy={loading}
              className={btnPrimaryFull}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Verifying…
                </span>
              ) : (
                'Verify'
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={onResend}
            disabled={loading || !email.trim()}
            className={`${btnSecondaryFull} mt-3`}
          >
            Resend OTP
          </button>

          {msg && (
            <div
              role="alert"
              aria-live="polite"
              className={`mt-3 text-sm rounded-xl border px-3 py-2 ${
                msg.toLowerCase().includes('verified') || msg.toLowerCase().includes('resent')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {msg}
            </div>
          )}

          <div className="mt-4 text-sm">
            <Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
