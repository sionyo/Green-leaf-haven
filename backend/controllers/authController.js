const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check against hardcoded admin credentials from .env
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate token with admin info
    const token = generateToken({
      id: 'admin',
      email: process.env.ADMIN_EMAIL,
      role: 'admin'
    });

    res.json({
      message: 'Admin login successful',
      user: {
        email: process.env.ADMIN_EMAIL,
        role: 'admin'
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    res.json({
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile
};