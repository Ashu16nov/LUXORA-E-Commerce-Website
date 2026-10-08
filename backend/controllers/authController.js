const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const generateToken = require('../utils/generateToken');
const sendOtpEmail = require('../utils/sendEmail');

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim().toLowerCase());
};

// @desc    Send OTP to user email for login (each valid email ID every time)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address format. Please enter a valid email ID.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email ID. No registered account found.' });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Bypass OTP requirement for demo accounts (test@gmail.com & admin@luxora.com)
    if (cleanEmail === 'test@gmail.com' || cleanEmail === 'admin@luxora.com') {
      return res.json({
        requireOtp: false,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        token: generateToken(user._id),
      });
    }

    // Generate 6-digit OTP code for every login attempt
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`[LUXORA LOGIN OTP] Email: ${user.email} | OTP: ${otp}`);

    await sendOtpEmail(user.email, otp, user.name);

    res.json({
      requireOtp: true,
      success: true,
      message: `Security OTP sent to ${user.email}`,
    });
  } catch (error) {
    console.error(`Send OTP Error: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to send security OTP' });
  }
};

// @desc    Verify OTP & authenticate user for login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { email, password, otp } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.otp || user.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check your email inbox.' });
    }

    if (user.otpExpire && new Date(user.otpExpire) < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new code.' });
    }

    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(`Verify OTP Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// @desc    Send OTP for new user signup registration
// @route   POST /api/auth/send-signup-otp
// @access  Public
const sendSignupOtp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address format. Please enter a valid email ID.' });
  }

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Please enter a valid full name.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email ID already exists. Please sign in instead.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    await PendingUser.updateOne(
      { email: cleanEmail },
      { name, email: cleanEmail, password, otp, otpExpire },
      { upsert: true }
    );

    console.log(`[LUXORA SIGNUP OTP] Email: ${cleanEmail} | OTP: ${otp}`);

    await sendOtpEmail(cleanEmail, otp, name);

    res.json({
      success: true,
      message: `Registration OTP sent to ${cleanEmail}`,
    });
  } catch (error) {
    console.error(`Send Signup OTP Error: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to send registration OTP' });
  }
};

// @desc    Verify Signup OTP and complete user registration
// @route   POST /api/auth/verify-signup-otp
// @access  Public
const verifySignupOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const pending = await PendingUser.findOne({ email: cleanEmail });

    if (!pending) {
      return res.status(400).json({ message: 'Registration request not found or expired. Please sign up again.' });
    }

    if (!pending.otp || pending.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check your email inbox.' });
    }

    if (pending.otpExpire && new Date(pending.otpExpire) < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new code.' });
    }

    // Create new user in database
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
    });

    // Delete pending record
    await PendingUser.deleteOne({ _id: pending._id });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(`Verify Signup OTP Error: ${error.message}`);
    res.status(500).json({ message: 'Server error creating user account' });
  }
};

// @desc    Register user (Legacy direct endpoint fallback)
const registerUser = async (req, res) => {
  return sendSignupOtp(req, res);
};

// @desc    Auth user & get token (Legacy direct endpoint fallback)
const authUser = async (req, res) => {
  return sendOtp(req, res);
};

// @desc    Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address?.street,
        city: req.body.address.city || user.address?.city,
        postalCode: req.body.address.postalCode || user.address?.postalCode,
        country: req.body.address.country || user.address?.country,
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching users' });
  }
};

// @desc    Delete user (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting user' });
  }
};

// @desc    Update user admin status (Admin)
const updateUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : !user.isAdmin;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating user role' });
  }
};

module.exports = {
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
  updateUserAdmin
};
