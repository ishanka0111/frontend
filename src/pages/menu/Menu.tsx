/**
 * Menu Page - Category-based menu with horizontal item scroll
 */

import React, { useState, useMemo } from 'react';
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoAddOutline,
} from 'react-icons/io5';
import { Layout } from '../../components';
import { MOCK_MENU, type MenuItem } from '../../services/mockDataGenerator';
import { useCart } from '../../hooks/useCart';
import './Menu.css';

const Menu: React.FC = () => {
  const { addItem } = useCart();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([MOCK_MENU[0]?.categoryName || ''])
  );

  // Group items by category
  const categorizedItems = useMemo(() => {
    const grouped: { [key: string]: MenuItem[] } = {};
    MOCK_MENU.forEach((item) => {
      const categoryName = item.categoryName || 'Other';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(item);
    });
    return grouped;
  }, []);

  const categories = Object.keys(categorizedItems);

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddItem = (item: MenuItem) => {
    // Ensure categoryName exists for cart
    const itemToAdd = {
      ...item,
      categoryName: item.categoryName || 'Other'
    };
    addItem(itemToAdd);
  };

  return (
    <Layout title="Browse Menu">
      <div className="menu-container">
        <div className="menu-content">
          {/* Categories List */}
          <div className="categories-panel">
            <h2 className="categories-title">Categories</h2>
            <div className="categories-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${
                    expandedCategories.has(category) ? 'active' : ''
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  <span className="category-name">{category}</span>
                  <span className="category-arrow">
                    {expandedCategories.has(category) ? (
                      <IoChevronDownOutline />
                    ) : (
                      <IoChevronForwardOutline />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="items-panel">
            {categories.map((category) =>
              expandedCategories.has(category) ? (
                <div key={category} className="category-section">
                  <h3 className="category-header">{category}</h3>
                  <div className="items-horizontal-scroll">
                    <div className="items-scroll-wrapper">
                      {categorizedItems[category].map((item) => (
                        <div key={item.id} className="menu-item-card">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="item-image"
                            />
                          )}
                          <div className="item-content">
                            <h4 className="item-name">{item.name}</h4>
                            <p className="item-description">
                              {item.description}
                            </p>
                            <div className="item-footer">
                              <span className="item-price">
                                ${item.price.toFixed(2)}
                              </span>
                              <button
                                className="add-btn"
                                onClick={() => handleAddItem(item)}
                                title="Add to cart"
                              >
                                <IoAddOutline />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
