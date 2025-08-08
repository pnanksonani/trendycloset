const User = require('../models/User');
const { registerSchema, loginSchema, verifyOtpSchema } = require('../validators/authSchemas');
const { generateOTP, hashValue } = require('../utils/otp');
const { hashPassword, verifyPassword } = require('../utils/password');
const { sendMail } = require('../utils/mailer');
const { signAccessToken } = require('../utils/jwt');
const { signCaptchaToken, verifyCaptchaToken } = require('../utils/captchaToken');

/** Parse TTL like "45m", "2h", "30s", "7d" -> ms */
function ttlToMs(ttl = '45m') {
  const m = String(ttl).trim().match(/^(\d+)\s*([smhd])$/i);
  if (!m) return 45 * 60 * 1000; // default 45m
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  if (u === 's') return n * 1000;
  if (u === 'm') return n * 60 * 1000;
  if (u === 'h') return n * 60 * 60 * 1000;
  if (u === 'd') return n * 24 * 60 * 60 * 1000;
  return 45 * 60 * 1000;
}

function setAccessCookie(res, access) {
  const maxAge = ttlToMs(process.env.ACCESS_TOKEN_TTL || '45m');
  res.cookie('access_token', access, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // set true on HTTPS
    maxAge,
  });
}

// GET /api/auth/captcha
exports.getCaptcha = async (_req, res) => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const ans = a + b;
  const token = signCaptchaToken(ans);
  return res.json({ question: `What is ${a} + ${b}?`, captchaToken: token });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, email, dob, password, role } = parsed.data;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, dob, passwordHash, role, emailVerified: false });

  // OTP
  const otp = generateOTP(6);
  user.otpHash = hashValue(otp);
  user.otpExpiresAt = new Date(Date.now() + (Number(process.env.OTP_TTL_MINUTES || 10) * 60 * 1000));
  await user.save();

  await sendMail(
    email,
    'Verify your TrendyCloset account',
    `<p>Your OTP is <b>${otp}</b>. It expires in ${process.env.OTP_TTL_MINUTES || 10} minutes.</p>`
  );

  return res.status(201).json({ message: 'Registered. OTP sent to email.' });
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, otp } = parsed.data;
  const user = await User.findOne({ email });
  if (!user || !user.otpHash) return res.status(400).json({ error: 'Invalid request' });

  if (user.otpExpiresAt && user.otpExpiresAt.getTime() < Date.now())
    return res.status(400).json({ error: 'OTP expired' });

  if (hashValue(otp) !== user.otpHash)
    return res.status(400).json({ error: 'Incorrect OTP' });

  user.emailVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  await user.save();

  return res.json({ message: 'Email verified. You can login now.' });
};

// POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = generateOTP(6);
  user.otpHash = hashValue(otp);
  user.otpExpiresAt = new Date(Date.now() + (Number(process.env.OTP_TTL_MINUTES || 10) * 60 * 1000));
  await user.save();

  await sendMail(email, 'Your OTP code', `<p>Your OTP is <b>${otp}</b>.</p>`);
  return res.json({ message: 'OTP resent.' });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password, captchaAnswer, captchaToken } = parsed.data;

  try {
    const payload = verifyCaptchaToken(captchaToken);
    if (payload.ans !== captchaAnswer)
      return res.status(400).json({ error: 'Human verification failed' });
  } catch {
    return res.status(400).json({ error: 'Invalid or expired captcha' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.emailVerified) return res.status(401).json({ error: 'Verify email first' });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  // Put username (email) + role into JWT so FE can decode/use via /me
  const access = signAccessToken({
    sub: user.id,
    role: user.role,
    username: user.email,
  });

  setAccessCookie(res, access);
  return res.json({ message: 'Logged in', role: user.role, username: user.email });
};

// POST /api/auth/logout
exports.logout = async (_req, res) => {
  res.clearCookie('access_token');
  return res.json({ message: 'Logged out' });
};
