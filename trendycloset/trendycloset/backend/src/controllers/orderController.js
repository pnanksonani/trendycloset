const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { sendMail } = require('../utils/mailer');

// User: place order from cart (creates one order per partner)
exports.placeOrder = async (req, res) => {
  const userId = req.user.sub;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart empty' });

  // Group items by partner
  const byPartner = new Map();
  for (const it of cart.items) {
    const p = it.product;
    if (!p || !p.active) continue;
    const key = String(p.partner);
    if (!byPartner.has(key)) byPartner.set(key, []);
    const price = Number(p.price || 0);
    const qty = Number(it.qty || 1);
    byPartner.get(key).push({
      product: p._id, title: p.title, priceAtPurchase: price, qty, subtotal: price * qty,
    });
  }

  if (byPartner.size === 0) return res.status(400).json({ error: 'No valid items' });

  const created = [];
  for (const [partnerId, items] of byPartner.entries()) {
    const total = items.reduce((s, x) => s + x.subtotal, 0);
    const order = await Order.create({
      user: userId, partner: partnerId, items, total, status: 'PENDING',
    });
    created.push(order);
  }

  // Optional: clear cart after placing
  cart.items = [];
  await cart.save();

  res.status(201).json({ orders: created });
};

// User: list my orders
exports.listMyOrders = async (req, res) => {
  const items = await Order.find({ user: req.user.sub }).sort({ createdAt: -1 }).lean();
  res.json({ items });
};

// Partner: list orders for my products
exports.listPartnerOrders = async (req, res) => {
  const { status } = req.query; // optional
  const q = { partner: req.user.sub };
  if (status) q.status = status;
  const items = await Order.find(q).sort({ createdAt: -1 }).lean();
  res.json({ items });
};

// Partner: confirm order (decrement stock, notify user, email receipt)
exports.confirmOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, partner: req.user.sub });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'PENDING') return res.status(400).json({ error: 'Order not pending' });

  // Decrement stock (best-effort; no reservations in this simple version)
  for (const it of order.items) {
    await Product.updateOne({ _id: it.product }, { $inc: { stock: -it.qty } });
  }

  order.status = 'CONFIRMED';
  order.confirmedAt = new Date();
  await order.save();

  // In-app notification
  try {
    await Notification.create({
      user: order.user,
      type: 'ORDER_CONFIRMED',
      message: `Your order ${order._id} has been confirmed.`,
    });
  } catch (_) {}

  // Email receipt
  try {
    const html = buildReceiptHtml(order);
    // send to the user's email; quick lookup (avoids circular import)
    const User = require('../models/User');
    const user = await User.findById(order.user).lean();
    if (user?.email) {
      await sendMail(user.email, 'Your TrendyCloset order receipt', html);
    }
  } catch (e) {
    console.error('Email receipt failed:', e.message);
  }

  res.json({ message: 'Order confirmed', order });
};

function buildReceiptHtml(order) {
  const rows = order.items.map(i =>
    `<tr><td>${i.title}</td><td style="text-align:right">${i.qty}</td><td style="text-align:right">$${i.priceAtPurchase.toFixed(2)}</td><td style="text-align:right">$${i.subtotal.toFixed(2)}</td></tr>`
  ).join('');
  return `
  <div style="font-family:Arial,sans-serif">
    <h2>Order Receipt</h2>
    <p>Order ID: <b>${order._id}</b></p>
    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <thead><tr><th align="left">Item</th><th align="right">Qty</th><th align="right">Price</th><th align="right">Subtotal</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="3" align="right"><b>Total</b></td><td align="right"><b>$${order.total.toFixed(2)}</b></td></tr></tfoot>
    </table>
    <p>Status: ${order.status}</p>
    <p>Thanks for shopping at TrendyCloset!</p>
  </div>`;
}
