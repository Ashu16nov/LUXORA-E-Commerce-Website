import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Heart, User, Menu, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo luxora-title">
          LUXORA
        </Link>
        
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link to="/products?category=Men" onClick={() => setIsMenuOpen(false)}>Men</Link>
          <Link to="/products?category=Women" onClick={() => setIsMenuOpen(false)}>Women</Link>
          <Link to="/offers" onClick={() => setIsMenuOpen(false)}>Offers</Link>
        </div>

        <div className="navbar-icons">
          <Link to="/products" className="icon-link"><Search size={20} /></Link>
          <Link to="/wishlist" className="icon-link"><Heart size={20} /></Link>
          <Link to="/cart" className="icon-link cart-icon">
            <ShoppingBag size={20} />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>
          {user ? (
            <div className="dropdown">
              <span className="icon-link" style={{ cursor: 'pointer' }}><User size={20} /></span>
              <div className="dropdown-content">
                <span>{user.name}</span>
                <Link to="/myorders">Orders</Link>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="icon-link"><User size={20} /></Link>
          )}
          
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
