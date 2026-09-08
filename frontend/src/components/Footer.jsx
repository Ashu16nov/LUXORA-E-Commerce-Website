import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container grid grid-cols-4 footer-grid">
        <div className="footer-section brand-section">
          <h2>ÉLAN</h2>
          <p>Style Beyond Trends</p>
          <p className="mt-2">Discover the latest collections crafted for every version of you.</p>
        </div>
        
        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li><Link to="/products?category=Men">Men</Link></li>
            <li><Link to="/products?category=Women">Women</Link></li>
            <li><Link to="/products?category=Kids">Kids</Link></li>
            <li><Link to="/products?category=Accessories">Accessories</Link></li>
            <li><Link to="/offers">Offers</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Help</h3>
          <ul>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LUXORA / ÉLAN. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
