import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.18; // 18% tax
  const shipping = subtotal > 999 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=cart');
    } else {
      alert('Proceeding to checkout (Simulated)');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty mt-5 text-center">
        <h2>Your cart is looking a little empty.</h2>
        <Link to="/products" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page mt-4">
      <h1>Shopping Cart</h1>
      
      <div className="cart-grid mt-3">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.product}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <p className="cart-item-brand">{item.brand}</p>
                <Link to={`/product/${item.product}`}><h3>{item.name}</h3></Link>
                <p>Size: {item.size}</p>
                <p className="cart-item-price">₹{item.price}</p>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQty(item.product, item.size, item.qty > 1 ? item.qty - 1 : 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.product, item.size, item.qty + 1)}>+</button>
              </div>
              <button className="cart-remove-btn" onClick={() => removeFromCart(item.product, item.size)}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row mt-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row">
            <span>Tax (18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <hr className="mt-2 mb-2" style={{ borderColor: 'var(--border-color)' }} />
          <div className="summary-row total">
            <span>Grand Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary mt-3 w-100" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
