/**
 * Inventory Management - Track stock levels for ingredients
 */

import React, { useState } from 'react';
import { Layout } from '../../components';
import './InventoryManagement.css';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minStock: number;
  supplier: string;
  lastRestocked: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 1, name: 'Fresh Salmon', category: 'Seafood', currentStock: 25, unit: 'kg', minStock: 10, supplier: 'Ocean Fresh Co.', lastRestocked: '2026-02-14' },
  { id: 2, name: 'Ribeye Steak', category: 'Meat', currentStock: 30, unit: 'kg', minStock: 15, supplier: 'Prime Meats Ltd.', lastRestocked: '2026-02-13' },
  { id: 3, name: 'Pasta (Spaghetti)', category: 'Dry Goods', currentStock: 50, unit: 'kg', minStock: 20, supplier: 'Italian Imports', lastRestocked: '2026-02-10' },
  { id: 4, name: 'Olive Oil', category: 'Oils', currentStock: 8, unit: 'L', minStock: 10, supplier: 'Mediterranean Foods', lastRestocked: '2026-02-12' },
  { id: 5, name: 'Tomatoes', category: 'Vegetables', currentStock: 40, unit: 'kg', minStock: 15, supplier: 'Fresh Farm Produce', lastRestocked: '2026-02-15' },
  { id: 6, name: 'Mozzarella Cheese', category: 'Dairy', currentStock: 12, unit: 'kg', minStock: 8, supplier: 'Dairy Delights', lastRestocked: '2026-02-14' },
  { id: 7, name: 'Garlic', category: 'Vegetables', currentStock: 5, unit: 'kg', minStock: 8, supplier: 'Fresh Farm Produce', lastRestocked: '2026-02-13' },
  { id: 8, name: 'Red Wine', category: 'Beverages', currentStock: 45, unit: 'bottles', minStock: 30, supplier: 'Wine Merchants', lastRestocked: '2026-02-11' },
  { id: 9, name: 'Flour', category: 'Dry Goods', currentStock: 60, unit: 'kg', minStock: 25, supplier: 'Grain Mills Inc.', lastRestocked: '2026-02-09' },
  { id: 10, name: 'Chocolate', category: 'Dessert Ingredients', currentStock: 6, unit: 'kg', minStock: 10, supplier: 'Sweet Supply Co.', lastRestocked: '2026-02-10' },
];

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<string>('');
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const categories = Array.from(new Set(inventory.map((item) => item.category)));

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesLowStock = !showLowStock || item.currentStock < item.minStock;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleOpenRestockModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setRestockAmount('');
    setShowRestockModal(true);
  };

  const handleRestockSubmit = () => {
    if (!selectedItem || !restockAmount || Number.isNaN(Number(restockAmount)) || Number(restockAmount) <= 0) {
      alert('Please enter a valid restock amount');
      return;
    }

    const amount = Number(restockAmount);
    setInventory(
      inventory.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              currentStock: item.currentStock + amount,
              lastRestocked: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );

    setShowRestockModal(false);
    setFeedbackMessage(`✅ Successfully restocked ${amount} ${selectedItem.unit} of ${selectedItem.name}`);
    setShowSuccessFeedback(true);
    setTimeout(() => setShowSuccessFeedback(false), 3000);
  };

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter((item) => item.currentStock < item.minStock).length,
    totalValue: inventory.length * 1000, // Mock value
  };

  return (
    <Layout>
      <div className="inventory-management">
        <div className="page-header">
          <h1>📦 Inventory Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-value">{stats.lowStock}</div>
            <div className="stat-label">Low Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${(stats.totalValue / 1000).toFixed(1)}k</div>
            <div className="stat-label">Est. Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="🔍 Search items or suppliers..."
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
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${categoryFilter === category ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <label className="checkbox-filter">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
              />
              <span>Show Low Stock Only</span>
            </label>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Stock</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Last Restocked</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.currentStock < item.minStock;
                  return (
                    <tr key={item.id} className={isLow ? 'low-stock-row' : ''}>
                      <td className="item-name">{item.name}</td>
                      <td>{item.category}</td>
                      <td className="stock-amount">
                        {item.currentStock} {item.unit}
                      </td>
                      <td>{item.minStock} {item.unit}</td>
                      <td>
                        <span className={`status-badge ${isLow ? 'low' : 'good'}`}>
                          {isLow ? '⚠️ Low Stock' : '✓ Good'}
                        </span>
                      </td>
                      <td>{item.supplier}</td>
                      <td>{new Date(item.lastRestocked).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="restock-btn"
                          onClick={() => handleOpenRestockModal(item)}
                        >
                          ➕ Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Success Feedback */}
        {showSuccessFeedback && (
          <div className="success-toast">
            {feedbackMessage}
          </div>
        )}

        {/* Restock Modal */}
        {showRestockModal && selectedItem && (
          <div className="modal-overlay" onClick={() => setShowRestockModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>📦 Restock Item</h2>
              <div className="modal-body">
                <div className="item-detail">
                  <strong>{selectedItem.name}</strong>
                  <p>Current Stock: {selectedItem.currentStock} {selectedItem.unit}</p>
                  <p>Minimum Stock: {selectedItem.minStock} {selectedItem.unit}</p>
                </div>
                <div className="form-field">
                  <label>Restock Amount ({selectedItem.unit})</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount to add"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(e.target.value)}
                    autoFocus
                  />
                </div>
                {restockAmount && !Number.isNaN(Number(restockAmount)) && (
                  <div className="stock-preview">
                    <p>New Stock: {selectedItem.currentStock + Number(restockAmount)} {selectedItem.unit}</p>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowRestockModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleRestockSubmit}>
                  ✓ Confirm Restock
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InventoryManagement;
