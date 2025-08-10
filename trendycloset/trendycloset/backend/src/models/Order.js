const { Schema, model, Types } = require('mongoose');

const orderItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  title: String,
  priceAtPurchase: Number,
  qty: Number,
  subtotal: Number,
}, { _id: false });

const orderSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  partner: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'REJECTED'], default: 'PENDING', index: true },
  confirmedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = model('Order', orderSchema);
