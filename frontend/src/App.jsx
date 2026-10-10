import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';

// Admin Module imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminRentals from './pages/admin/AdminRentals';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      <main style={{ flex: 1, paddingTop: isAdminRoute ? '0px' : isAuthRoute ? '95px' : '130px' }}>
        <Routes>
          {/* Public & Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/rentals" element={<RentalProducts />} />
          <Route path="/rentals/:id" element={<RentalDetails />} />
          <Route path="/rentals/checkout" element={<RentalCheckout />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin Module Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="rentals" element={<AdminRentals />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CurrencyProvider>
      <WishlistProvider>
        <ToastProvider>
          <Router>
            <AppLayout />
          </Router>
        </ToastProvider>
      </WishlistProvider>
    </CurrencyProvider>
  );
}

export default App;
