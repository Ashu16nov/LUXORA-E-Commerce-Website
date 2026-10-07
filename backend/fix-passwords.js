require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('./config/db')();
setTimeout(async () => {
  const salt = await bcrypt.genSalt(10);
  const hash1 = await bcrypt.hash('test@123', salt);
  await User.updateOne({email: 'test@gmail.com'}, {password: hash1});
  
  const hash2 = await bcrypt.hash('password123', salt);
  await User.updateOne({email: 'admin@luxora.com'}, {password: hash2});
  
  console.log('Fixed passwords via updateOne');
  process.exit();
}, 2000);
