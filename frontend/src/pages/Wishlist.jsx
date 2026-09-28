import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { CurrencyContext } from '../context/CurrencyContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const { formatPrice } = useContext(CurrencyContext);

  const handleMoveToCart = (product) => {
    addToCart(product, 1, product.sizes?.[0] || 'Standard');
    removeFromWishlist(product._id);
    addToast(`Moved "${product.name}" to Cart!`, 'success', 'Cart Updated');
  };

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header">
        <div>
          <Link to="/products" className="back-link">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
          <h1>My Saved Wishlist ❤️</h1>
          <p>Keep track of your favorite luxury pieces and rental outfits for future occasions.</p>
        </div>
        {wishlistItems.length > 0 && (
          <button className="btn-clear-wishlist" onClick={clearWishlist}>
            <Trash2 size={16} /> Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="heart-circle font-gold">
            <Heart size={48} />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>Explore our retail and luxury rental collections to save pieces you love.</p>
          <div className="empty-actions">
            <Link to="/products" className="btn btn-primary">Browse Shop</Link>
            <Link to="/rentals" className="btn btn-secondary">Explore Rentals 👑</Link>
          </div>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-card">
              <button
                className="wishlist-remove-btn"
                onClick={() => removeFromWishlist(item._id)}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>

              <div className="wishlist-img-wrap">
                <img src={item.images[0]} alt={item.name} />
                {item.dailyRate ? (
                  <span className="wl-badge gold">Rental Item</span>
                ) : (
                  <span className="wl-badge">{item.brand || 'LUXORA'}</span>
                )}
              </div>

              <div className="wishlist-body">
                <span className="wl-brand">{item.brand || 'LUXORA EXCLUSIVE'}</span>
                <h3>{item.name}</h3>

                <div className="wl-price-row">
                  <span className="wl-price">
                    {formatPrice(item.price || item.dailyRate)}
                    {item.dailyRate && <small>/day</small>}
                  </span>
                  {item.originalPrice && (
                    <span className="wl-original-price">{formatPrice(item.originalPrice)}</span>
                  )}
                </div>

                <div className="wl-actions">
                  {item.dailyRate ? (
                    <Link to={`/rentals/${item._id}`} className="btn-wl-action btn-wl-rent">
                      <Sparkles size={16} /> Rent Outfit Now
                    </Link>
                  ) : (
                    <button className="btn-wl-action" onClick={() => handleMoveToCart(item)}>
                      <ShoppingBag size={16} /> Move to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
