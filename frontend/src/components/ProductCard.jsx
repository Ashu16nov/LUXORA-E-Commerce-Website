import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size';

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.offer && <span className="product-badge">Sale</span>}
        <button className="product-wishlist"><Heart size={18} /></button>
        <Link to={`/product/${product._id}`}>
          <img src={product.images[0]} alt={product.name} className="product-image" />
        </Link>
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-price">
          <span>₹{product.price}</span>
          {product.originalPrice && (
            <span className="product-original-price">₹{product.originalPrice}</span>
          )}
          {product.discount && (
            <span className="product-discount">{product.discount}% OFF</span>
          )}
        </div>
        <button 
          className="btn btn-secondary mt-2" 
          style={{ width: '100%', marginTop: '1rem', fontSize: '0.8rem', padding: '0.5rem' }}
          onClick={() => addToCart(product, 1, defaultSize)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
