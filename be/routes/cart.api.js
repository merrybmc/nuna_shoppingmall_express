const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/', authController.authenticate, cartController.addToCart);
router.get('/', authController.authenticate, cartController.getCart);
router.get('/qty', authController.authenticate, cartController.getCartQty);
module.exports = router;
