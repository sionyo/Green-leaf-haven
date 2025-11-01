const express = require('express');
const router = express.Router();
const { adminLogin, getAdminProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin login route
router.post('/login', adminLogin);

// Get admin profile (protected route)
router.get('/profile', protect, admin, getAdminProfile);

module.exports = router;