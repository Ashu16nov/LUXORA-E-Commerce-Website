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
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { CurrencyContext } from '../context/CurrencyContext';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);
  const { currency, setCurrency, currencies } = useContext(CurrencyContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Close mobile menu & search on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowSearchInput(false);
  }, [location.pathname, location.search]);

  // Handle ESC key to close search overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSearchInput) {
        setShowSearchInput(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setSearchQuery('');
    }
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/products?search=${encodeURIComponent(tag)}`);
    setShowSearchInput(false);
    setSearchQuery('');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isCategoryActive = (cat) => {
    return location.pathname === '/products' && location.search.includes(`category=${cat}`);
  };

  return (
    <header className="luxora-header">
      {/* 1. TOP ANNOUNCEMENT & CONCIERGE BAR */}
      <div className="top-announcement-bar">
        <div className="container announcement-content">
          <div className="announcement-left">
            <span className="announcement-badge">VIP ACCESS</span>
            <span className="announcement-text">
              COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹999 & DESIGNER RENTALS
            </span>
          </div>

          <div className="announcement-right">
            <div className="concierge-link">
              <PhoneCall size={12} className="concierge-icon" />
              <span>Concierge: +91 (800) 900-LUX</span>
            </div>
            <div className="currency-selector">
              <Globe size={13} className="globe-icon" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Select Currency"
              >
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

      {/* 2. MAIN NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-logo" aria-label="LUXORA Home">
            <span className="logo-brand-text">LUXORA</span>
            <span className="logo-subtext">COUTURE & RENTALS</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-links-desktop">
            <Link
              to="/"
              className={`nav-link ${isActive('/') && !location.search ? 'active-link' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`nav-link ${location.pathname === '/products' && !location.search ? 'active-link' : ''}`}
            >
              Shop All
            </Link>
            <Link
              to="/rentals"
              className={`nav-rental-link ${isActive('/rentals') ? 'active-link' : ''}`}
            >
              <Sparkles size={14} className="sparkle-icon-pulse" />
              <span>Designer Rentals</span>
              <Crown size={13} className="crown-icon" />
            </Link>
            <Link
              to="/products?category=Women"
              className={`nav-link ${isCategoryActive('Women') ? 'active-link' : ''}`}
            >
              Women
            </Link>
            <Link
              to="/products?category=Men"
              className={`nav-link ${isCategoryActive('Men') ? 'active-link' : ''}`}
            >
              Men
            </Link>
            <Link
              to="/offers"
              className={`nav-link ${isActive('/offers') ? 'active-link' : ''}`}
            >
              Offers
            </Link>
          </div>

          {/* Icon Actions */}
          <div className="navbar-icons">
            {/* Search Toggle Trigger */}
            <button
              className={`icon-link search-trigger ${showSearchInput ? 'active' : ''}`}
              onClick={() => setShowSearchInput(!showSearchInput)}
              title="Search Products"
              aria-label="Open Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="icon-link wishlist-icon" title="Wishlist" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="cart-badge badge-heart">{wishlistItems.length}</span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <Link to="/cart" className="icon-link cart-icon" title="Shopping Bag" aria-label="Shopping Bag">
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="cart-badge">{totalCartCount}</span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="dropdown">
                <div className="user-profile-trigger">
                  <div className="avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name-inline">{user.name ? user.name.split(' ')[0] : 'User'}</span>
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
                    <Heart size={14} /> Saved Wishlist ({wishlistItems.length})
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
                <User size={15} /> <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 3. NON-INTRUSIVE FULL-HEADER GLASSMORPHIC SEARCH OVERLAY */}
        {showSearchInput && (
          <div className="nav-search-overlay">
            <div className="container search-overlay-inner">
              <form onSubmit={handleSearchSubmit} className="search-overlay-form">
                <Search size={22} className="search-bar-icon" />
                <input
                  type="text"
                  placeholder="Search designer tuxedos, lehengas, sarees, timepieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn-clear-query"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </button>
                )}
                <button type="submit" className="btn-search-submit">
                  Search
                </button>
              </form>

              <button
                type="button"
                className="btn-close-search"
                onClick={() => setShowSearchInput(false)}
                aria-label="Close search"
                title="Close Search"
              >
                <X size={22} />
              </button>
            </div>

            <div className="container search-tags-row">
              <span className="tags-label">Popular Searches:</span>
              <button type="button" className="search-chip" onClick={() => handleQuickTagClick('Sabyasachi')}>
                Sabyasachi Lehenga
              </button>
              <button type="button" className="search-chip" onClick={() => handleQuickTagClick('Tuxedo')}>
                Bespoke Tuxedos
              </button>
              <button type="button" className="search-chip" onClick={() => handleQuickTagClick('Silk Saree')}>
                Silk Sarees
              </button>
              <button type="button" className="search-chip" onClick={() => handleQuickTagClick('Rolex')}>
                Luxury Timepieces
              </button>
            </div>
          </div>
        )}

        {/* 4. MOBILE SLIDING DRAWER MENU */}
        <div className={`mobile-menu-drawer ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <span className="mobile-logo-text">LUXORA</span>
            <button
              className="mobile-close-btn"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mobile-drawer-body">
            <nav className="mobile-nav-links">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home <ArrowRight size={14} />
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                Shop All <ArrowRight size={14} />
              </Link>
              <Link to="/rentals" className="mobile-rental-highlight" onClick={() => setIsMenuOpen(false)}>
                <span><Sparkles size={16} /> Designer Rentals 👑</span> <ArrowRight size={14} />
              </Link>
              <Link to="/products?category=Women" onClick={() => setIsMenuOpen(false)}>
                Women's Collection <ArrowRight size={14} />
              </Link>
              <Link to="/products?category=Men" onClick={() => setIsMenuOpen(false)}>
                Men's Collection <ArrowRight size={14} />
              </Link>
              <Link to="/offers" onClick={() => setIsMenuOpen(false)}>
                Special Offers <ArrowRight size={14} />
              </Link>
            </nav>

            <div className="mobile-drawer-footer">
              {user ? (
                <div className="mobile-user-box">
                  <div className="mobile-user-info">
                    <div className="avatar-circle">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <div className="mobile-user-links">
                    {user.isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <ShieldCheck size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/myorders" onClick={() => setIsMenuOpen(false)}>
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/my-rentals" onClick={() => setIsMenuOpen(false)}>
                      <Crown size={16} /> My Rentals
                    </Link>
                    <button onClick={logout} className="mobile-logout-btn">
                      Logout Account
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="mobile-login-btn" onClick={() => setIsMenuOpen(false)}>
                  <User size={18} /> Sign In to LUXORA
                </Link>
              )}

              <div className="mobile-currency-row">
                <Globe size={14} />
                <span>Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
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

        {/* Mobile Backdrop Overlay */}
        {isMenuOpen && (
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
    </header>
  );
};

export default Navbar;
