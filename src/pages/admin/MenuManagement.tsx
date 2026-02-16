/**
 * Menu Management - Manage menu items (Add, Edit, Delete, Toggle Active)
 */

import React, { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoAddCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCreateOutline,
  IoFishOutline,
  IoFlameOutline,
  IoIceCreamOutline,
  IoListOutline,
  IoPauseCircle,
  IoPizzaOutline,
  IoRestaurantOutline,
  IoTrashOutline,
  IoWineOutline,
} from 'react-icons/io5';
import { Layout } from '../../components';
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from '../../services/mockDataGenerator';
import type { CategoryIconKey, MenuItem } from '../../services/mockDataGenerator';
import './MenuManagement.css';

const CATEGORY_ICON_MAP: Record<CategoryIconKey, IconType> = {
  appetizers: IoRestaurantOutline,
  pasta: IoPizzaOutline,
  mains: IoFlameOutline,
  seafood: IoFishOutline,
  desserts: IoIceCreamOutline,
  beverages: IoWineOutline,
};

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => [...MOCK_MENU_ITEMS]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 1,
    description: '',
    price: 0,
    imageUrl: '',
    isActive: true,
  });

  const filteredItems = useMemo(() => {
    let filtered = [...menuItems];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== null) {
      filtered = filtered.filter((item) => item.categoryId === categoryFilter);
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter((item) => item.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((item) => !item.isActive);
    }

    return filtered;
  }, [menuItems, searchTerm, categoryFilter, statusFilter]);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      categoryId: 1,
      description: '',
      price: 0,
      imageUrl: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleDeleteItem = (itemId: number) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
    }
  };

  const handleToggleActive = (itemId: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      // Update existing item
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setMenuItems([...menuItems, newItem]);
    }

    setShowModal(false);
  };

  const getCategoryName = (categoryId: number) => {
    return MOCK_CATEGORIES.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const stats = {
    total: menuItems.length,
    active: menuItems.filter((item) => item.isActive).length,
    inactive: menuItems.filter((item) => !item.isActive).length,
    avgPrice: (
      menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length
    ).toFixed(2),
  };

  return (
    <Layout>
      <div className="menu-management">
        <div className="page-header">
          <h1>
            <IoListOutline className="title-icon" />
            Menu Management
          </h1>
          <button className="btn btn-primary" onClick={handleAddItem}>
            <IoAddCircle className="btn-icon" />
            Add Menu Item
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.inactive}</div>
            <div className="stat-label">Inactive</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${stats.avgPrice}</div>
            <div className="stat-label">Avg Price</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="Search menu items..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-row">
            <div className="category-filters">
              <button
                className={`filter-btn ${categoryFilter === null ? 'active' : ''}`}
                onClick={() => setCategoryFilter(null)}
              >
                All Categories
              </button>
              {MOCK_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${categoryFilter === category.id ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(category.id)}
                >
                  {(() => {
                    const Icon = CATEGORY_ICON_MAP[category.iconKey];
                    return <Icon className="btn-icon" />;
                  })()}
                  {category.name}
                </button>
              ))}
            </div>
            <div className="status-filters">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </button>
              <button
                className={`filter-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
                onClick={() => setStatusFilter('inactive')}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-items-grid">
          {filteredItems.length === 0 ? (
            <div className="empty-state">No menu items found</div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className={`menu-item-card ${!item.isActive ? 'inactive' : ''}`}>
                <div className="item-image">
                  <img src={item.imageUrl} alt={item.name} />
                  {!item.isActive && <div className="inactive-overlay">Inactive</div>}
                </div>
                <div className="item-content">
                  <div className="item-header">
                    <h3>{item.name}</h3>
                    <span className="item-price">${item.price}</span>
                  </div>
                  <p className="item-description">{item.description}</p>
                  <div className="item-meta">
                    <span className="category-tag">
                      {getCategoryName(item.categoryId)}
                    </span>
                  </div>
                  <div className="item-actions">
                    <button
                      className={`toggle-btn ${item.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(item.id)}
                    >
                      {item.isActive ? (
                        <>
                          <IoCheckmarkCircle className="btn-icon" />
                          Active
                        </>
                      ) : (
                        <>
                          <IoPauseCircle className="btn-icon" />
                          Inactive
                        </>
                      )}
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditItem(item)}
                    >
                      <IoCreateOutline className="btn-icon" />
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <IoTrashOutline className="btn-icon" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <IoCloseCircle />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Grilled Salmon"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: Number(e.target.value) })
                    }
                  >
                    {MOCK_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the dish..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    placeholder="15.99"
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                    <span>Active (visible to customers)</span>
                  </label>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Update' : 'Add'} Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MenuManagement;
