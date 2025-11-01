const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// All routes are public and use sessionId
router.get('/:sessionId', getCart);
router.post('/:sessionId/items', addToCart);
router.put('/:sessionId/items/:itemId', updateCartItem);
router.delete('/:sessionId/items/:itemId', removeFromCart);
router.delete('/:sessionId', clearCart);

module.exports = router;