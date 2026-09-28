import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import AiStylistModal from '../components/AiStylistModal';
import { CurrencyContext } from '../context/CurrencyContext';
import { ToastContext } from '../context/ToastContext';
import { WishlistContext } from '../context/WishlistContext';
import {
  ShieldCheck,
  Truck,
  RefreshCcw,
  Star,
  Sparkles,
  Calendar,
  RotateCcw,
  ArrowRight,
  Award,
  Flame,
  CheckCircle,
  Eye,
  Heart
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [allRentals, setAllRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [activeRentalCategory, setActiveRentalCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);

  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        
        const productsList = Array.isArray(data) ? data : data.products || [];

        // Filter trending products
        const trending = productsList.filter(p => p.trending);
        setTrendingProducts(trending.length > 0 ? trending.slice(0, 4) : productsList.slice(0, 4));
        
        // Filter products with offers
        const offers = productsList.filter(p => p.offer);
        setOfferProducts(offers.length > 0 ? offers.slice(0, 4) : productsList.slice(4, 8));

        // Fetch rental products
        const rentalRes = await axios.get('http://localhost:5000/api/rentals/products');
        const rentalList = Array.isArray(rentalRes.data) ? rentalRes.data : [];
        setAllRentals(rentalList);
        setFilteredRentals(rentalList.slice(0, 4));
        
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      addToast(`Thank you for subscribing with ${newsletterEmail}! Check your inbox for 15% off code.`, 'success', 'VIP Club Joined');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <span className="hero-gold-badge">
            <Sparkles size={14} /> AUTUMN / WINTER 2026 COUTURE EDIT
          </span>
          <h1>Wear Your Confidence</h1>
          <p>Discover luxury designer collections & authentic high-end clothing rentals tailored for every version of you.</p>

          <div className="hero-buttons">
            <Link to="/products?category=Men" className="btn btn-primary">Shop Men</Link>
            <Link to="/products?category=Women" className="btn btn-secondary">Shop Women</Link>
            <Link to="/rentals" className="btn btn-gold">
              <Sparkles size={16} /> Explore Designer Rentals 👑
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="hero-stats-bar">
            <div className="stat-box">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Authentic Designer</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-number">1/10th</span>
              <span className="stat-label">Rental Price vs Retail</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI STYLIST BANNER SECTION */}
      <section className="ai-stylist-promo-banner container">
        <div className="ai-promo-content">
          <div className="ai-promo-text">
            <span className="ai-pill"><Sparkles size={14} /> LUXORA AI VIRTUAL STYLIST</span>
            <h2>Not sure what to wear for your next big event?</h2>
            <p>Tell our AI your occasion, vibe & dress code — get an instant high-fashion outfit pairing from our retail and rental closets.</p>
          </div>
          <button className="btn-ai-promo-trigger" onClick={() => setIsAiStylistOpen(true)}>
            <Sparkles size={18} /> Launch AI Stylist Matcher
          </button>
        </div>
      </section>

      {/* LUXORA CLOTH RENTAL SHOWCASE */}
      <section className="home-rental-showcase-section">
        <div className="container">
          <div className="rental-showcase-header">
            <span className="gold-pill-badge">
              <Sparkles size={14} /> LUXORA CLOSET RENTAL MODULE
            </span>
            <h2>Luxora Designer Cloth Rental</h2>
            <p className="showcase-subtitle">
              Why spend lakhs buying high-end bridal lehengas, tuxedo suits or Rolex timepieces for a single day? Rent authentic designer fashion at <strong>1/10th of retail price</strong> for fixed periods with 100% refundable deposit & free doorstep returns.
            </p>

            <div className="rental-feature-pills-row">
              <div className="feature-pill"><Calendar size={16} /> Flexible 3 to 30 Day Rentals</div>
              <div className="feature-pill"><ShieldCheck size={16} /> Refundable Security Deposit Guarantee</div>
              <div className="feature-pill"><RotateCcw size={16} /> Stock Available for Immediate Renting</div>
              <div className="feature-pill"><Award size={16} /> Steam-Sanitized & Dry-Cleaned</div>
            </div>

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

          <div className="home-rental-grid-4">
            {filteredRentals.map((item) => (
              <div key={item._id} className="home-rental-card-enhanced">
                <div className="home-rental-img-wrap">
                  <img src={item.images[0]} alt={item.name} />
                  <span className="stock-tag">⚡ 3 Units Available</span>
                  <span className="category-tag">{item.category}</span>
                  <button
                    className={`rental-wish-btn ${isInWishlist(item._id) ? 'active' : ''}`}
                    onClick={() => {
                      toggleWishlist(item);
                      addToast(isInWishlist(item._id) ? `Removed from Wishlist` : `Saved ${item.name} to Wishlist!`, 'info');
                    }}
                  >
                    <Heart size={16} fill={isInWishlist(item._id) ? '#e11d48' : 'none'} color={isInWishlist(item._id) ? '#e11d48' : '#fff'} />
                  </button>
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
                      <span className="price-amount">{formatPrice(item.dailyRate)} <small>/ day</small></span>
                    </div>
                    <div className="retail-price">
                      <span className="price-label">Original Retail</span>
                      <span className="original-amount">{formatPrice(item.originalValue)}</span>
                    </div>
                  </div>

                  <div className="deposit-info-row">
                    <span>Refundable Deposit: <strong>{formatPrice(item.securityDeposit)}</strong></span>
                  </div>

                  <div className="rental-card-btn-group">
                    <Link to={`/rentals/${item._id}`} className="btn-rent-card-action">
                      <Calendar size={15} /> Rent Outfit Now
                    </Link>
                    <button className="btn-rent-quickview" onClick={() => setQuickViewProduct(item)} title="Quick View">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="home-rental-bottom-cta">
            <Link to="/rentals" className="btn-explore-full-closet">
              Explore Full Luxury Rental Collection (18+ Designer Items) <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Fashion Categories */}
      <section className="container categories-section">
        <h2 className="section-heading text-center">Curated Fashion Categories</h2>
        <div className="categories-grid-4">
          <div className="category-card men">
            <div className="category-content">
              <h3>Men's Fashion</h3>
              <p>Elevate your everyday look with modern tailoring.</p>
              <Link to="/products?category=Men" className="btn btn-secondary">Explore Men</Link>
            </div>
          </div>
          <div className="category-card women">
            <div className="category-content">
              <h3>Women's Fashion</h3>
              <p>Elegance in every thread and silhouette.</p>
              <Link to="/products?category=Women" className="btn btn-secondary">Explore Women</Link>
            </div>
          </div>
          <div className="category-card kids">
            <div className="category-content">
              <h3>Kids Collection</h3>
              <p>Style for the little fashion pioneers.</p>
              <Link to="/products?category=Kids" className="btn btn-secondary">Explore Kids</Link>
            </div>
          </div>
          <div className="category-card accessories">
            <div className="category-content">
              <h3>Accessories</h3>
              <p>The perfect finishing luxury touch.</p>
              <Link to="/products?category=Accessories" className="btn btn-secondary">Explore Accessories</Link>
            </div>
          </div>
        </div>
      </section>

      <Carousel />

      {/* Trending Products */}
      <section className="container trending-section">
        <div className="section-title-wrap text-center">
          <span className="sub-tag"><Flame size={16} /> POPULAR SELECTIONS</span>
          <h2>Trending Now</h2>
        </div>
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
      <section className="container offers-section">
        <div className="section-title-wrap text-center">
          <span className="sub-tag">SPECIAL CURATIONS</span>
          <h2>Exclusive Retail Offers</h2>
        </div>
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

      {/* Verified Reviews Section */}
      <section className="testimonials-section container">
        <h2 className="text-center">Loved by Fashion Aficionados</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p>"Renting Sabyasachi bridal couture for my reception was seamless! The security deposit was returned within 24 hours of item pickup."</p>
            <div className="author-info">
              <strong>Ananya Sharma</strong>
              <span>Verified Bride Renter</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p>"The AI Stylist matched my tuxedo with gold cuff links effortlessly. Received so many compliments at the Bombay Gala!"</p>
            <div className="author-info">
              <strong>Rohan Mehta</strong>
              <span>Verified Customer</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p>"Unmatched quality, authentic luxury packaging, and prompt customer support. LUXORA is our family's go-to for high fashion."</p>
            <div className="author-info">
              <strong>Priya Kapoor</strong>
              <span>VIP Member</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="features-section">
        <div className="container grid grid-cols-4 text-center">
          <div className="feature-item">
            <Truck size={38} className="feature-icon" />
            <h4>Express Free Shipping</h4>
            <p>On all orders above ₹999</p>
          </div>
          <div className="feature-item">
            <ShieldCheck size={38} className="feature-icon" />
            <h4>Secure Payments</h4>
            <p>100% Encrypted & PCI Compliant</p>
          </div>
          <div className="feature-item">
            <RefreshCcw size={38} className="feature-icon" />
            <h4>Easy Doorstep Returns</h4>
            <p>Simple 30-day return policy</p>
          </div>
          <div className="feature-item">
            <Star size={38} className="feature-icon" />
            <h4>Couture Quality</h4>
            <p>Hand-picked designer outfits</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container text-center newsletter-content">
          <h2>Join the LUXORA VIP Closet</h2>
          <p>Subscribe for private rental drops, fashion runway updates & an exclusive 15% discount code on your first retail purchase.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* AI Stylist Modal */}
      <AiStylistModal isOpen={isAiStylistOpen} onClose={() => setIsAiStylistOpen(false)} />
    </div>
  );
};

export default Home;
