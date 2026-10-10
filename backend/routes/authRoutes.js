const express = require('express');
const router = express.Router();
const {
  registerUser,
  sendOtp,
  verifyOtp,
  sendSignupOtp,
  verifySignupOtp,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserAdmin,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/send-signup-otp', sendSignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);

// Admin routes
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/role', protect, admin, updateUserAdmin);

module.exports = router;
