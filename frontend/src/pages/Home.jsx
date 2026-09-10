import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Truck, RefreshCcw, Star } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Just fetch some products for home, can use a specific endpoint or query in real app
        const { data } = await axios.get('http://localhost:5000/api/products');
        setTrendingProducts(data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending products', error);
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Wear Your Confidence</h1>
          <p>Discover the latest collections crafted for every version of you.</p>
          <div className="hero-buttons">
            <Link to="/products?category=Men" className="btn btn-primary">Shop Men</Link>
            <Link to="/products?category=Women" className="btn btn-secondary">Shop Women</Link>
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
          <p>Get updates on new collections, exclusive offers and fashion inspiration.</p>
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
