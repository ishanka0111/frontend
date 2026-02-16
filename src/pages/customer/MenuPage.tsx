/**
 * Menu Page - Uber Eats style layout with search, category pills, and filters
 */

import React, { useState, useMemo } from 'react';
import {
  IoSearchOutline,
  IoAddOutline,
  IoFilterOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { Layout } from '../../components';
import { MOCK_MENU, type MenuItem } from '../../services/mockDataGenerator';
import { useCart } from '../../hooks/useCart';
import './MenuPage.css';

interface FilterState {
  searchTerm: string;
  selectedCategory: string | null;
}

const MenuPage: React.FC = () => {
  const { addItem } = useCart();
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCats = new Set<string>(MOCK_MENU.map((item) => item.categoryName || ''));
    return Array.from(uniqueCats).filter(cat => cat !== '');
  }, []);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return MOCK_MENU.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesCategory =
        !filters.selectedCategory ||
        item.categoryName === filters.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [filters]);

  const getQuantity = (itemId: number) => itemQuantities[itemId] || 1;

  const handleAddItem = (item: MenuItem) => {
    const quantity = getQuantity(item.id);
    addItem(item, quantity);
  };

  const handleIncrease = (itemId: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: getQuantity(itemId) + 1,
    }));
  };

  const handleDecrease = (itemId: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, getQuantity(itemId) - 1),
    }));
  };

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory:
        prev.selectedCategory === category ? null : category,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  return (
    <Layout showNavigation={false}>
      <div className="menu-page">
        {/* Header Section */}
        <div className="menu-header">
          {/* Search Bar */}
          <div className="search-container">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="search-input"
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
            {filters.searchTerm && (
              <button
                className="clear-search"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: '',
                  }))
                }
              >
                <IoCloseOutline />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="categories-scroll">
            <div className="categories-wrapper">
              <button
                className={`category-pill ${
                  filters.selectedCategory === null ? 'active' : ''
                }`}
                onClick={() => handleCategorySelect('')}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-pill ${
                    filters.selectedCategory === category ? 'active' : ''
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <button
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <IoFilterOutline />
              <span>Filters</span>
            </button>
            <div className="filter-tags">
              <span className="filter-tag">Popular</span>
              <span className="filter-tag">Quick Delivery</span>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            {filteredItems.length} item
            {filteredItems.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="menu-item">
                {item.imageUrl && (
                  <div className="item-image-container">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>
                )}

                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>

                  <div className="item-footer">
                    <span className="item-price">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="item-actions">
                      <div className="item-qty">
                        <button
                          type="button"
                          className="item-qty-btn"
                          onClick={() => handleDecrease(item.id)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="item-qty-value">
                          {getQuantity(item.id)}
                        </span>
                        <button
                          type="button"
                          className="item-qty-btn"
                          onClick={() => handleIncrease(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddItem(item)}
                        title="Add to cart"
                      >
                        <IoAddOutline />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <IoSearchOutline />
              </div>
              <h3>No items found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MenuPage;
