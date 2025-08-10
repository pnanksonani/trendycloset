const jwt = require('jsonwebtoken');

/**
 * Create a short-lived token that encodes the captcha answer.
 * Default expiry: 10 minutes
 */
function signCaptchaToken(ans) {
  if (typeof ans !== 'number') throw new Error('Captcha answer must be a number');
  return jwt.sign({ ans }, process.env.JWT_CAPTCHA_SECRET, { expiresIn: '10m' });
}

/**
 * Verify and decode the captcha token.
 * Returns the payload: { ans: number, iat, exp }
 * Throws if invalid/expired.
 */
function verifyCaptchaToken(token) {
  return jwt.verify(token, process.env.JWT_CAPTCHA_SECRET);
}

module.exports = { signCaptchaToken, verifyCaptchaToken };
