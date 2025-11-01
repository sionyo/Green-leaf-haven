const Order = require('../models/Order');
const Cart = require('../models/Cart');
const axios = require('axios');


const createPaymentIntent = async (req, res) => {
  try {
    const { sessionId, customerEmail, customerName, shippingAddress } = req.body;

    // Get cart items
    const cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = Math.round(cart.total * 100); // Convert to cents for Stripe

    // Create order first
    const order = new Order({
      sessionId,
      customerEmail,
      customerName,
      shippingAddress,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: cart.total,
      tax: 0,
      shipping: 0,
      total: cart.total,
      paymentStatus: 'pending'
    });

    await order.save();

    // Make HTTP call to Stripe to create payment intent
    const stripeResponse = await axios.post('https://api.stripe.com/v1/payment_intents', 
      `amount=${totalAmount}&currency=usd&metadata[orderId]=${order._id}&automatic_payment_methods[enabled]=true`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Update order with payment intent ID
    order.paymentIntentId = stripeResponse.data.id;
    await order.save();

    res.json({
      clientSecret: stripeResponse.data.client_secret,
      orderId: order._id,
      amount: totalAmount
    });

  } catch (error) {
    console.error('Payment intent error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Payment processing failed',
      error: error.response?.data || error.message 
    });
  }
};

// @desc    Confirm payment and update order
// @route   POST /api/payment/confirm-payment
// @access  Public
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Verify payment with Stripe
    const stripeResponse = await axios.get(
      `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
        }
      }
    );

    const paymentStatus = stripeResponse.data.status;

    // Update order status based on payment status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (paymentStatus === 'succeeded') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      
      // Clear the cart after successful payment
      await Cart.findOneAndUpdate(
        { sessionId: order.sessionId },
        { items: [], total: 0 }
      );
      
      await order.save();
      
      res.json({ 
        success: true, 
        message: 'Payment successful', 
        order 
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      
      res.status(400).json({ 
        success: false, 
        message: 'Payment failed', 
        order 
      });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Payment confirmation failed',
      error: error.response?.data || error.message 
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/payment/order/:orderId
// @access  Public
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get orders by session ID
// @route   GET /api/payment/orders/:sessionId
// @access  Public
const getOrdersBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const orders = await Order.find({ sessionId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getOrder,
  getOrdersBySession
};