require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const main = async () => {
  await connectDB();
  const salt = await bcrypt.genSalt(10);
  const hash1 = await bcrypt.hash('test@123', salt);
  await User.updateOne({email: 'test@gmail.com'}, {password: hash1});
  
  const hash2 = await bcrypt.hash('p@ssword123', salt);
  await User.updateOne({email: 'admin@luxora.com'}, {password: hash2});
  
  console.log('Fixed admin password to p@ssword123 via updateOne');
  process.exit(0);
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
