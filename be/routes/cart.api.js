const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/', authController.authenticate, cartController.addToCart);
router.get('/', authController.authenticate, cartController.getCart);

module.exports = router;
