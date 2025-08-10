const { z } = require('zod');

// simple: must contain "@" and "."
const emailRegex = /.+@.+\..+/;

/** Parse DOB sent as "YYYY-MM-DD" (or Date) -> Date object and validate */
const dobSchema = z.preprocess((v) => {
  if (typeof v === 'string' || v instanceof Date) {
    const d = new Date(v);
    return d;
  }
  return v;
}, z.date({ required_error: 'DOB is required' }).refine((d) => !isNaN(d.getTime()), 'Invalid date'));

// Sign-up: Name, Email (username), DOB, Password (>=6), Role (USER | PARTNER)
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().trim().email('Invalid email').transform((s) => s.toLowerCase()),
  dob: dobSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'PARTNER']),
});

// Verify OTP: email + 6-digit code
const verifyOtpSchema = z.object({
  email: z.string().transform((s) => s.trim().toLowerCase()),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

// Login: email + password + captcha (answer + token)
const loginSchema = z.object({
  email: z.string().transform((s) => s.trim().toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  captchaAnswer: z.coerce.number().int(),
  captchaToken: z.string().min(1, 'Captcha token is required'),
});

module.exports = {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
};
