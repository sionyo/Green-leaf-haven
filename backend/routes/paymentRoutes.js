const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getOrder,
  getOrdersBySession
} = require('../controllers/paymentController');

// Public routes
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment', confirmPayment);
router.get('/order/:orderId', getOrder);
router.get('/orders/:sessionId', getOrdersBySession);

module.exports = router;