const router = require('express').Router();
const { requireAuth } = require('../middlewares/requireAuth');
const { requireRole } = require('../middlewares/requireRole');
const product = require('../controllers/productController');
const orders = require('../controllers/orderController');

// Product management
router.get('/products', requireAuth, requireRole('PARTNER'), product.listMine);
router.post('/products', requireAuth, requireRole('PARTNER'), product.create);
router.patch('/products/:id', requireAuth, requireRole('PARTNER'), product.update);
router.delete('/products/:id', requireAuth, requireRole('PARTNER'), product.remove);

// Orders received
router.get('/orders', requireAuth, requireRole('PARTNER'), orders.listPartnerOrders);
router.post('/orders/:id/confirm', requireAuth, requireRole('PARTNER'), orders.confirmOrder);

module.exports = router;
