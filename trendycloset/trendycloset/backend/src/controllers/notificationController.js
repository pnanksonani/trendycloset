const Notification = require('../models/Notification');

// GET /api/notifications
exports.listMine = async (req, res) => {
  const items = await Notification.find({ user: req.user.sub })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json({ items });
};

// PATCH /api/notifications/:id/read
exports.markRead = async (req, res) => {
  const { id } = req.params;
  const n = await Notification.findOneAndUpdate(
    { _id: id, user: req.user.sub },
    { $set: { read: true } },
    { new: true }
  );
  if (!n) return res.status(404).json({ error: 'Not found' });
  res.json({ item: n });
};

// PATCH /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  await Notification.updateMany({ user: req.user.sub, read: false }, { $set: { read: true } });
  res.json({ ok: true });
};
