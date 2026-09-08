const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('buffering timed out') || error.message.includes('timeout')) {
       console.error('\n--> IMPORTANT: This usually means your current IP Address is NOT whitelisted in MongoDB Atlas.');
       console.error('--> Please log in to MongoDB Atlas -> Security -> Network Access -> Add IP Address (Add Current IP Address)\n');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
