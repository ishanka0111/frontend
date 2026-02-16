/**
 * Category Management - Manage menu categories
 */

import React, { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoAddCircle,
  IoCloseCircle,
  IoCreateOutline,
  IoFishOutline,
  IoFlameOutline,
  IoIceCreamOutline,
  IoPizzaOutline,
  IoPricetagOutline,
  IoRestaurantOutline,
  IoTrashOutline,
  IoWineOutline,
} from 'react-icons/io5';
import { Layout } from '../../components';
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from '../../services/mockDataGenerator';
import type { Category, CategoryIconKey } from '../../services/mockDataGenerator';
import './CategoryManagement.css';

const CATEGORY_ICON_MAP: Record<CategoryIconKey, IconType> = {
  appetizers: IoRestaurantOutline,
  pasta: IoPizzaOutline,
  mains: IoFlameOutline,
  seafood: IoFishOutline,
  desserts: IoIceCreamOutline,
  beverages: IoWineOutline,
};

const iconOptions: CategoryIconKey[] = [
  'appetizers',
  'pasta',
  'mains',
  'seafood',
  'desserts',
  'beverages',
];

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => [...MOCK_CATEGORIES]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconKey: 'appetizers' as CategoryIconKey,
    displayOrder: 1,
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      iconKey: 'appetizers',
      displayOrder: categories.length + 1,
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      iconKey: category.iconKey,
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
      const newCategory: Category = {
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

  return (
    <Layout>
      <div className="category-management">
        <div className="page-header">
          <h1>
            <IoPricetagOutline className="title-icon" />
            Category Management
          </h1>
          <button className="btn btn-primary" onClick={handleAddCategory}>
            <IoAddCircle className="btn-icon" />
            Add Category
          </button>
        </div>

        <div className="categories-grid">
          {categories
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">
                  {(() => {
                    const Icon = CATEGORY_ICON_MAP[category.iconKey];
                    return <Icon />;
                  })()}
                </div>
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
                      <IoCreateOutline className="btn-icon" />
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <IoTrashOutline className="btn-icon" />
                      Delete
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
                  <IoCloseCircle />
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
                    {iconOptions.map((iconKey) => (
                      <button
                        key={iconKey}
                        type="button"
                        className={`icon-option ${formData.iconKey === iconKey ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, iconKey })}
                      >
                        {(() => {
                          const Icon = CATEGORY_ICON_MAP[iconKey];
                          return <Icon />;
                        })()}
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
