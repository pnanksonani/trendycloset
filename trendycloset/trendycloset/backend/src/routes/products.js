const router = require('express').Router();
const { listPublic } = require('../controllers/productController');

// Public products
router.get('/', listPublic);

module.exports = router;
