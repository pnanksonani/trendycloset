const { Schema, model, Types } = require('mongoose');

const cartItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, min: 1, default: 1 },
}, { _id: false });

const cartSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
}, { timestamps: true });

module.exports = model('Cart', cartSchema);
