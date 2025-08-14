const router = require('express').Router();

const {
  getCaptcha,
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
} = require('../controllers/authController');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireRole } = require('../middlewares/requireRole');

const { rateLimit } = require('../middlewares/rateLimit');

// Auth routes (dev-friendly, in-memory rate limiter)
router.get('/captcha', rateLimit(30, 60_000), getCaptcha);
router.post('/register', rateLimit(5, 60_000), register);
router.post('/verify-otp', rateLimit(10, 60_000), verifyOtp);
router.post('/resend-otp', rateLimit(3, 60_000), resendOtp);
router.post('/login', rateLimit(10, 60_000), login);
router.post('/logout', logout);

// Forgot password flow
router.post('/forgot-password', rateLimit(3, 60_000), forgotPassword);
router.post('/verify-forgot-password-otp', rateLimit(10, 60_000), verifyForgotPasswordOtp);
router.post('/reset-password', rateLimit(3, 60_000), resetPassword);
// // User-only
// router.get('/orders', requireAuth, requireRole('USER'), listOrders);

// // Partner-only
// router.post('/products', requireAuth, requireRole('PARTNER'), createProduct);

// // User or Partner
// router.get('/profile', requireAuth, requireRole('USER', 'PARTNER'), getProfile);
module.exports = router;
