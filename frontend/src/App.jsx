import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import RentalProducts from './pages/RentalProducts';
import RentalDetails from './pages/RentalDetails';
import RentalCheckout from './pages/RentalCheckout';
import MyRentals from './pages/MyRentals';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/rentals" element={<RentalProducts />} />
            <Route path="/rentals/:id" element={<RentalDetails />} />
            <Route path="/rentals/checkout" element={<RentalCheckout />} />
            <Route path="/my-rentals" element={<MyRentals />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
