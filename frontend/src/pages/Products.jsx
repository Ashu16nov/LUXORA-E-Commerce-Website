import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, X } from 'lucide-react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const category = queryParams.get('category') || '';
  const search = queryParams.get('search') || '';
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    sort: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [category, search, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/products?`;
      if (category) url += `category=${category}&`;
      if (search) url += `search=${search}&`;
      if (filters.brand) url += `brand=${filters.brand}&`;
      if (filters.minPrice) url += `minPrice=${filters.minPrice}&`;
      if (filters.maxPrice) url += `maxPrice=${filters.maxPrice}&`;
      if (filters.size) url += `size=${filters.size}&`;
      if (filters.sort) url += `sort=${filters.sort}&`;
      
      const { data } = await axios.get(url);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      sort: ''
    });
    navigate('/products');
  };

  return (
    <div className="container products-page">
      <div className="products-header">
        <h1>{category ? `${category} Collection` : search ? `Search Results for "${search}"` : 'All Products'}</h1>
        <button className="mobile-filter-btn" onClick={() => setIsFilterOpen(true)}>
          <Filter size={20} /> Filters
        </button>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="filter-header-mobile">
            <h3>Filters</h3>
            <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
          </div>
          
          <div className="filter-group">
            <h4>Sort By</h4>
            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="form-input">
              <option value="">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Brand</h4>
            <select name="brand" value={filters.brand} onChange={handleFilterChange} className="form-input">
              <option value="">All Brands</option>
              <option value="ÉLAN">ÉLAN</option>
              <option value="Nike">Nike</option>
              <option value="Zara">Zara</option>
              <option value="H&M">H&M</option>
              <option value="Levi's">Levi's</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="flex gap-2">
              <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} className="form-input" style={{ width: '50%' }} />
              <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className="form-input" style={{ width: '50%' }} />
            </div>
          </div>

          <div className="filter-group">
            <h4>Size</h4>
            <select name="size" value={filters.size} onChange={handleFilterChange} className="form-input">
              <option value="">All Sizes</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="8">8 (Shoes)</option>
              <option value="9">9 (Shoes)</option>
              <option value="10">10 (Shoes)</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={clearFilters} style={{ width: '100%' }}>Clear All</button>
        </aside>

        {/* Product Grid */}
        <main className="products-grid-container">
          {loading ? (
            <div className="loader"></div>
          ) : products.length === 0 ? (
            <div className="empty-state text-center">
              <h2>No products found</h2>
              <p>We couldn't find anything matching your current filters.</p>
              <button className="btn btn-primary mt-4" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
      {isFilterOpen && <div className="overlay" onClick={() => setIsFilterOpen(false)}></div>}
    </div>
  );
};

export default Products;
