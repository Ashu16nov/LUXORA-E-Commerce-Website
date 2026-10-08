const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpire: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

module.exports = PendingUser;
