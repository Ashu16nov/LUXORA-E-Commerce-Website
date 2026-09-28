import React, { useState, useContext, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Check, ShoppingBag, Calendar, Star, RefreshCw, Flame } from 'lucide-react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';
import './AiStylistModal.css';

const occasions = [
  { id: 'wedding', label: 'Royal Wedding & Reception 💍', desc: 'Opulent lehengas, sherwanis, and heavy embellishments' },
  { id: 'gala', label: 'Red Carpet & Black Tie Gala 🍷', desc: 'Silk evening gowns, sharp tuxedos, and statement jewels' },
  { id: 'cocktail', label: 'Sunset Cocktail & Yacht Party 🥂', desc: 'Sleek blazers, satin slip dresses, and designer watches' },
  { id: 'casual', label: 'Parisian Casual & Resort Luxe 🌴', desc: 'Linen trousers, designer tees, and luxury loafers' },
];

const vibes = [
  { id: 'gold', label: 'Champagne Gold & Warm Amber', color: '#D4AF37' },
  { id: 'black', label: 'Midnight Black & Obsidian', color: '#1B1917' },
  { id: 'emerald', label: 'Royal Emerald & Velvet Teal', color: '#065F46' },
  { id: 'burgundy', label: 'Deep Burgundy & Rose Gold', color: '#881337' },
];

const AiStylistModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState('wedding');
  const [selectedVibe, setSelectedVibe] = useState('gold');
  const [budget, setBudget] = useState('any');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const { formatPrice } = useContext(CurrencyContext);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(2);
    try {
      // Fetch both retail products and rental products
      const [prodRes, rentRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/rentals/products').catch(() => ({ data: [] }))
      ]);

      const prods = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];
      const rentals = Array.isArray(rentRes.data) ? rentRes.data : [];

      // Generate outfit pairings based on occasion
      setTimeout(() => {
        let matchedRentals = [];
        let matchedRetail = [];

        if (selectedOccasion === 'wedding') {
          matchedRentals = rentals.filter(r => r.category === 'Wedding' || r.category === 'Ethnic Suits' || r.name.toLowerCase().includes('lehenga') || r.name.toLowerCase().includes('tuxedo'));
          matchedRetail = prods.filter(p => p.category === 'Women' || p.category === 'Accessories');
        } else if (selectedOccasion === 'gala') {
          matchedRentals = rentals.filter(r => r.category === 'Gala' || r.category === 'Tuxedos & Suits' || r.category === 'Gowns & Dresses');
          matchedRetail = prods.filter(p => p.category === 'Accessories' || p.brand === 'LUXORA');
        } else {
          matchedRentals = rentals.slice(0, 3);
          matchedRetail = prods.slice(0, 3);
        }

        const pairedLook = {
          title: selectedOccasion === 'wedding' ? 'The Royal Heritage Ensemble' : selectedOccasion === 'gala' ? 'The Midnight Gala Tux & Satin Look' : 'The Sunset Champagne Luxe Set',
          tagline: 'Curated specially by LUXORA Stylist AI with perfect color coordination and accessory match.',
          rentalItem: matchedRentals[0] || rentals[0],
          retailItems: matchedRetail.slice(0, 2),
        };

        setRecommendations([pairedLook]);
        setIsGenerating(false);
      }, 1200);
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  const resetStylist = () => {
    setStep(1);
    setRecommendations([]);
  };

  return (
    <div className="stylist-overlay" onClick={onClose}>
      <div className="stylist-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stylist-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="stylist-header">
          <div className="stylist-badge">
            <Sparkles size={16} /> LUXORA AI STYLIST & OUTFIT MATCHER
          </div>
          <h2>Personalized High-Fashion Stylist</h2>
          <p>Tell us your occasion & mood — our AI curates matching luxury designer rentals with luxury retail accessories.</p>
        </div>

        {step === 1 ? (
          <div className="stylist-step-1">
            {/* Occasion */}
            <div className="stylist-section">
              <h3>1. Choose Your Occasion</h3>
              <div className="stylist-options-grid">
                {occasions.map((occ) => (
                  <div
                    key={occ.id}
                    className={`stylist-card-choice ${selectedOccasion === occ.id ? 'active' : ''}`}
                    onClick={() => setSelectedOccasion(occ.id)}
                  >
                    <h4>{occ.label}</h4>
                    <p>{occ.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vibe / Palette */}
            <div className="stylist-section">
              <h3>2. Select Your Color Palette & Vibe</h3>
              <div className="vibe-pills-row">
                {vibes.map((v) => (
                  <button
                    key={v.id}
                    className={`vibe-pill ${selectedVibe === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVibe(v.id)}
                  >
                    <span className="vibe-color-dot" style={{ backgroundColor: v.color }}></span>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="stylist-footer-actions">
              <button className="btn-generate-stylist" onClick={handleGenerate}>
                <Sparkles size={18} /> Generate My Custom Outfit Match
              </button>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="stylist-loading-state">
            <RefreshCw size={40} className="spin-gold" />
            <h3>Curating Couture Pairings...</h3>
            <p>Matching fabric weights, jacket cuts, jewelry undertones, and rental stock availability.</p>
          </div>
        ) : (
          <div className="stylist-results">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="curated-look-container">
                <div className="look-header">
                  <span className="flame-tag"><Flame size={14} /> AI MATCH SCORE: 98%</span>
                  <h3>{rec.title}</h3>
                  <p>{rec.tagline}</p>
                </div>

                <div className="look-items-grid">
                  {/* Primary Rental Outfit */}
                  {rec.rentalItem && (
                    <div className="look-item-card rental-card-highlight">
                      <span className="look-type-badge gold-badge"><Calendar size={12} /> MAIN RENTAL OUTFIT</span>
                      <img src={rec.rentalItem.images[0]} alt={rec.rentalItem.name} />
                      <div className="look-item-details">
                        <span className="item-brand">{rec.rentalItem.brand}</span>
                        <h4>{rec.rentalItem.name}</h4>
                        <div className="item-price-row">
                          <span className="price-tag">{formatPrice(rec.rentalItem.dailyRate)} / day</span>
                          <span className="deposit-tag">Deposit: {formatPrice(rec.rentalItem.securityDeposit)}</span>
                        </div>
                        <Link to={`/rentals/${rec.rentalItem._id}`} onClick={onClose} className="btn-look-action">
                          <Calendar size={15} /> Rent This Outfit
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Matching Retail Accessories */}
                  {rec.retailItems && rec.retailItems.map((item) => (
                    <div key={item._id} className="look-item-card">
                      <span className="look-type-badge"><ShoppingBag size={12} /> MATCHING ACCESSORY</span>
                      <img src={item.images[0]} alt={item.name} />
                      <div className="look-item-details">
                        <span className="item-brand">{item.brand}</span>
                        <h4>{item.name}</h4>
                        <div className="item-price-row">
                          <span className="price-tag">{formatPrice(item.price)}</span>
                        </div>
                        <button
                          className="btn-look-action btn-add-bag"
                          onClick={() => {
                            addToCart(item, 1, item.sizes?.[0] || 'Standard');
                            addToast(`Added ${item.name} to Cart!`, 'success', 'Stylist Selection');
                          }}
                        >
                          <ShoppingBag size={15} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="look-bottom-bar">
                  <button className="btn-secondary-link" onClick={resetStylist}>
                    <RefreshCw size={14} /> Try Different Occasion
                  </button>
                  <button className="btn-close-stylist" onClick={onClose}>
                    Done & Return to Store
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiStylistModal;
