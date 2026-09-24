const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rentals', rentalRoutes);

const Product = require('./models/Product');
const RentalProduct = require('./models/RentalProduct');
const { sampleRentalProducts } = require('./controllers/rentalController');
const fs = require('fs');

app.get('/api/seed-db', async (req, res) => {
  try {
    const seedPath = 'd:\\Sem 3\\TT 2 Lab\\LUXORA\\backend\\seed\\seedData.js';
    const content = fs.readFileSync(seedPath, 'utf8');
    const startIdx = content.indexOf('const products = [');
    const endIdx = content.indexOf('];', startIdx) + 2;
    const productsString = content.slice(startIdx + 'const products = '.length, endIdx - 1);
    const products = eval(productsString);
    
    await Product.deleteMany();
    await Product.insertMany(products);

    await RentalProduct.deleteMany();
    await RentalProduct.insertMany(sampleRentalProducts);

    res.json({ message: 'DB Seeded Successfully with standard and 22 luxury rental products' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-seed rental products if collection is empty
setTimeout(async () => {
  try {
    const count = await RentalProduct.countDocuments();
    if (count === 0) {
      await RentalProduct.insertMany(sampleRentalProducts);
      console.log('Auto-seeded 22 luxury rental products into MongoDB!');
    }
  } catch (err) {
    console.log('Rental auto-seed note:', err.message);
  }
}, 3000);

// Base route
app.get('/', (req, res) => {
  res.send('LUXORA API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
