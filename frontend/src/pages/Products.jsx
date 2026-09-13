import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const category = queryParams.get('category') || '';
  const search = queryParams.get('search') || '';
  const pageParam = queryParams.get('page') || 1;
  
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    sort: ''
  });

  const categoriesList = ['Men', 'Women', 'Kids', 'Accessories'];

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [category, search, filters, pageParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/products?page=${pageParam}&`;
      if (category) url += `category=${category}&`;
      if (search) url += `search=${search}&`;
      if (filters.brand) url += `brand=${filters.brand}&`;
      if (filters.minPrice) url += `minPrice=${filters.minPrice}&`;
      if (filters.maxPrice) url += `maxPrice=${filters.maxPrice}&`;
      if (filters.size) url += `size=${filters.size}&`;
      if (filters.sort) url += `sort=${filters.sort}&`;
      
      const { data } = await axios.get(url);
      if (data.products) {
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setTotalCount(data.count);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    // Reset page to 1 on filter change
    updateURLParams({ page: 1 });
  };

  const handleCategoryClick = (cat) => {
    updateURLParams({ category: cat, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      updateURLParams({ page: newPage });
    }
  };

  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(location.search);
    Object.keys(newParams).forEach(key => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });
    navigate(`/products?${params.toString()}`);
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
          
          <div className="filter-group category-nav">
            <h4>Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <button 
                  onClick={() => handleCategoryClick('')}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: category === '' ? 'bold' : 'normal', color: category === '' ? 'var(--primary-color)' : 'inherit', textAlign: 'left', fontSize: '1rem' }}
                >
                  All Categories
                </button>
              </li>
              {categoriesList.map(cat => (
                <li key={cat} style={{ marginBottom: '8px' }}>
                  <button 
                    onClick={() => handleCategoryClick(cat)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: category === cat ? 'bold' : 'normal', color: category === cat ? 'var(--primary-color)' : 'inherit', textAlign: 'left', fontSize: '1rem' }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
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
              <option value="LUXORA">LUXORA</option>
              <option value="Nike">Nike</option>
              <option value="Zara">Zara</option>
              <option value="H&M">H&M</option>
              <option value="Levi's">Levi's</option>
              <option value="Coach">Coach</option>
              <option value="Fossil">Fossil</option>
              <option value="Ray-Ban">Ray-Ban</option>
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
            <>
              <p className="mb-4 text-sm" style={{ color: '#666' }}>Showing {products.length} of {totalCount} products</p>
              <div className="grid grid-cols-4">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination flex justify-center items-center mt-8 gap-4">
                  <button 
                    className="btn btn-secondary" 
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-bold">Page {page} of {pages}</span>
                  <button 
                    className="btn btn-secondary" 
                    disabled={page === pages}
                    onClick={() => handlePageChange(page + 1)}
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {isFilterOpen && <div className="overlay" onClick={() => setIsFilterOpen(false)}></div>}
    </div>
  );
};

export default Products;
