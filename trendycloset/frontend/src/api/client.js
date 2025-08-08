const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050/api';

export async function api(path, { method = 'GET', data, headers, ...rest } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    credentials: 'include',               // important: send cookies
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: data ? JSON.stringify(data) : undefined,
    ...rest,
  });

  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = isJson ? (payload.error || 'Request failed') : String(payload || 'Request failed');
    throw new Error(msg);
  }
  return payload;
}
