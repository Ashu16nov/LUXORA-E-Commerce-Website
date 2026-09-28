import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Heart, User, Menu, X, Sparkles, Globe, ChevronDown, Package } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { CurrencyContext } from '../context/CurrencyContext';
import AiStylistModal from './AiStylistModal';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);
  const { currency, setCurrency, currencies } = useContext(CurrencyContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setSearchQuery('');
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <>
      {/* Top Banner Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="container announcement-content">
          <span>✨ COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹999 & DESIGNER RENTALS</span>
          <div className="announcement-right">
            {/* Currency Selector */}
            <div className="currency-selector">
              <Globe size={13} />
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {Object.keys(currencies).map((curr) => (
                  <option key={curr} value={curr}>
                    {currencies[curr].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo luxora-title">
            LUXORA
          </Link>

          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
            <Link to="/rentals" onClick={() => setIsMenuOpen(false)} className="nav-rental-link">
              <Sparkles size={14} /> Luxury Rentals 👑
            </Link>
            <Link to="/products?category=Men" onClick={() => setIsMenuOpen(false)}>Men</Link>
            <Link to="/products?category=Women" onClick={() => setIsMenuOpen(false)}>Women</Link>
            <Link to="/offers" onClick={() => setIsMenuOpen(false)}>Offers</Link>
            
            {/* AI Stylist Button in Nav */}
            <button
              className="nav-ai-btn"
              onClick={() => {
                setIsMenuOpen(false);
                setIsStylistOpen(true);
              }}
            >
              <Sparkles size={14} /> AI Stylist
            </button>
          </div>

          <div className="navbar-icons">
            {/* Search Input Toggle */}
            <div className="search-wrap">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="nav-search-form">
                  <input
                    type="text"
                    placeholder="Search fashion, tuxedos, lehengas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowSearchInput(false)}>
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  className="icon-link search-trigger"
                  onClick={() => setShowSearchInput(true)}
                  title="Search products"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="icon-link wishlist-icon" title="Wishlist">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="cart-badge badge-heart">{wishlistItems.length}</span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="icon-link cart-icon" title="Shopping Bag">
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="cart-badge">{totalCartCount}</span>
              )}
            </Link>

            {/* User Profile */}
            {user ? (
              <div className="dropdown">
                <span className="icon-link user-profile-trigger">
                  <User size={20} />
                  <span className="user-name-inline">{user.name.split(' ')[0]}</span>
                </span>
                <div className="dropdown-content">
                  <div className="user-dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/profile">My Profile</Link>
                  <Link to="/wishlist">My Wishlist ({wishlistItems.length})</Link>
                  <Link to="/myorders">
                    <Package size={14} style={{ marginRight: '6px' }} /> My Orders
                  </Link>
                  <Link to="/my-rentals">My Rentals 👑</Link>
                  <button onClick={logout} className="logout-btn">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="icon-link" title="Account">
                <User size={20} />
              </Link>
            )}

            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* AI Stylist Modal */}
      <AiStylistModal isOpen={isStylistOpen} onClose={() => setIsStylistOpen(false)} />
    </>
  );
};

export default Navbar;
