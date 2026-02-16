/**
 * Category Management - Manage menu categories
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from '../../services/mockDataGenerator';
import type { MenuCategory } from '../../services/mockDataGenerator';
import './CategoryManagement.css';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🍽️',
    displayOrder: 1,
  });

  useEffect(() => {
    setCategories([...MOCK_CATEGORIES]);
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '🍽️',
      displayOrder: categories.length + 1,
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      displayOrder: category.displayOrder,
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    const itemCount = MOCK_MENU_ITEMS.filter((item) => item.categoryId === categoryId).length;
    
    if (itemCount > 0) {
      alert(`Cannot delete category: ${itemCount} menu items are using this category. Please reassign or delete those items first.`);
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData }
            : cat
        )
      );
    } else {
      const newCategory: MenuCategory = {
        id: Date.now(),
        ...formData,
      };
      setCategories([...categories, newCategory]);
    }

    setShowModal(false);
  };

  const getItemCount = (categoryId: number) => {
    return MOCK_MENU_ITEMS.filter((item) => item.categoryId === categoryId && item.isActive).length;
  };

  const iconOptions = ['🍽️', '🥗', '🍝', '🥩', '🍰', '🍷', '🍕', '🍜', '🍱', '🥘', '🍲', '🥙'];

  return (
    <Layout>
      <div className="category-management">
        <div className="page-header">
          <h1>🏷️ Category Management</h1>
          <button className="btn btn-primary" onClick={handleAddCategory}>
            ➕ Add Category
          </button>
        </div>

        <div className="categories-grid">
          {categories
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-meta">
                    <span className="item-count">
                      {getItemCount(category.id)} active items
                    </span>
                    <span className="display-order">Order: {category.displayOrder}</span>
                  </div>
                  <div className="category-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditCategory(category)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Main Courses"
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description"
                  />
                </div>
                <div className="form-group">
                  <label>Icon *</label>
                  <div className="icon-picker">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, icon })}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Display Order *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: Number(e.target.value) })
                    }
                  />
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
                    {editingCategory ? 'Update' : 'Add'} Category
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

export default CategoryManagement;
