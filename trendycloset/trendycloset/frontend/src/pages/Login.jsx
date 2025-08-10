import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/TextInput';
import PasswordInput from '../components/PasswordInput';
import Captcha from '../components/Captcha';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [captcha, setCaptcha] = useState(null); // { token, answer }
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const disabled = loading || !captcha || !form.email || !form.password;

  // local button styles (page-scoped)
  const btnPrimaryFull =
    "inline-flex w-full items-center justify-center font-semibold rounded-xl px-5 py-3 " +
    "text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md " +
    "transition hover:shadow-lg hover:-translate-y-0.5 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  async function onSubmit(e){
    e.preventDefault();
    if (!captcha) return setMsg('Please solve the captcha first.');
    try {
      setLoading(true); setMsg('');
      const res = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        captchaAnswer: captcha.answer,
        captchaToken: captcha.token,
      });
      if (res?.role === 'PARTNER') nav('/dashboard/partner', { replace: true });
      else nav('/dashboard/user', { replace: true });
    } catch (err) {
      setMsg(err?.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-tr from-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 pb-0">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-black text-zinc-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3l8 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9l8-6z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              TrendyCloset
            </span>
          </Link>
          <h1 className="text-3xl font-black mt-2">Welcome back</h1>
          <p className="text-sm text-zinc-500 -mt-1">Use your email and password to sign in.</p>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} noValidate className="grid gap-4">
            <TextInput
              label="Email (username)"
              type="email"
              value={form.email}
              onChange={(e)=> setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              autoComplete="username"
            />

            <PasswordInput
              label="Password"
              value={form.password}
              onChange={(e)=> setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />

            <Captcha onReady={setCaptcha} />

            <button
              type="submit"
              disabled={disabled}
              aria-disabled={disabled}
              aria-busy={loading}
              className={btnPrimaryFull}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Signing in…
                </span>
              ) : 'Login'}
            </button>

            {msg && (
              <div
                role="alert"
                aria-live="polite"
                className={`text-sm rounded-xl border px-3 py-2 ${
                  msg.toLowerCase().includes('success')
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {msg}
              </div>
            )}

            <div className="flex items-center justify-between text-sm mt-1">
              <Link to="/signup/user" className="text-indigo-600 hover:underline">Create user account</Link>
              <Link to="/signup/partner" className="text-indigo-600 hover:underline">Create partner account</Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-zinc-600">
              <span>Didn’t get the OTP?</span>
              <Link to="/verify" className="text-indigo-600 hover:underline">Verify email / Resend OTP</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
