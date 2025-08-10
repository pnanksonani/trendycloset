const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ensure user cart exists
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

// GET /api/user/cart
exports.getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.sub);
  await cart.populate('items.product');
  const items = cart.items.map(i => ({
    _id: i.product?._id || i.product,
    productId: i.product?._id || i.product,
    title: i.product?.title,
    price: i.product?.price,
    imageUrl: i.product?.imageUrl,
    description: i.product?.description,
    qty: i.qty,
  }));
  res.json({ items });
};

// POST /api/user/cart  { productId, qty }
exports.addItem = async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.active) return res.status(404).json({ error: 'Product not found' });
  if (qty < 1) return res.status(400).json({ error: 'Invalid qty' });

  const cart = await getOrCreateCart(req.user.sub);
  const idx = cart.items.findIndex(i => String(i.product) === String(productId));
  if (idx >= 0) cart.items[idx].qty += qty;
  else cart.items.push({ product: productId, qty });

  await cart.save();
  return exports.getCart(req, res);
};

// PATCH /api/user/cart/:productId  { qty }
exports.updateItem = async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
  if (qty < 1) return res.status(400).json({ error: 'Invalid qty' });

  const cart = await getOrCreateCart(req.user.sub);
  const idx = cart.items.findIndex(i => String(i.product) === String(productId));
  if (idx < 0) return res.status(404).json({ error: 'Item not in cart' });
  cart.items[idx].qty = qty;
  await cart.save();
  return exports.getCart(req, res);
};

// DELETE /api/user/cart/:productId
exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user.sub);
  cart.items = cart.items.filter(i => String(i.product) !== String(productId));
  await cart.save();
  return exports.getCart(req, res);
};

// Optional: clear cart
exports.clearCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.sub);
  cart.items = [];
  await cart.save();
  res.json({ ok: true });
};
