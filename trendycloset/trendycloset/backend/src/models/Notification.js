const { Schema, model, Types } = require('mongoose');

const notificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, default: 'INFO' }, // e.g., ORDER_CONFIRMED
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = model('Notification', notificationSchema);
