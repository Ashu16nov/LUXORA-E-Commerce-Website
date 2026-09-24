import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Truck, RefreshCcw, Star, Sparkles, Calendar, RotateCcw, ArrowRight, Clock, Award } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [allRentals, setAllRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [activeRentalCategory, setActiveRentalCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        
        // Filter trending products
        const trending = data.filter(p => p.trending);
        setTrendingProducts(trending.length > 0 ? trending.slice(0, 4) : data.slice(0, 4));
        
        // Filter products with offers
        const offers = data.filter(p => p.offer);
        setOfferProducts(offers.length > 0 ? offers.slice(0, 4) : data.slice(4, 8));

        // Fetch rental products for homepage feature
        const rentalRes = await axios.get('http://localhost:5000/api/rentals/products');
        setAllRentals(rentalRes.data);
        setFilteredRentals(rentalRes.data.slice(0, 4));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching homepage products', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterRentals = (cat) => {
    setActiveRentalCategory(cat);
    if (cat === 'All') {
      setFilteredRentals(allRentals.slice(0, 4));
    } else {
      const filtered = allRentals.filter(r => r.category.toLowerCase().includes(cat.toLowerCase()));
      setFilteredRentals(filtered.slice(0, 4));
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Wear Your Confidence</h1>
          <p>Discover the latest collections & luxury designer rentals for every version of you.</p>
          <div className="hero-buttons">
            <Link to="/products?category=Men" className="btn btn-primary">Shop Men</Link>
            <Link to="/products?category=Women" className="btn btn-secondary">Shop Women</Link>
            <Link to="/rentals" className="btn btn-gold" style={{ marginLeft: '1rem', background: '#d97706', color: '#fff', border: 'none' }}>
              <Sparkles size={16} /> Explore Cloth Rentals
            </Link>
          </div>
        </div>
      </section>

      {/* ENHANCED LUXORA CLOTH RENTAL SHOWCASE BANNER */}
      <section className="home-rental-showcase-section">
        <div className="container">
          {/* Section Header */}
          <div className="rental-showcase-header">
            <span className="gold-pill-badge">
              <Sparkles size={14} /> LUXORA CLOSET RENTAL MODULE
            </span>
            <h2>Luxora Designer Cloth Rental</h2>
            <p className="showcase-subtitle">
              Why spend lakhs buying high-end bridal lehengas, tuxedo suits or Rolex timepieces for a single day? Rent authentic designer fashion at <strong>1/10th of retail price</strong> for fixed periods with 100% refundable deposit & free doorstep returns.
            </p>

            {/* Feature Highlights Grid */}
            <div className="rental-feature-pills-row">
              <div className="feature-pill"><Calendar size={16} /> Flexible 3 to 30 Day Rentals</div>
              <div className="feature-pill"><ShieldCheck size={16} /> Refundable Security Deposit Guarantee</div>
              <div className="feature-pill"><RotateCcw size={16} /> 3 Stock Units for Concurrent Renting</div>
              <div className="feature-pill"><Award size={16} /> Steam-Sanitized & Dry-Cleaned</div>
            </div>

            {/* Quick Category Filter Tabs */}
            <div className="home-rental-tabs">
              {['All', 'Wedding', 'Gala', 'Suits', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  className={`home-tab-btn ${activeRentalCategory === cat ? 'active' : ''}`}
                  onClick={() => handleFilterRentals(cat)}
                >
                  {cat === 'All' ? 'All Luxury Rentals' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Showcase Grid */}
          <div className="home-rental-grid-4">
            {filteredRentals.map((item) => (
              <div key={item._id} className="home-rental-card-enhanced">
                <div className="home-rental-img-wrap">
                  <img src={item.images[0]} alt={item.name} />
                  <span className="stock-tag">⚡ 3 Units Available</span>
                  <span className="category-tag">{item.category}</span>
                </div>

                <div className="home-rental-card-body">
                  <div className="card-brand-row">
                    <span className="brand-name">{item.brand}</span>
                    <span className="rating-pill"><Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating || 4.9}</span>
                  </div>

                  <h3 className="card-item-name">{item.name}</h3>

                  <div className="card-price-box">
                    <div className="daily-price">
                      <span className="price-label">Rental Charge</span>
                      <span className="price-amount">₹{item.dailyRate} <small>/ day</small></span>
                    </div>
                    <div className="retail-price">
                      <span className="price-label">Original Retail</span>
                      <span className="original-amount">₹{item.originalValue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="deposit-info-row">
                    <span>Refundable Deposit: <strong>₹{item.securityDeposit.toLocaleString()}</strong></span>
                  </div>

                  <Link to={`/rentals/${item._id}`} className="btn-rent-card-action">
                    <Calendar size={15} /> Rent Outfit Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="home-rental-bottom-cta">
            <Link to="/rentals" className="btn-explore-full-closet">
              Explore Full Luxury Rental Collection (18+ Designer Items) <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Fashion Categories */}
      <section className="container categories-section">
        <div className="category-card men">
          <div className="category-content">
            <h3>Men's Fashion</h3>
            <p>Elevate your everyday look.</p>
            <Link to="/products?category=Men" className="btn btn-secondary">Explore</Link>
          </div>
        </div>
        <div className="category-card women">
          <div className="category-content">
            <h3>Women's Fashion</h3>
            <p>Elegance in every thread.</p>
            <Link to="/products?category=Women" className="btn btn-secondary">Explore</Link>
          </div>
        </div>
        <div className="category-card kids">
          <div className="category-content">
            <h3>Kids Collection</h3>
            <p>Style for the little ones.</p>
            <Link to="/products?category=Kids" className="btn btn-secondary">Explore</Link>
          </div>
        </div>
        <div className="category-card accessories">
          <div className="category-content">
            <h3>Accessories</h3>
            <p>The perfect finishing touch.</p>
            <Link to="/products?category=Accessories" className="btn btn-secondary">Explore</Link>
          </div>
        </div>
      </section>

      <Carousel />

      {/* Trending Products */}
      <section className="container trending-section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Trending Now</h2>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="grid grid-cols-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Special Offers Section */}
      <section className="container offers-section" style={{ padding: '4rem 0', backgroundColor: '#f9f9f9', marginTop: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Exclusive Offers</h2>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="grid grid-cols-4">
            {offerProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Shop With Us */}
      <section className="features-section">
        <div className="container grid grid-cols-4 text-center">
          <div className="feature-item">
            <Truck size={40} className="feature-icon" />
            <h4>Free Shipping</h4>
            <p>On orders above ₹999</p>
          </div>
          <div className="feature-item">
            <ShieldCheck size={40} className="feature-icon" />
            <h4>Secure Payments</h4>
            <p>Safe and encrypted checkout</p>
          </div>
          <div className="feature-item">
            <RefreshCcw size={40} className="feature-icon" />
            <h4>Easy Returns</h4>
            <p>Simple 30-day return experience</p>
          </div>
          <div className="feature-item">
            <Star size={40} className="feature-icon" />
            <h4>Premium Quality</h4>
            <p>Curated fashion collections</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container text-center newsletter-content">
          <h2>Stay Ahead of the Trends</h2>
          <p>Get updates on new collections, exclusive rental drops and fashion inspiration.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
