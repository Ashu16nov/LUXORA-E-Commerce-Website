import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { ToastContext } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, Lock, CheckCircle2, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Address State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else if (user.address) {
      setStreet(user.address.street || '');
      setCity(user.address.city || '');
      setPostalCode(user.address.postalCode || '');
      setCountry(user.address.country || 'India');
    }
  }, [user, navigate]);

  if (cartItems.length === 0 && !createdOrder) {
    navigate('/cart');
    return null;
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 999 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const itemExceedingLimit = cartItems.find((x) => x.qty > 3);
    if (itemExceedingLimit) {
      addToast(`Order cannot be processed. Maximum limit of 3 pieces allowed per item for "${itemExceedingLimit.name}".`, 'error', 'Limit Exceeded');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Update user address
      await updateProfile({
        name: user.name,
        address: { street, city, postalCode, country }
      });

      // 2. Prepare Order Payload for Backend
      const formattedItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product,
        size: item.size || 'Standard',
      }));

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const orderPayload = {
        orderItems: formattedItems,
        shippingAddress: { street, city, postalCode, country },
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const { data } = await axios.post('http://localhost:5000/api/orders', orderPayload, config);

      if (clearCart) clearCart();
      setCreatedOrder(data);
      setLoading(false);
      addToast('✨ Order Placed Successfully! Thank you for shopping with LUXORA.', 'success', 'Order Confirmed');
      
    } catch (error) {
      console.error('Failed to place order', error);
      addToast(error.response?.data?.message || 'Failed to process order. Please try again.', 'error');
      setLoading(false);
    }
  };

  if (createdOrder) {
    return (
      <div className="checkout-page container flex flex-col items-center justify-center text-center" style={{ minHeight: '65vh', paddingTop: '4rem' }}>
        <div className="success-icon-wrap" style={{ color: '#059669', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={72} />
        </div>
        <h1 className="mb-2" style={{ fontFamily: 'Playfair Display', fontSize: '2.8rem' }}>Order Confirmed!</h1>
        <p className="text-gray-600 mb-2" style={{ fontSize: '1.1rem' }}>
          Order ID: <strong>#{createdOrder._id?.substring(0, 10).toUpperCase()}</strong>
        </p>
        <p className="text-gray-600 mb-6" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
          Thank you for choosing LUXORA Haute Couture. A confirmation email and tracking link have been dispatched to <strong>{user.email}</strong>.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/myorders" className="btn btn-primary">
            Track My Order Status 📦
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Express Checkout</h1>
          <p>Provide your delivery information and payment details below.</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          
          {/* Left Column: Address & Details */}
          <div className="checkout-left">
            <div className="checkout-section">
              <h3><MapPin size={22} /> Shipping Address</h3>
              <div className="checkout-form">
                <div className="form-group">
                  <label className="form-label">Street Address / Apartment</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={street} 
                    onChange={(e) => setStreet(e.target.value)} 
                    placeholder="123 Luxury Boulevard, Penthouse 4B"
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
                      placeholder="Mumbai / Paris / New York"
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
                      placeholder="400001"
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
                    placeholder="India"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h3><CreditCard size={22} /> Payment Method</h3>
              
              <div className="payment-methods">
                <div 
                  className={`payment-method ${paymentMethod === 'Credit Card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Credit Card')}
                >
                  Credit / Debit Card
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'UPI' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  UPI / GPay
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  Cash on Delivery
                </div>
              </div>

              {paymentMethod === 'Credit Card' && (
                <div>
                  <div className="credit-card-ui">
                    <div className="card-chip"></div>
                    <div className="card-number">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-details">
                      <div>
                        <span>Cardholder Name</span>
                        {user ? user.name : 'LUXORA CLIENT'}
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
                        placeholder="4532 0000 0000 0000"
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
                        <label className="form-label">CVC Security Code</label>
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

              {paymentMethod === 'UPI' && (
                <div className="p-4 text-center border rounded" style={{ padding: '1.5rem', background: '#FFFDF9', borderRadius: '10px' }}>
                  <p>Scan QR code or enter your VPA / UPI ID during step-2 verification.</p>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-4 text-center border rounded" style={{ padding: '1.5rem', background: '#FFFDF9', borderRadius: '10px' }}>
                  <p>Pay cash or via UPI QR code upon doorstep delivery.</p>
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
                    <span className="summary-item-name">{item.qty}x {item.name} ({item.size})</span>
                    <span className="summary-item-price">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : formatPrice(shipping)}</span>
                </div>
                <div className="row">
                  <span>Estimated Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="row grand-total">
                  <span>Grand Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Processing Order...' : <><Lock size={18}/> Authorize & Place Order ({formatPrice(total)})</>}
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Checkout;
