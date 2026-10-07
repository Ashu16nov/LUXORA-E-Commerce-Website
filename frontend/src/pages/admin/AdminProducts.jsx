import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { CurrencyContext } from '../../context/CurrencyContext';
import { ToastContext } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Search, Filter, RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';
import './AdminProducts.css';

const AdminProducts = () => {
  const { user, token } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    brand: 'LUXORA',
    category: 'Men',
    subCategory: 'Apparel',
    price: '',
    originalPrice: '',
    discount: 0,
    stock: 10,
    description: '',
    imageUrl: '',
    sizes: 'S, M, L, XL',
    trending: false,
    offer: false
  });

  useEffect(() => {
    fetchProducts();
  }, [user, token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?limit=100`);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
    }
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'LUXORA',
      category: 'Men',
      subCategory: 'Apparel',
      price: '',
      originalPrice: '',
      discount: 0,
      stock: 10,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      sizes: 'S, M, L, XL',
      trending: false,
      offer: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || 'LUXORA',
      category: product.category || 'Men',
      subCategory: product.subCategory || 'Apparel',
      price: product.price,
      originalPrice: product.originalPrice || '',
      discount: product.discount || 0,
      stock: product.stock,
      description: product.description || '',
      imageUrl: product.images?.[0] || '',
      sizes: product.sizes ? product.sizes.join(', ') : 'S, M, L, XL',
      trending: product.trending || false,
      offer: product.offer || false
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const imagesArray = [formData.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'];

      const payload = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        subCategory: formData.subCategory,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        description: formData.description,
        images: imagesArray,
        sizes: sizesArray,
        trending: formData.trending,
        offer: formData.offer
      };

      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct._id}`, payload, config);
        addToast(`Updated "${formData.name}" successfully!`, 'success', 'Stock Updated');
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, payload, config);
        addToast(`Created new product "${formData.name}"!`, 'success', 'Product Added');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error saving product details.', 'error');
    }
  };

  const handleQuickStockUpdate = async (productId, newStock) => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`, { stock: newStock }, config);
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: newStock } : p));
      addToast(`Updated stock count to ${newStock}`, 'info');
    } catch (err) {
      addToast('Failed to update stock', 'error');
    }
  };

  const handleDeleteProduct = async (productId, name) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`, config);
      addToast(`Deleted "${name}"`, 'info');
      fetchProducts();
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <div>
          <h1>Retail Inventory Stock Management</h1>
          <p>Add new retail items, adjust stock counts, edit pricing & launch promotional discounts.</p>
        </div>
        <button className="btn-add-new-product" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Retail Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select">
          <Filter size={16} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="table-product-item">
                      <img src={product.images[0]} alt={product.name} />
                      <div>
                        <strong>{product.name}</strong>
                        {product.discount > 0 && <span className="discount-chip">{product.discount}% OFF</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="brand-tag-small">{product.brand}</span></td>
                  <td>{product.category}</td>
                  <td>
                    <strong>{formatPrice(product.price)}</strong>
                    {product.originalPrice && <small className="strike">{formatPrice(product.originalPrice)}</small>}
                  </td>
                  <td>
                    <div className="stock-counter-input">
                      <button onClick={() => handleQuickStockUpdate(product._id, Math.max(0, product.stock - 1))}>-</button>
                      <span>{product.stock}</span>
                      <button onClick={() => handleQuickStockUpdate(product._id, product.stock + 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    {product.stock === 0 ? (
                      <span className="status-badge out">Out of Stock</span>
                    ) : product.stock < 5 ? (
                      <span className="status-badge low">Low Stock ({product.stock})</span>
                    ) : (
                      <span className="status-badge in">In Stock</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions-row">
                      <button className="btn-table-action edit" onClick={() => handleOpenEditModal(product)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-table-action delete" onClick={() => handleDeleteProduct(product._id, product.name)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Edit Retail Product' : 'Add New Retail Product'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-form-grid">
              <div className="form-group span-2">
                <label>Product Title / Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Italian Silk Slim-Fit Blazer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label>Selling Price (INR ₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2499"
                  required
                />
              </div>

              <div className="form-group">
                <label>Original MRP (INR ₹)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="4999"
                />
              </div>

              <div className="form-group">
                <label>Discount Percentage (%)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Inventory Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              <div className="form-group span-2">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="form-group span-2">
                <label>Sizes Available (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                />
              </div>

              <div className="form-group span-2">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of tailoring, fabric, and fit..."
                />
              </div>

              <div className="form-group span-2 flex gap-4">
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={formData.trending}
                    onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  />
                  <span>Mark as Trending</span>
                </label>
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={formData.offer}
                    onChange={(e) => setFormData({ ...formData, offer: e.target.checked })}
                  />
                  <span>Mark as Special Offer</span>
                </label>
              </div>

              <div className="admin-modal-footer span-2">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-modal-save">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
