import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ShieldCheck, Sparkles, Filter, Search, RotateCcw, Clock, Star, Award, Layers, Heart, Eye } from 'lucide-react';
import { CurrencyContext } from '../context/CurrencyContext';
import { WishlistContext } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';
import QuickViewModal from '../components/QuickViewModal';
import './RentalProducts.css';

const RentalProducts = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [quickViewItem, setQuickViewItem] = useState(null);

  const { formatPrice } = useContext(CurrencyContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (gender) params.append('gender', gender);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);

      const { data } = await axios.get(`http://localhost:5000/api/rentals/products?${params.toString()}`);
      setRentals(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rental products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [category, gender, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRentals();
  };

  return (
    <div className="rental-page">
      {/* Luxury Rental Banner */}
      <section className="rental-hero">
        <div className="rental-hero-content container">
          <div className="rental-hero-badge">
            <Sparkles size={16} /> LUXORA CLOSET RENTAL MODULE
          </div>
          <h1>Rent High Fashion, Pay a Fraction</h1>
          <p>
            Experience pure luxury without commitment. Rent designer tuxedos, bridal lehengas, silk sarees, gala gowns & Rolex timepieces starting from <strong>{formatPrice(699)} / day</strong>.
          </p>
          <div className="rental-features-bar">
            <div className="rental-feature-tag"><ShieldCheck size={18} /> 100% Refundable Security Deposit</div>
            <div className="rental-feature-tag"><RotateCcw size={18} /> Free Doorstep Return Pickup</div>
            <div className="rental-feature-tag"><Clock size={18} /> 3 Inventory Units Kept for Express Renting</div>
            <div className="rental-feature-tag"><Award size={18} /> Steam Sterilized & Sanitized</div>
          </div>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <div className="container rental-toolbar-container">
        <div className="rental-category-tabs">
          <button className={`tab-btn ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>All Collections</button>
          <button className={`tab-btn ${category === 'Wedding' ? 'active' : ''}`} onClick={() => setCategory('Wedding')}>Wedding Couture</button>
          <button className={`tab-btn ${category === 'Gala' ? 'active' : ''}`} onClick={() => setCategory('Gala')}>Gala & Evening</button>
          <button className={`tab-btn ${category === 'Suit' ? 'active' : ''}`} onClick={() => setCategory('Suit')}>Luxury Suits</button>
          <button className={`tab-btn ${category === 'Ethnic' ? 'active' : ''}`} onClick={() => setCategory('Ethnic')}>Festival & Ethnic</button>
          <button className={`tab-btn ${category === 'Accessories' ? 'active' : ''}`} onClick={() => setCategory('Accessories')}>Jewelry & Watches</button>
        </div>

        <form onSubmit={handleSearchSubmit} className="rental-search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search rental outfits, brands, fabrics..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="container rental-filters-row">
        <div className="filter-group">
          <Filter size={16} />
          <span>Target Gender:</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="filter-group">
          <span>Sort Collection By:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Featured First</option>
            <option value="rate_asc">Daily Rate: Low to High</option>
            <option value="rate_desc">Daily Rate: High to Low</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>
      </div>

      {/* Rental Grid */}
      <div className="container rental-grid-section">
        {loading ? (
          <div className="rental-loader">
            <div className="spinner"></div>
            <p>Loading Luxora Luxury Rental Wardrobe...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="no-rentals-card">
            <h3>No rental garments found</h3>
            <p>Try adjusting your category filters or search terms.</p>
            <button onClick={() => { setCategory(''); setGender(''); setSearch(''); setSort(''); }} className="btn-reset">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="rental-grid">
            {rentals.map((item) => (
              <div key={item._id} className="rental-card">
                <div className="rental-card-image-wrapper">
                  <Link to={`/rentals/${item._id}`} style={{display: 'block', height: '100%'}}>
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80"; }}
                    />
                  </Link>
                  <span className="rental-stock-badge">
                    ⚡ {item.stockUnits || 3} Units Available
                  </span>
                  <span className="rental-category-badge">{item.category}</span>
                  
                  <button
                    className={`rental-card-heart ${isInWishlist(item._id) ? 'active' : ''}`}
                    onClick={() => {
                      toggleWishlist(item);
                      addToast(isInWishlist(item._id) ? `Removed from Wishlist` : `Saved "${item.name}" to Wishlist!`, 'info');
                    }}
                    title="Wishlist outfit"
                  >
                    <Heart size={16} fill={isInWishlist(item._id) ? '#e11d48' : 'none'} color={isInWishlist(item._id) ? '#e11d48' : '#fff'} />
                  </button>
                </div>
                
                <div className="rental-card-info">
                  <div className="card-top-row">
                    <span className="rental-card-brand">{item.brand}</span>
                    <span className="rating-badge"><Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating || 4.9}</span>
                  </div>

                  <h3 className="rental-card-title">{item.name}</h3>

                  <div className="price-simple-row mb-3" style={{marginTop: '0.5rem', marginBottom: '1rem'}}>
                    <span className="price-amount" style={{fontWeight: '800', fontSize: '1.1rem', color: '#1B1917'}}>{formatPrice(item.dailyRate)} <small style={{fontSize: '0.75rem', fontWeight: '500', color: '#64748B'}}>/ day</small></span>
                  </div>

                  <div className="rental-card-actions mt-auto" style={{marginTop: 'auto'}}>
                    <Link to={`/rentals/${item._id}`} className="btn-rent-details" style={{flex: 1}}>
                      <Calendar size={16} /> Rent Now
                    </Link>
                    <button className="btn-rent-qv" onClick={() => setQuickViewItem(item)} title="Quick View">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {quickViewItem && (
        <QuickViewModal product={quickViewItem} onClose={() => setQuickViewItem(null)} />
      )}
    </div>
  );
};

export default RentalProducts;
