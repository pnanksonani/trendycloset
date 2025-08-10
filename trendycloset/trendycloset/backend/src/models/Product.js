const { Schema, model, Types } = require('mongoose');

const productSchema = new Schema({
  partner: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = model('Product', productSchema);
