const router = require('express').Router();
const { requireAuth } = require('../middlewares/requireAuth');

const { listMine, markRead, markAllRead } = require('../controllers/notificationController');

router.get('/', requireAuth, listMine);
router.patch('/:id/read', requireAuth, markRead);
router.patch('/read-all', requireAuth, markAllRead);

module.exports = router;
