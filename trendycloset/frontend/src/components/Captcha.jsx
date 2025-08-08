import { useEffect, useState } from 'react';
import { api } from '../api/client';

/**
 * Props:
 *  - onReady({ token, answer }) -> called whenever token exists and answer is a number
 */
export default function Captcha({ onReady }) {
  const [question, setQuestion] = useState('');
  const [token, setToken] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function loadCaptcha() {
    try {
      setErr('');
      setLoading(true);
      setAnswer('');
      const data = await api('/auth/captcha'); // GET, includes cookies
      setQuestion(data.question || '');
      setToken(data.captchaToken || '');
    } catch (e) {
      setErr(e.message || 'Failed to load captcha');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCaptcha(); }, []);

  // Notify parent when we have both a token and a numeric answer
  useEffect(() => {
    const num = Number(answer);
    if (token && !Number.isNaN(num)) {
      onReady?.({ token, answer: num });
    }
  }, [token, answer, onReady]);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 6, fontSize: 14, opacity: 0.9 }}>Human check</div>

      {loading ? (
        <div>Loading captcha…</div>
      ) : (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{question || '—'}</span>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer"
            style={{ width: 90, padding: '6px 8px' }}
          />
          <button type="button" onClick={loadCaptcha} style={{ padding: '6px 10px' }}>
            Refresh
          </button>
        </div>
      )}

      {err && <div style={{ color: 'crimson', marginTop: 6, fontSize: 13 }}>{err}</div>}
    </div>
  );
}
