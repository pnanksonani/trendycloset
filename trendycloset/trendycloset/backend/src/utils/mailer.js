const nodemailer = require('nodemailer');

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
} = process.env;

if (!SMTP_USER || !SMTP_PASS) {
  throw new Error('SMTP_USER/SMTP_PASS missing. Set them in your .env');
}

// Reuse a single transporter instance
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Send an HTML email.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 * @param {object} extra - (optional) extra nodemailer fields (text, attachments, etc.)
 * @returns {Promise<object>} nodemailer info
 */
async function sendMail(to, subject, html, extra = {}) {
  const from = MAIL_FROM || SMTP_USER;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    ...extra,
  });

  // If you ever use Ethereal, this will print a preview URL. For Gmail it will be null.
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) {
    console.log('Preview URL:', preview);
  }

  return info;
}

module.exports = { sendMail, transporter };
