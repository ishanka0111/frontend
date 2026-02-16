/**
 * Menu Page - Customer Menu Browsing
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { Layout, MenuCard, LoadingSpinner } from '../../components';
import { getCategories, getMenuItems } from '../../api/menu';
import type { Category, MenuItem } from '../../types';
import './MenuPage.css';

const MenuPage: React.FC = () => {
  const { tableId, user } = useAuth();
  const { addItem, openCart } = useCart();
  const isCustomer = user?.role === 1;

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItemsByCategory, setMenuItemsByCategory] = useState<Record<number, MenuItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch categories
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      // Fetch menu items for each category
      const itemsByCategory: Record<number, MenuItem[]> = {};
      for (const category of categoriesData) {
        const items = await getMenuItems(category.id);
        itemsByCategory[category.id] = items;
      }
      setMenuItemsByCategory(itemsByCategory);
    } catch (err) {
      setError('Failed to load menu. Please try again later.');
      console.error('Error loading menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem, quantity: number, notes?: string) => {
    addItem(item, quantity, notes);
    // Show confirmation feedback
    openCart();
  };

  if (isLoading) {
    return (
      <Layout title="🍽️ Restaurant Menu" showTableId={isCustomer && !!tableId}>
        <div className="menu-container">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="🍽️ Restaurant Menu" showTableId={isCustomer && !!tableId}>
        <div className="menu-container">
          <div className="menu-error">
            <p className="menu-error__text">{error}</p>
            <button onClick={loadMenu} className="menu-error__retry">
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="🍽️ Restaurant Menu" showTableId={isCustomer && !!tableId}>
      <div className="menu-container">
        <div className="menu-header">
          <h1 className="menu-header__title">Our Menu</h1>
          <p className="menu-header__subtitle">Delicious dishes prepared with love</p>
        </div>

        {/* Search and Filters */}
        <div className="menu-filters">
          <div className="menu-search">
            <input
              type="text"
              placeholder="🔍 Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search__input"
            />
          </div>

          <div className="category-filters">
            <button
              className={`category-filter ${selectedCategory === null ? 'category-filter--active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'category-filter--active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items by Category */}
        {categories.map(category => {
          // Skip if category filter is active and doesn't match
          if (selectedCategory !== null && selectedCategory !== category.id) {
            return null;
          }

          const items = menuItemsByCategory[category.id] || [];
          
          // Filter items by search query
          const filteredItems = items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={category.id} className="menu-category">
              <h2 className="menu-category__title">{category.name}</h2>
              <div className="menu-category__grid">
                {filteredItems.map(item => (
                  <MenuCard 
                    key={item.id}
                    item={item}
                    {...(isCustomer && { onAddToCart: handleAddToCart })}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="menu-empty">
            <p>No menu items available at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MenuPage;
