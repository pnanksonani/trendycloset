const Product = require('../models/Product');

// Public list
exports.listPublic = async (req, res) => {
  const items = await Product.find({ active: true }).sort({ createdAt: -1 }).lean();
  res.json({ items });
};

// Partner: list own
exports.listMine = async (req, res) => {
  const items = await Product.find({ partner: req.user.sub }).sort({ createdAt: -1 }).lean();
  res.json({ items });
};

// Partner: create
exports.create = async (req, res) => {
  const { title, price, stock, imageUrl = '', description = '' } = req.body;
  if (!title || price == null || stock == null) return res.status(400).json({ error: 'Missing fields' });
  const item = await Product.create({
    partner: req.user.sub, title, price, stock, imageUrl, description, active: true,
  });
  res.status(201).json({ item });
};

// (Optional) Partner: update / delete
exports.update = async (req, res) => {
  const { id } = req.params;
  const prod = await Product.findOneAndUpdate(
    { _id: id, partner: req.user.sub },
    { $set: req.body },
    { new: true }
  );
  if (!prod) return res.status(404).json({ error: 'Not found' });
  res.json({ item: prod });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const del = await Product.findOneAndDelete({ _id: id, partner: req.user.sub });
  if (!del) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
};
