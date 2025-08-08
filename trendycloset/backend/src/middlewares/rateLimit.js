// Tiny fixed-window rate limiter (in-memory).
// Good for dev/single server. Use Redis in prod for multi-instance scaling.

const buckets = new Map(); // key -> { count, resetAt }

function rateLimit(max = 10, windowMs = 60_000, opts = {}) {
  const {
    keyFn = defaultKeyFn,
    headerPrefix = 'X-RateLimit', // X-RateLimit-Limit / Remaining / Reset
  } = opts;

  return (req, res, next) => {
    const now = Date.now();
    const key = keyFn(req);
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    // roll window
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    const remaining = Math.max(0, max - bucket.count);
    const resetSec = Math.ceil((bucket.resetAt - now) / 1000);

    // helpful headers
    res.setHeader(`${headerPrefix}-Limit`, String(max));
    res.setHeader(`${headerPrefix}-Remaining`, String(remaining));
    res.setHeader(`${headerPrefix}-Reset`, String(resetSec));
    res.setHeader('Retry-After', bucket.count > max ? String(resetSec) : '0');

    if (bucket.count > max) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfterSeconds: resetSec,
      });
    }

    next();
  };
}

function defaultKeyFn(req) {
  // combine IP + path so each route has its own bucket per client
  // Make sure your app trusts proxy for correct IP: app.set('trust proxy', 1)
  const ip =
    req.ip ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.connection?.remoteAddress ||
    'unknown';
  return `${ip}:${req.path}`;
}

module.exports = { rateLimit };
