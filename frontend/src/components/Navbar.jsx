import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  Globe,
  ChevronDown,
  Package,
  ShieldCheck,
  Crown,
  Compass
} from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setSearchQuery('');
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="container announcement-content">
          <div className="announcement-left">
            <span className="announcement-badge">VIP ACCESS</span>
            <span className="announcement-text">
              COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹999 & DESIGNER RENTALS
            </span>
          </div>

          <div className="announcement-right">
            <div className="currency-selector">
              <Globe size={13} className="globe-icon" />
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

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-brand-text">LUXORA</span>
            <span className="logo-subtext">COUTURE & RENTALS</span>
          </Link>

          {/* Navigation Links */}
          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={isActive('/') ? 'active-link' : ''}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className={location.pathname === '/products' && !location.search ? 'active-link' : ''}
            >
              Shop All
            </Link>
            <Link
              to="/rentals"
              onClick={() => setIsMenuOpen(false)}
              className={`nav-rental-link ${isActive('/rentals') ? 'active-link' : ''}`}
            >
              <Sparkles size={14} className="sparkle-icon-pulse" /> Designer Rentals 👑
            </Link>
            <Link
              to="/products?category=Women"
              onClick={() => setIsMenuOpen(false)}
              className={location.search.includes('Women') ? 'active-link' : ''}
            >
              Women
            </Link>
            <Link
              to="/products?category=Men"
              onClick={() => setIsMenuOpen(false)}
              className={location.search.includes('Men') ? 'active-link' : ''}
            >
              Men
            </Link>
            <Link
              to="/offers"
              onClick={() => setIsMenuOpen(false)}
              className={isActive('/offers') ? 'active-link' : ''}
            >
              Offers
            </Link>

            {/* AI Stylist Button */}
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

          {/* Icon Actions */}
          <div className="navbar-icons">
            {/* Search Input Toggle */}
            <div className="search-wrap">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="nav-search-form">
                  <Search size={16} className="search-input-icon" />
                  <input
                    type="text"
                    placeholder="Search designer outfits, tuxedos, sarees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn-search-close"
                    onClick={() => setShowSearchInput(false)}
                  >
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
                <div className="icon-link user-profile-trigger">
                  <div className="avatar-circle">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="dropdown-caret" />
                </div>

                <div className="dropdown-content">
                  <div className="user-dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>

                  {user.isAdmin && (
                    <Link to="/admin" className="admin-link-highlight">
                      <ShieldCheck size={15} /> Admin Dashboard
                    </Link>
                  )}

                  <Link to="/profile">
                    <User size={14} /> My Profile
                  </Link>
                  <Link to="/wishlist">
                    <Heart size={14} /> Saved Items ({wishlistItems.length})
                  </Link>
                  <Link to="/myorders">
                    <Package size={14} /> Orders & Returns
                  </Link>
                  <Link to="/my-rentals">
                    <Crown size={14} /> My Rentals 👑
                  </Link>
                  <button onClick={logout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-nav-login" title="Account Login">
                <User size={16} /> Login
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

