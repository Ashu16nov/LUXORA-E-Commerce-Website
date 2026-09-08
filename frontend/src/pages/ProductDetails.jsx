import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSize(data.sizes[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loader"></div>;
  if (!product) return <div className="container text-center mt-4"><h2>Product not found</h2></div>;

  const handleAddToCart = () => {
    addToCart(product, qty, size || 'One Size');
    alert('Product added to cart!');
  };

  return (
    <div className="container product-details-page">
      <div className="product-details-grid">
        {/* Images */}
        <div className="product-gallery">
          <img src={product.images[0]} alt={product.name} className="main-image" />
        </div>
        
        {/* Info */}
        <div className="product-info-details">
          <p className="brand-name">{product.brand}</p>
          <h1>{product.name}</h1>
          
          <div className="rating-wrap flex items-center gap-2">
            <div className="stars flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} fill={s <= product.rating ? "var(--primary-color)" : "none"} color="var(--primary-color)" />
              ))}
            </div>
            <span>({product.numReviews} Reviews)</span>
          </div>
          
          <div className="price-wrap mt-2">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
            {product.discount && <span className="discount-tag">{product.discount}% OFF</span>}
          </div>
          
          <p className="description mt-2">{product.description}</p>
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selector mt-3">
              <h4>Select Size</h4>
              <div className="sizes flex gap-2 mt-1">
                {product.sizes.map(s => (
                  <button 
                    key={s} 
                    className={`size-btn ${size === s ? 'active' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="qty-selector mt-3">
            <h4>Quantity</h4>
            <div className="qty-controls mt-1">
              <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty < product.stock ? qty + 1 : product.stock)}>+</button>
            </div>
          </div>
          
          <div className="action-buttons mt-4 flex gap-2">
            <button className="btn btn-primary flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="btn btn-secondary flex-1">Wishlist</button>
          </div>

          <div className="additional-info mt-4">
            <p><strong>Category:</strong> {product.category} {'>'} {product.subCategory}</p>
            <p><strong>Stock:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          </div>
        </div>
      </div>

      <div className="reviews-section mt-5">
        <h2>Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="reviews-list mt-3">
            {product.reviews.map(review => (
              <div key={review._id} className="review-item">
                <strong>{review.name}</strong>
                <div className="stars flex mt-1 mb-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={12} fill={s <= review.rating ? "var(--primary-color)" : "none"} color="var(--primary-color)" />
                  ))}
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
