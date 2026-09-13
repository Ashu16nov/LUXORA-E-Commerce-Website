import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Offers.css';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      let allProducts = [];
      try {
        // Fetch a few pages to get enough products for the offers page
        for(let i=1; i<=5; i++) {
          const res = await axios.get(`http://localhost:5000/api/products?page=${i}`);
          if (res.data.products && res.data.products.length > 0) {
            allProducts = [...allProducts, ...res.data.products];
          } else {
            break;
          }
        }
        
        // Remove duplicates just in case
        const uniqueProducts = Array.from(new Set(allProducts.map(a => a._id)))
         .map(id => {
           return allProducts.find(a => a._id === id)
         });
         
        setProducts(uniqueProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return <div className="loader"></div>;
  }

  // Filter products for different offer sections
  const clearanceDeals = products.filter(p => p.offer && (p.clearance || p.discount >= 50));
  const trendingDeals = products.filter(p => p.offer && p.trending);
  const under1500 = products.filter(p => p.price < 1500);

  return (
    <div className="offers-page container" style={{ padding: '2rem 1rem' }}>
      <h1 className="luxora-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Exclusive Offers</h1>
      
      {/* 50% OFF & CLEARANCE SECTION */}
      <section className="offer-section">
        <div className="offer-banner banner-clearance">
          <h2>Clearance Sale</h2>
          <p>Flat 50% Off & Above</p>
        </div>
        
        <div className="grid grid-cols-4">
          {clearanceDeals.length > 0 ? (
            clearanceDeals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-offers-msg">More clearance deals coming soon!</p>
          )}
        </div>
      </section>

      {/* TRENDING DEALS SECTION */}
      <section className="offer-section">
        <div className="offer-banner banner-trending">
          <h2>Trending Deals</h2>
          <p>Hottest items on discount right now</p>
        </div>
        
        <div className="grid grid-cols-4">
          {trendingDeals.length > 0 ? (
            trendingDeals.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-offers-msg">Check back later for trending offers.</p>
          )}
        </div>
      </section>

      {/* STEAL DEALS SECTION */}
      <section className="offer-section">
        <div className="offer-banner banner-steal">
          <h2>Steal Deals</h2>
          <p>Everything under ₹1500</p>
        </div>
        
        <div className="grid grid-cols-4">
          {under1500.length > 0 ? (
            under1500.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-offers-msg">No steal deals available at the moment.</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default Offers;
