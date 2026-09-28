import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { CurrencyContext } from '../../context/CurrencyContext';
import { ToastContext } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Search, Filter, ShieldCheck, X, Sparkles, Layers, Award } from 'lucide-react';
import './AdminRentals.css';

const AdminRentals = () => {
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Sabyasachi',
    category: 'Wedding',
    gender: 'Women',
    dailyRate: 1999,
    securityDeposit: 5000,
    originalValue: 120000,
    fabric: 'Pure Silk Velvet with Zardosi Embroidery',
    fitType: 'Bridal Tailored Fit',
    occasionTag: 'Wedding Reception',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
    sizes: 'S, M, L',
    stockUnits: 3
  });

  useEffect(() => {
    fetchRentals();
  }, [user]);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/rentals/products');
      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching rental items:', err);
    }
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingRental(null);
    setFormData({
      name: '',
      brand: 'Sabyasachi',
      category: 'Wedding',
      gender: 'Women',
      dailyRate: 1999,
      securityDeposit: 5000,
      originalValue: 120000,
      fabric: 'Pure Silk Velvet with Zardosi Embroidery',
      fitType: 'Bridal Tailored Fit',
      occasionTag: 'Wedding Reception',
      description: 'Handcrafted luxury designer garment available for 3 to 30 day rentals.',
      imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      sizes: 'S, M, L',
      stockUnits: 3
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingRental(item);
    setFormData({
      name: item.name,
      brand: item.brand || 'LUXORA RENTALS',
      category: item.category || 'Gala',
      gender: item.gender || 'Unisex',
      dailyRate: item.dailyRate,
      securityDeposit: item.securityDeposit,
      originalValue: item.originalValue,
      fabric: item.fabric || '',
      fitType: item.fitType || '',
      occasionTag: item.occasionTag || '',
      description: item.description || '',
      imageUrl: item.images?.[0] || '',
      sizes: item.sizes ? item.sizes.join(', ') : 'S, M, L',
      stockUnits: item.stockUnits !== undefined ? item.stockUnits : 3
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const imagesArray = [formData.imageUrl || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'];

      const payload = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        gender: formData.gender,
        dailyRate: Number(formData.dailyRate),
        securityDeposit: Number(formData.securityDeposit),
        originalValue: Number(formData.originalValue),
        fabric: formData.fabric,
        fitType: formData.fitType,
        occasionTag: formData.occasionTag,
        description: formData.description,
        images: imagesArray,
        sizes: sizesArray,
        stockUnits: Number(formData.stockUnits)
      };

      if (editingRental) {
        await axios.put(`http://localhost:5000/api/rentals/products/${editingRental._id}`, payload, config);
        addToast(`Updated rental garment "${formData.name}"!`, 'success', 'Rental Updated');
      } else {
        await axios.post('http://localhost:5000/api/rentals/products', payload, config);
        addToast(`Added new rental garment "${formData.name}"!`, 'success', 'Rental Created');
      }

      setIsModalOpen(false);
      fetchRentals();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error saving rental product.', 'error');
    }
  };

  const handleQuickStockUpdate = async (itemId, newStock) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/rentals/products/${itemId}`, { stockUnits: newStock }, config);
      setRentals(prev => prev.map(r => r._id === itemId ? { ...r, stockUnits: newStock } : r));
      addToast(`Updated rental stock units to ${newStock}`, 'info');
    } catch (err) {
      addToast('Failed to update stock units', 'error');
    }
  };

  const handleDeleteRental = async (itemId, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the rental wardrobe?`)) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/rentals/products/${itemId}`, config);
      addToast(`Removed "${name}" from rentals`, 'info');
      fetchRentals();
    } catch (err) {
      addToast('Failed to delete rental outfit', 'error');
    }
  };

  const filteredRentals = rentals.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-rentals-page">
      <div className="admin-page-header">
        <div>
          <h1>Luxury Rental Closet Stock & Unit Manager 👑</h1>
          <p>Manage high-end designer outfits available for 3 to 30 day rentals. Update stock units & daily rates.</p>
        </div>
        <button className="btn-add-rental-garment" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Rental Garment
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search rental outfits by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select">
          <Filter size={16} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Wedding">Wedding</option>
            <option value="Gala">Gala</option>
            <option value="Suit">Luxury Suits</option>
            <option value="Ethnic">Ethnic</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rental Outfit</th>
                <th>Brand & Specs</th>
                <th>Daily Rate</th>
                <th>Deposit</th>
                <th>Original Retail</th>
                <th>Concurrent Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="table-product-item">
                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span className="cat-chip">{item.category} ({item.gender})</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="brand-tag-gold">{item.brand}</span>
                    <small className="block-text">{item.fabric ? item.fabric.substring(0, 30) + '...' : ''}</small>
                  </td>
                  <td><strong className="text-gold">{formatPrice(item.dailyRate)} / day</strong></td>
                  <td><span>{formatPrice(item.securityDeposit)}</span></td>
                  <td><small className="strike-retail">{formatPrice(item.originalValue)}</small></td>
                  <td>
                    <div className="stock-counter-input">
                      <button onClick={() => handleQuickStockUpdate(item._id, Math.max(0, (item.stockUnits || 3) - 1))}>-</button>
                      <span>{item.stockUnits !== undefined ? item.stockUnits : 3}</span>
                      <button onClick={() => handleQuickStockUpdate(item._id, (item.stockUnits || 3) + 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions-row">
                      <button className="btn-table-action edit" onClick={() => handleOpenEditModal(item)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-table-action delete" onClick={() => handleDeleteRental(item._id, item.name)} title="Delete">
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
              <h2>{editingRental ? 'Edit Rental Outfit Specs' : 'Add New Designer Rental Outfit'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-form-grid">
              <div className="form-group span-2">
                <label>Outfit Name / Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sabyasachi Royal Velvet Lehenga"
                  required
                />
              </div>

              <div className="form-group">
                <label>Designer Brand</label>
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
                  <option value="Wedding">Wedding</option>
                  <option value="Gala">Gala</option>
                  <option value="Suit">Suit</option>
                  <option value="Ethnic">Ethnic</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label>Daily Rental Rate (INR ₹)</label>
                <input
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Refundable Security Deposit (INR ₹)</label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Original Retail Value (INR ₹)</label>
                <input
                  type="number"
                  value={formData.originalValue}
                  onChange={(e) => setFormData({ ...formData, originalValue: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock Units for Renting</label>
                <input
                  type="number"
                  value={formData.stockUnits}
                  onChange={(e) => setFormData({ ...formData, stockUnits: e.target.value })}
                  required
                />
              </div>

              <div className="form-group span-2">
                <label>Fabric / Craftsmanship Specification</label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  placeholder="e.g. Pure Zari Hand-Embroidered Velvet"
                />
              </div>

              <div className="form-group span-2">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-group span-2">
                <label>Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                />
              </div>

              <div className="form-group span-2">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-footer span-2">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-modal-save">
                  {editingRental ? 'Update Rental Outfit' : 'Add Rental Outfit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRentals;
