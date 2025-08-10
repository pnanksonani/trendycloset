// Ensures the request has a valid access JWT.
// Looks for the token in httpOnly cookie "access_token" (your current setup)
// and also supports Authorization: Bearer <token> as a fallback.

const jwt = require('jsonwebtoken');

function getTokenFromRequest(req) {
  // 1) cookie (preferred in your app)
  const cookieToken = req.cookies && req.cookies['access_token'];
  if (cookieToken) return cookieToken;

  // 2) Authorization header (optional fallback)
  const auth = req.headers.authorization || req.headers.Authorization;
  if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length).trim();
  }

  return null;
}

function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // payload should contain: sub, username, role (as you signed in authController)
    req.user = payload; 
    return next();
  } catch (err) {
    // TokenMissing / TokenExpired / InvalidSignature all land here
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
