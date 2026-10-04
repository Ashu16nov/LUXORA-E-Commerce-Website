import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
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
  Heart,
  Tag,
  Clock,
  Compass,
  Zap,
  ShoppingBag
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [genZProducts, setGenZProducts] = useState([]);
  const [productTab, setProductTab] = useState('trending'); // 'trending' | 'offers'
  const [allRentals, setAllRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [activeRentalCategory, setActiveRentalCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const productsList = Array.isArray(data) ? data : data.products || [];

        // Filter trending products
        const trending = productsList.filter((p) => p.trending);
        setTrendingProducts(trending.length > 0 ? trending.slice(0, 8) : productsList.slice(0, 8));

        // Filter products with offers
        const offers = productsList.filter((p) => p.offer);
        setOfferProducts(offers.length > 0 ? offers.slice(0, 8) : productsList.slice(0, 8));

        // Filter Gen Z fancy products
        const genZ = productsList.filter((p) => p.subCategory === 'GenZ' || p.genZ);
        setGenZProducts(genZ.length > 0 ? genZ.slice(0, 8) : productsList.slice(0, 8));

        // Fetch rental products
        const rentalRes = await axios.get('http://localhost:5000/api/rentals/products');
        const rentalList = Array.isArray(rentalRes.data) ? rentalRes.data : [];
        setAllRentals(rentalList);
        setFilteredRentals(rentalList.slice(0, 5));

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
      setFilteredRentals(allRentals.slice(0, 5));
    } else {
      const filtered = allRentals.filter((r) =>
        r.category.toLowerCase().includes(cat.toLowerCase())
      );
      setFilteredRentals(filtered.slice(0, 5));
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      addToast(
        `Thank you for subscribing! Your 15% VIP discount code has been sent to ${newsletterEmail}.`,
        'success',
        'VIP Access Granted'
      );
      setNewsletterEmail('');
    }
  };

  return (
    <div className="home-wrapper">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-backdrop-glow"></div>
        <div className="container hero-content">
          <div className="hero-badge-wrap">
            <span className="hero-gold-badge">
              <Sparkles size={14} className="sparkle-pulse" /> AUTUMN / WINTER 2026 COUTURE EDIT
            </span>
          </div>
          <h1>Redefining Luxury Fashion & Designer Rentals</h1>
          <p className="hero-description">
            Experience the pinnacle of high fashion. Rent authentic Sabyasachi, Manish Malhotra & Rolex timepieces at <strong>1/10th of retail price</strong> or acquire bespoke retail collections.
          </p>

          <div className="hero-buttons">
            <Link to="/rentals" className="btn btn-gold btn-hero-primary">
              <Sparkles size={18} /> Explore Designer Rentals
            </Link>
            <Link to="/products?category=Women" className="btn btn-outline-light btn-hero-secondary">
              Shop Women's Couture
            </Link>
            <Link to="/products?category=Men" className="btn btn-outline-light btn-hero-secondary">
              Shop Men's Closet
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="hero-stats-bar">
            <div className="stat-box">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">VIP Clients Served</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Authentic Couture</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-number">1/10th</span>
              <span className="stat-label">Rental vs Retail Price</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-number">24 Hours</span>
              <span className="stat-label">Deposit Refund Credit</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & VALUE PROPOSITION BANNER */}
      <section className="features-strip-section">
        <div className="container features-strip-grid">
          <div className="strip-item">
            <Truck size={28} className="strip-icon" />
            <div>
              <h4>Express Doorstep Delivery</h4>
              <p>Complimentary shipping on orders over ₹999</p>
            </div>
          </div>
          <div className="strip-item">
            <ShieldCheck size={28} className="strip-icon" />
            <div>
              <h4>100% Authentic Guarantee</h4>
              <p>Directly sourced from verified fashion houses</p>
            </div>
          </div>
          <div className="strip-item">
            <RefreshCcw size={28} className="strip-icon" />
            <div>
              <h4>Steam-Sanitized & Ready</h4>
              <p>Hygienically dry-cleaned before every dispatch</p>
            </div>
          </div>
          <div className="strip-item">
            <Award size={28} className="strip-icon" />
            <div>
              <h4>Refundable Security Deposit</h4>
              <p>Instant deposit credit back within 24 hours</p>
            </div>
          </div>
        </div>
      </section>



      {/* 4. CURATED CATEGORIES SECTION */}
      <section className="container categories-section">
        <div className="section-title-wrap text-center">
          <span className="sub-tag"><Compass size={16} /> DISCOVER BY CATEGORY</span>
          <h2 className="section-heading">Curated Luxury Closets</h2>
          <p className="section-subtitle">Explore hand-picked designer apparel and accessories for every occasion</p>
        </div>

        <div className="categories-grid-4">
          <Link to="/products?category=Women" className="category-card women">
            <div className="category-content">
              <span className="category-count-badge">140+ Couture Items</span>
              <h3>Women's Collection</h3>
              <p>Bridal lehengas, silk sarees & evening gowns</p>
              <span className="category-link-text">Explore Women <ArrowRight size={14} /></span>
            </div>
          </Link>

          <Link to="/products?category=Men" className="category-card men">
            <div className="category-content">
              <span className="category-count-badge">95+ Tuxedos & Suits</span>
              <h3>Men's Collection</h3>
              <p>Bespoke sherwanis, tuxedos & sharp blazers</p>
              <span className="category-link-text">Explore Men <ArrowRight size={14} /></span>
            </div>
          </Link>

          <Link to="/products?category=Kids" className="category-card kids">
            <div className="category-content">
              <span className="category-count-badge">45+ Kids Outfits</span>
              <h3>Kids Collection</h3>
              <p>Charming festive wear for young pioneers</p>
              <span className="category-link-text">Explore Kids <ArrowRight size={14} /></span>
            </div>
          </Link>

          <Link to="/products?category=Accessories" className="category-card accessories">
            <div className="category-content">
              <span className="category-count-badge">80+ Luxury Accents</span>
              <h3>Luxury Accessories</h3>
              <p>Statement timepieces, clutch bags & gold jewelry</p>
              <span className="category-link-text">Explore Accessories <ArrowRight size={14} /></span>
            </div>
          </Link>
        </div>
      </section>



      {/* 5. LUXORA CLOTH RENTAL SHOWCASE */}
      <section className="home-rental-showcase-section">
        <div className="container">
          <div className="rental-showcase-header">
            <span className="gold-pill-badge">
              <Sparkles size={14} /> LUXORA CLOSET RENTAL MODULE
            </span>
            <h2>Designer Rentals Showcase</h2>
            <p className="showcase-subtitle">
              Why spend lakhs purchasing bridal wear or gala tuxedos for a single day? Rent authentic designer fashion at <strong>1/10th of retail price</strong> with flexible durations, 100% refundable deposits, and free doorstep returns.
            </p>

            <div className="rental-feature-pills-row">
              <div className="feature-pill"><Calendar size={15} /> 3 to 30 Day Rentals</div>
              <div className="feature-pill"><ShieldCheck size={15} /> Refundable Deposit Guarantee</div>
              <div className="feature-pill"><Zap size={15} /> Instant Stock Availability</div>
              <div className="feature-pill"><RotateCcw size={15} /> Free Pickup Returns</div>
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

          <div className="home-rental-grid-5">
            {filteredRentals.slice(0, 5).map((item) => (
              <div key={item._id} className="home-rental-card-enhanced">
                <div className="home-rental-img-wrap">
                  <Link to={`/rentals/${item._id}`} style={{display: 'block', height: '100%'}}>
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80"; }} 
                    />
                  </Link>
                  <span className="stock-tag"><Zap size={12} /> 3 Units Left</span>
                  <span className="category-tag">{item.category}</span>
                  <button
                    className={`rental-wish-btn ${isInWishlist(item._id) ? 'active' : ''}`}
                    onClick={() => {
                      toggleWishlist(item);
                      addToast(
                        isInWishlist(item._id)
                          ? `Removed from Wishlist`
                          : `Saved ${item.name} to Wishlist!`,
                        'info'
                      );
                    }}
                    title="Wishlist"
                  >
                    <Heart
                      size={16}
                      fill={isInWishlist(item._id) ? '#e11d48' : 'none'}
                      color={isInWishlist(item._id) ? '#e11d48' : '#fff'}
                    />
                  </button>
                </div>

                <div className="home-rental-card-body">
                  <div className="card-brand-row">
                    <span className="brand-name">{item.brand}</span>
                    <span className="rating-pill">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating || 4.9}
                    </span>
                  </div>

                  <h3 className="card-item-name">{item.name}</h3>

                  <div className="price-simple-row mb-3">
                    <span className="price-amount" style={{fontWeight: '800', fontSize: '1.1rem', color: '#1B1917'}}>{formatPrice(item.dailyRate)} <small style={{fontSize: '0.75rem', fontWeight: '500', color: '#64748B'}}>/ day</small></span>
                  </div>

                  <div className="rental-card-btn-group mt-auto">
                    <Link to={`/rentals/${item._id}`} className="btn-rent-card-action">
                      <Calendar size={15} /> Rent Now
                    </Link>
                    <button
                      className="btn-rent-quickview"
                      onClick={() => setQuickViewProduct(item)}
                      title="Quick View"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="home-rental-bottom-cta">
            <Link to="/rentals" className="btn-explore-full-closet">
              Browse Full Luxury Rental Collection (18+ Items) <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TABBED RETAIL PRODUCTS (TRENDING & SPECIAL OFFERS) */}
      <section className="container catalog-toggle-section">
        <div className="catalog-header-flex">
          <div>
            <span className="sub-tag"><Flame size={16} /> LUXORA RETAIL SELECTIONS</span>
            <h2 className="section-heading mb-0">Designer Retail Closet</h2>
          </div>

          <div className="catalog-tab-switchers">
            <button
              className={`catalog-tab-btn ${productTab === 'trending' ? 'active' : ''}`}
              onClick={() => setProductTab('trending')}
            >
              <Flame size={16} /> Trending Now ({trendingProducts.length})
            </button>
            <button
              className={`catalog-tab-btn ${productTab === 'offers' ? 'active' : ''}`}
              onClick={() => setProductTab('offers')}
            >
              <Tag size={16} /> Special Offers ({offerProducts.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="grid grid-cols-5">
            {(productTab === 'trending' ? trendingProducts : offerProducts).slice(0, 5).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>


      {/* 8. VERIFIED REVIEWS & TESTIMONIALS */}
      <section className="testimonials-section container">
        <div className="section-title-wrap text-center">
          <span className="sub-tag"><Star size={16} /> VIP FEEDBACK</span>
          <h2>Loved by Fashion Aficionados</h2>
          <p className="section-subtitle">Real experiences from our rental and retail patrons</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p>
              "Renting Sabyasachi bridal couture for my reception was seamless! The outfit arrived steam-sanitized, and the security deposit was credited back within 24 hours of pickup."
            </p>
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
            <p>
              "The AI Stylist matched my tuxedo with gold cuff links effortlessly. Received so many compliments at the Bombay Gala!"
            </p>
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
            <p>
              "Unmatched quality, authentic luxury packaging, and prompt customer support. LUXORA is our family's primary destination for high-end fashion."
            </p>
            <div className="author-info">
              <strong>Priya Kapoor</strong>
              <span>VIP Member</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. VIP NEWSLETTER & CLUB ACCESS */}
      <section className="newsletter-section">
        <div className="container text-center newsletter-content">
          <span className="gold-pill-badge mb-3">
            <Sparkles size={14} /> LUXORA VIP CLUB ACCESS
          </span>
          <h2>Join the LUXORA VIP Closet</h2>
          <p>
            Subscribe for private rental drop notifications, seasonal runway releases, and an exclusive <strong>15% VIP discount code</strong> for your next retail purchase.
          </p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-gold">
              Subscribe & Claim 15% OFF
            </button>
          </form>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}


    </div>
  );
};

export default Home;

