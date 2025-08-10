const router = require('express').Router();
const { requireAuth } = require('../middlewares/requireAuth');
const { requireRole } = require('../middlewares/requireRole');
const cart = require('../controllers/cartController');
const orders = require('../controllers/orderController');

// Cart
router.get('/cart', requireAuth, requireRole('USER'), cart.getCart);
router.post('/cart', requireAuth, requireRole('USER'), cart.addItem);
router.patch('/cart/:productId', requireAuth, requireRole('USER'), cart.updateItem);
router.delete('/cart/:productId', requireAuth, requireRole('USER'), cart.removeItem);

// Orders
router.get('/orders', requireAuth, requireRole('USER'), orders.listMyOrders);

// Place order (uses current cart)
router.post('/orders', requireAuth, requireRole('USER'), orders.placeOrder);

module.exports = router;

