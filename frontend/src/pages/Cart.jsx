import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { ToastContext } from '../context/ToastContext';
import { Trash2, Tag, ShoppingBag, ShieldCheck, ArrowRight, Gift, Sparkles } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponName, setAppliedCouponName] = useState('');
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).toUpperCase().trim();
    if (!code) return;

    if (code === 'LUXORA20') {
      const discount = subtotal * 0.20;
      setAppliedDiscount(discount);
      setAppliedCouponName('LUXORA20 (20% OFF)');
      addToast('Coupon LUXORA20 applied! 20% Discount active.', 'success', 'Promo Applied');
    } else if (code === 'FIRSTLUXE') {
      const discount = Math.min(500, subtotal);
      setAppliedDiscount(discount);
      setAppliedCouponName('FIRSTLUXE (₹500 OFF)');
      addToast('Coupon FIRSTLUXE applied! ₹500 Discount active.', 'success', 'Promo Applied');
    } else {
      addToast('Invalid coupon code. Try LUXORA20 or FIRSTLUXE', 'error');
    }
  };

  const giftWrapFee = includeGiftWrap ? 99 : 0;
  const discountedSubtotal = Math.max(0, subtotal - appliedDiscount);
  const tax = discountedSubtotal * 0.18; // 18% tax
  const shipping = subtotal > 999 ? 0 : 100;
  const total = discountedSubtotal + tax + shipping + giftWrapFee;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty mt-5 text-center">
        <div className="empty-cart-icon">
          <ShoppingBag size={56} />
        </div>
        <h2>Your Shopping Bag is Currently Empty</h2>
        <p>Explore our latest couture collections or discover luxury outfit rentals.</p>
        <div className="empty-cart-actions">
          <Link to="/products" className="btn btn-primary">Browse Retail Shop</Link>
          <Link to="/rentals" className="btn btn-secondary">Explore Rentals 👑</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="cart-header">
        <h1>Shopping Bag ({cartItems.length} items)</h1>
        <Link to="/products" className="continue-link">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>

      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.product}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <span className="cart-item-brand">{item.brand || 'LUXORA'}</span>
                <Link to={`/product/${item.product}`}>
                  <h3>{item.name}</h3>
                </Link>
                <p className="size-tag">Size: <strong>{item.size}</strong></p>
                <p className="cart-item-price">{formatPrice(item.price)}</p>
              </div>

              <div className="qty-controls">
                <button onClick={() => updateQty(item.product, item.size, item.qty > 1 ? item.qty - 1 : 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.product, item.size, item.qty + 1)}>+</button>
              </div>

              <button
                className="cart-remove-btn"
                onClick={() => {
                  removeFromCart(item.product, item.size);
                  addToast(`Removed "${item.name}" from cart`, 'info');
                }}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {/* Gift Packaging Option */}
          <div className="gift-wrap-box">
            <label className="gift-wrap-label">
              <input
                type="checkbox"
                checked={includeGiftWrap}
                onChange={(e) => setIncludeGiftWrap(e.target.checked)}
              />
              <Gift size={20} className="gift-icon" />
              <div>
                <strong>Add Luxury Gift Packaging & Ribbon ({formatPrice(99)})</strong>
                <p>Includes bespoke signature velvet box, gold wax seal ribbon, and custom handwritten gift message.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          {/* Coupon Code Section */}
          <div className="coupon-section">
            <label>Promotional Code</label>
            <div className="coupon-input-wrap">
              <input
                type="text"
                placeholder="Enter LUXORA20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={() => handleApplyCoupon()}>Apply</button>
            </div>

            <div className="promo-chips-row">
              <span className="chip-label">Available Coupons:</span>
              <button className="promo-chip" onClick={() => handleApplyCoupon('LUXORA20')}>
                <Tag size={12} /> LUXORA20 (20% OFF)
              </button>
              <button className="promo-chip" onClick={() => handleApplyCoupon('FIRSTLUXE')}>
                <Tag size={12} /> FIRSTLUXE (₹500 OFF)
              </button>
            </div>

            {appliedDiscount > 0 && (
              <div className="applied-coupon-tag">
                <span><Sparkles size={14} /> Coupon Applied: <strong>{appliedCouponName}</strong></span>
                <button onClick={() => { setAppliedDiscount(0); setAppliedCouponName(''); }}>×</button>
              </div>
            )}
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {appliedDiscount > 0 && (
              <div className="summary-row discount-row">
                <span>Promo Discount</span>
                <span>-{formatPrice(appliedDiscount)}</span>
              </div>
            )}

            {includeGiftWrap && (
              <div className="summary-row">
                <span>Luxury Gift Box</span>
                <span>{formatPrice(99)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping Charge</span>
              <span>{shipping === 0 ? <strong className="free-tag">FREE</strong> : formatPrice(shipping)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax (18%)</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Grand Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button className="btn btn-primary btn-checkout-action" onClick={handleCheckout}>
            Proceed to Secure Checkout
          </button>

          <div className="cart-security-badge">
            <ShieldCheck size={16} /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
