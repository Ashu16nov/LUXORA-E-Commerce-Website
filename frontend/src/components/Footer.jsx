import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Send, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container grid grid-cols-4 footer-grid">
        <div className="footer-section brand-section">
          <h2 className="luxora-title font-gold">LUXORA</h2>
          <p className="luxora-tagline">WEAR YOUR CONFIDENCE</p>
          <p className="footer-desc mt-2">
            The premier destination for haute couture retail & luxury clothing rentals. Curated designer outfits for royal weddings, galas, and red carpet moments.
          </p>

          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Globe size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Share2 size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Send size={18} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Explore Collections</h3>
          <ul>
            <li><Link to="/products">All Retail Products</Link></li>
            <li><Link to="/rentals">Luxury Rentals Closet 👑</Link></li>
            <li><Link to="/products?category=Men">Men's Apparel</Link></li>
            <li><Link to="/products?category=Women">Women's Couture</Link></li>
            <li><Link to="/products?category=Accessories">Designer Accessories</Link></li>
            <li><Link to="/offers">Exclusive Offers & Sales</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Concierge</h3>
          <ul>
            <li><Link to="/wishlist">My Saved Wishlist ❤️</Link></li>
            <li><Link to="/myorders">Track Order Status 📦</Link></li>
            <li><Link to="/my-rentals">My Active Rentals 👑</Link></li>
            <li><Link to="/profile">Account Settings</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>LUXORA Guarantee</h3>
          <ul className="guarantee-list">
            <li><ShieldCheck size={16} className="text-gold" /> 100% Authentic Designer Pieces</li>
            <li><Sparkles size={16} className="text-gold" /> Steam-Sanitized & Dry Cleaned</li>
            <li><Heart size={16} className="text-gold" /> Guaranteed Refundable Security Deposit</li>
          </ul>
          <div className="payment-badges-wrap mt-3">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">MASTERCARD</span>
            <span className="pay-badge">UPI</span>
            <span className="pay-badge">APPLE PAY</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} LUXORA Haute Couture & Rental Boutique. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
