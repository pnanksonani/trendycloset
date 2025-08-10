const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
if (!ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET is missing in environment');
}

/**
 * Create a short-lived access token.
 * - payload: keep it small (e.g., { sub, username, role })
 * - expiry: from ACCESS_TOKEN_TTL (e.g., "45m", "2h")
 */
function signAccessToken(payload, options = {}) {
  const expiresIn = process.env.ACCESS_TOKEN_TTL || '45m';
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn, ...options });
}

/**
 * Verify & return the decoded payload or throw if invalid/expired.
 */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Decode without verifying (useful for debugging only).
 */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  decodeToken,
};
