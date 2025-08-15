import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/TextInput';
import PasswordInput from '../components/PasswordInput';
import { api } from '../api/client';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Button styles
  const btnPrimaryFull =
    "inline-flex w-full items-center justify-center font-semibold rounded-xl px-5 py-3 " +
    "text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md " +
    "transition hover:shadow-lg hover:-translate-y-0.5 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const btnSecondary =
    "inline-flex items-center justify-center font-semibold rounded-xl px-5 py-3 " +
    "text-indigo-600 bg-white border border-indigo-200 shadow-sm " +
    "transition hover:shadow-md hover:-translate-y-0.5 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";

  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email.trim()) return setMsg('Please enter your email address.');
    
    try {
      setLoading(true);
      setMsg('');
      await api('/auth/forgot-password', { method: 'POST', data: { email: email.trim().toLowerCase() } });
      setStep('otp');
      setMsg('OTP sent to your email. Please check your inbox.');
    } catch (err) {
      setMsg(err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp.trim()) return setMsg('Please enter the OTP code.');
    
    try {
      setLoading(true);
      setMsg('');
      await api('/auth/verify-forgot-password-otp', { 
        method: 'POST', 
        data: { 
          email: email.trim().toLowerCase(), 
          otp: otp.trim() 
        } 
      });
      setStep('password');
      setMsg('OTP verified successfully. Please enter your new password.');
    } catch (err) {
      setMsg(err?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!newPassword.trim()) return setMsg('Please enter your new password.');
    if (newPassword.length < 6) return setMsg('Password must be at least 6 characters.');
    
    try {
      setLoading(true);
      setMsg('');
      await api('/auth/reset-password', { 
        method: 'POST', 
        data: { 
          email: email.trim().toLowerCase(), 
          otp: otp.trim(),
          newPassword: newPassword.trim()
        } 
      });
      setMsg('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setMsg(err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (step === 'otp') {
      setStep('email');
      setOtp('');
      setMsg('');
    } else if (step === 'password') {
      setStep('otp');
      setNewPassword('');
      setMsg('');
    }
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
          <h1 className="text-3xl font-black mt-2">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'password' && 'Reset Password'}
          </h1>
          <p className="text-sm text-zinc-500 -mt-1">
            {step === 'email' && 'Enter your email to receive a password reset OTP.'}
            {step === 'otp' && 'Enter the 6-digit OTP sent to your email.'}
            {step === 'password' && 'Enter your new password.'}
          </p>
        </div>

        <div className="p-6">
          {step === 'email' && (
            <form onSubmit={handleSendOtp} noValidate className="grid gap-4">
              <TextInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={loading || !email.trim()}
                aria-disabled={loading || !email.trim()}
                aria-busy={loading}
                className={btnPrimaryFull}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Sending OTP…
                  </span>
                ) : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} noValidate className="grid gap-4">
              <TextInput
                label="OTP Code"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                maxLength={6}
                pattern="[0-9]{6}"
              />

              <button
                type="submit"
                disabled={loading || !otp.trim()}
                aria-disabled={loading || !otp.trim()}
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
                ) : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className={btnSecondary}
              >
                ← Back to Email
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleResetPassword} noValidate className="grid gap-4">
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />

              <button
                type="submit"
                disabled={loading || !newPassword.trim() || newPassword.length < 6}
                aria-disabled={loading || !newPassword.trim() || newPassword.length < 6}
                aria-busy={loading}
                className={btnPrimaryFull}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Resetting Password…
                  </span>
                ) : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className={btnSecondary}
              >
                ← Back to OTP
              </button>
            </form>
          )}

          {msg && (
            <div
              role="alert"
              aria-live="polite"
              className={`text-sm rounded-xl border px-3 py-2 mt-4 ${
                msg.toLowerCase().includes('success') || msg.toLowerCase().includes('sent') || msg.toLowerCase().includes('verified')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {msg}
            </div>
          )}

          <div className="flex items-center justify-center mt-6">
            <Link to="/login" className="text-indigo-600 hover:underline text-sm">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
