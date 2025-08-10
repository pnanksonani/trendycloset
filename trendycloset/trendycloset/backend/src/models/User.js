const { Schema, model } = require('mongoose');

const emailRegex = /.+@.+\..+/; // must contain @ and .

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    // "email" is your username
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Invalid email format'],
      index: true,
    },

    dob: { type: Date, required: true },

    // store only the hash (bcrypt), not the raw password
    passwordHash: { type: String, required: true },

    // roles: USER / PARTNER / (optional) ADMIN
    role: {
      type: String,
      enum: ['USER', 'PARTNER', 'ADMIN'],
      default: 'USER',
    },

    emailVerified: { type: Boolean, default: false },

    // OTP for email verification
    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hide sensitive fields when sending to client
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.otpHash;
    delete ret.__v;
    return ret;
  },
});

module.exports = model('User', userSchema);
