const crypto = require('crypto');

/**
 * Generate a numeric OTP (default 6 digits).
 */
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * One-way hash (SHA-256) for storing/validating OTPs safely.
 * Use: hashValue(otp) === user.otpHash
 */
function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

/**
 * Helper to check expiry timestamps.
 */
function isOtpExpired(expiresAt) {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() < Date.now();
}

module.exports = { generateOTP, hashValue, isOtpExpired };
