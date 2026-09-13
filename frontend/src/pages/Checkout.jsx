import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Address State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else if (user.address) {
      setStreet(user.address.street || '');
      setCity(user.address.city || '');
      setPostalCode(user.address.postalCode || '');
      setCountry(user.address.country || '');
    }
  }, [user, navigate]);

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 999 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Optionally save the address back to profile if user wants (we'll just do it automatically here for convenience)
      await updateProfile({
        name: user.name,
        address: { street, city, postalCode, country }
      });

      // 2. Simulate Payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Clear cart and show success
      if (clearCart) clearCart();
      setOrderPlaced(true);
      setLoading(false);
      
    } catch (error) {
      console.error("Failed to place order", error);
      alert("Failed to process payment. Please try again.");
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh' }}>
        <CheckCircle2 size={64} color="var(--primary-color)" className="mb-4 mx-auto" />
        <h1 className="mb-2" style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem' }}>Order Confirmed</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your luxury items will be shipped soon.</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Secure Checkout</h1>
          <p>Complete your purchase securely.</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          
          {/* Left Column: Address & Details */}
          <div className="checkout-left">
            <div className="checkout-section">
              <h3><MapPin size={22} /> Delivery Address</h3>
              <div className="checkout-form">
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={street} 
                    onChange={(e) => setStreet(e.target.value)} 
                    placeholder="123 Luxury Avenue"
                    required
                  />
                </div>
                
                <div className="address-grid">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      placeholder="Paris"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={postalCode} 
                      onChange={(e) => setPostalCode(e.target.value)} 
                      placeholder="75008"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    placeholder="France"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h3><CreditCard size={22} /> Payment Method</h3>
              
              <div className="payment-methods">
                <div 
                  className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  Credit Card
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  PayPal
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div>
                  <div className="credit-card-ui">
                    <div className="card-chip"></div>
                    <div className="card-number">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-details">
                      <div>
                        <span>Cardholder Name</span>
                        {user ? user.name : 'LUXORA ATELIER'}
                      </div>
                      <div>
                        <span>Expires</span>
                        {expiry || 'MM/YY'}
                      </div>
                    </div>
                  </div>

                  <div className="checkout-form">
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)} 
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        required
                      />
                    </div>
                    <div className="address-grid">
                      <div className="form-group">
                        <label className="form-label">Expiration Date</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={expiry} 
                          onChange={(e) => setExpiry(e.target.value)} 
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVC</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={cvc} 
                          onChange={(e) => setCvc(e.target.value)} 
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === 'paypal' && (
                <div className="p-4 text-center border rounded">
                  <p>You will be redirected to PayPal to complete your purchase securely.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="checkout-right">
            <div className="checkout-section">
              <h3>Order Summary</h3>
              
              <div className="order-summary-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span className="summary-item-name">{item.qty}x {item.name}</span>
                    <span className="summary-item-price">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="row">
                  <span>Estimated Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="row grand-total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Processing Securely...' : <><Lock size={18}/> Place Order - ₹{total.toFixed(2)}</>}
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Checkout;
