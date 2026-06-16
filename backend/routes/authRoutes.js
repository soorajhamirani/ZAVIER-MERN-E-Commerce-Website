const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  syncUserCart
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/cart', protect, syncUserCart);

module.exports = router;
