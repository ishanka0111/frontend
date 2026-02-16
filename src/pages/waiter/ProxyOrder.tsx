/**
 * Proxy Order - Take orders on behalf of customers
 */

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Layout } from '../../components';
import { MOCK_MENU_ITEMS, MOCK_ORDERS, MOCK_CATEGORIES } from '../../services/mockDataGenerator';
import type { MenuItem } from '../../services/mockDataGenerator';
import './ProxyOrder.css';

interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

interface PendingCashCollection {
  id: string;
  orderId: string;
  tableId: string;
  customerName: string;
  totalAmount: number;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED';
}

interface TableInfo {
  tableId: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DIRTY';
}

const STORAGE_KEY = 'waiter_pending_cash_collections';

// Helper to load pending collections from localStorage
const loadPendingCollections = (): PendingCashCollection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const collections = JSON.parse(stored) as PendingCashCollection[];
      return collections.filter(c => c.status === 'PENDING');
    }
  } catch (error) {
    console.error('Failed to load pending collections:', error);
  }
  return [];
};

const ProxyOrder: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [pendingCollections, setPendingCollections] = useState<PendingCashCollection[]>(loadPendingCollections);
  const [selectedCollection, setSelectedCollection] = useState<PendingCashCollection | null>(null);
  const [availableTables, setAvailableTables] = useState<number[]>([]);

  // Load available tables
  useEffect(() => {
    const loadAvailableTables = () => {
      const tables: number[] = [];
      for (let i = 1; i <= 12; i++) {
        const hasActiveOrder = MOCK_ORDERS.some(
          (o) => o.tableId === String(i) && o.status !== 'PAID' && o.status !== 'SERVED'
        );
        if (!hasActiveOrder) {
          tables.push(i);
        }
      }
      setAvailableTables(tables);
    };
    loadAvailableTables();
  }, [cartItems]); // Reload when cart changes (after placing order)

  // Save pending collections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingCollections));
  }, [pendingCollections]);

  const filteredItems = selectedCategory
    ? MOCK_MENU_ITEMS.filter((item) => item.categoryId === selectedCategory && item.isActive)
    : MOCK_MENU_ITEMS.filter((item) => item.isActive);

  const handleAddItem = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (menuItemId: number, change: number) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      );
      return updated.filter((item) => item.quantity > 0);
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedTable || !customerName.trim() || cartItems.length === 0) {
      alert('Please fill in table number, customer name, and add items to the order');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = {
      id: String(Math.max(...MOCK_ORDERS.map((o) => Number.parseInt(o.id))) + 1),
      customerId: 1,
      tableId: selectedTable,
      items: cartItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      status: 'PLACED' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_ORDERS.push(newOrder);
    
    // Create pending cash collection
    const cashCollection: PendingCashCollection = {
      id: `CC-${Date.now()}`,
      orderId: newOrder.id,
      tableId: selectedTable,
      customerName: customerName,
      totalAmount: totalAmount,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };
    
    // Add to pending collections
    setPendingCollections(prev => [...prev, cashCollection]);
    
    // Show QR code modal
    setSelectedCollection(cashCollection);
    setShowQRModal(true);
    
    setCartItems([]);
    setSelectedTable('');
    setCustomerName('');
  };

  const handleViewQR = (collection: PendingCashCollection) => {
    setSelectedCollection(collection);
    setShowQRModal(true);
  };

  const handleMarkAsHandedOver = (collectionId: string) => {
    setPendingCollections(prev => prev.filter(c => c.id !== collectionId));
    setShowQRModal(false);
    setSelectedCollection(null);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    // Don't clear selectedCollection here - keep it for reference
  };

  const handleCopyQRData = () => {
    if (!selectedCollection) return;
    
    const qrData = JSON.stringify({
      collectionId: selectedCollection.id,
      orderId: selectedCollection.orderId,
      tableId: selectedCollection.tableId,
      customerName: selectedCollection.customerName,
      amount: selectedCollection.totalAmount,
      timestamp: selectedCollection.timestamp,
      type: 'PROXY_ORDER_PAYMENT',
    });

    navigator.clipboard.writeText(qrData).then(() => {
      alert('✅ QR data copied to clipboard!\nGo to Cashier page and paste this data.');
    }).catch(() => {
      alert('Failed to copy. Please manually copy the QR data.');
    });
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout>
      <div className="proxy-order">
        <div className="page-header">
          <h1>📝 Proxy Order</h1>
          <p>Take orders on behalf of customers</p>
        </div>

        <div className="proxy-layout">
          {/* Left Side: Menu */}
          <div className="menu-section">
            {/* Order Info Form */}
            <div className="order-info-form">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="table-select">Table Number</label>
                  <select
                    id="table-select"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                  >
                    <option value="">Select Table</option>
                    {availableTables.length === 0 ? (
                      <option value="" disabled>No tables available</option>
                    ) : (
                      availableTables.map((num) => (
                        <option key={num} value={String(num)}>
                          Table {num} (Available)
                        </option>
                      ))
                    )}
                  </select>
                  {availableTables.length === 0 && (
                    <small className="text-warning">⚠️ All tables are currently occupied</small>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="customer-name">Customer Name</label>
                  <input
                    id="customer-name"
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
              <button
                className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {MOCK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="menu-items-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="menu-item">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="item-image" />
                  )}
                  <div className="item-content">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-footer">
                      <span className="item-price">${item.price.toFixed(2)}</span>
                      <button className="add-btn" onClick={() => handleAddItem(item)}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Cart */}
          <div className="cart-section">
            <div className="cart-header">
              <h2>Order Summary</h2>
              <span className="item-count">{totalItems} items</span>
            </div>

            <div className="cart-items-list">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>No items added yet</p>
                  <p className="hint">Browse menu and add items</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.menuItemId} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.menuItemId, -1)}
                      >
                        −
                      </button>
                      <span className="qty">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.menuItemId, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="total-row">
                <span>Total Amount:</span>
                <span className="total-amount">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="payment-note">💵 Customer pays cash after receiving order</div>
              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={!selectedTable || !customerName.trim() || cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* Pending Cash Collections */}
        {pendingCollections.length > 0 && (
          <div className="pending-collections">
            <div className="pending-header">
              <h2>💰 Pending Cash Collections</h2>
              <span className="pending-count">{pendingCollections.length} pending</span>
            </div>
            <div className="pending-grid">
              {pendingCollections.map((collection) => (
                <div key={collection.id} className="collection-card">
                  <div className="collection-info">
                    <div className="info-line">
                      <span className="label">Order:</span>
                      <span className="value">#{collection.orderId}</span>
                    </div>
                    <div className="info-line">
                      <span className="label">Table:</span>
                      <span className="value">{collection.tableId}</span>
                    </div>
                    <div className="info-line">
                      <span className="label">Customer:</span>
                      <span className="value">{collection.customerName}</span>
                    </div>
                    <div className="info-line amount">
                      <span className="label">Amount:</span>
                      <span className="value">${collection.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="info-line time">
                      <span className="label">Created:</span>
                      <span className="value">
                        {new Date(collection.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="view-qr-btn" 
                    onClick={() => handleViewQR(collection)}
                  >
                    📱 Show QR Code
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedCollection && (
          <div className="qr-modal-overlay" onClick={handleCloseQRModal}>
            <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
              <div className="qr-modal-header">
                <h2>✅ Cash Collection QR Code</h2>
                <button className="close-btn" onClick={handleCloseQRModal}>
                  ✕
                </button>
              </div>
              
              <div className="qr-modal-content">
                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">#{selectedCollection.orderId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Table:</span>
                    <span className="detail-value">{selectedCollection.tableId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Customer:</span>
                    <span className="detail-value">{selectedCollection.customerName}</span>
                  </div>
                  <div className="detail-row total">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value">${selectedCollection.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="qr-code-container">
                  <QRCodeSVG
                    value={JSON.stringify({
                      collectionId: selectedCollection.id,
                      orderId: selectedCollection.orderId,
                      tableId: selectedCollection.tableId,
                      customerName: selectedCollection.customerName,
                      amount: selectedCollection.totalAmount,
                      timestamp: selectedCollection.timestamp,
                      type: 'PROXY_ORDER_PAYMENT',
                    })}
                    size={220}
                    level="H"
                  />
                  <p className="qr-instruction">📱 Scan this QR code at cashier to process payment</p>
                </div>

                <div className="payment-instructions">
                  <div className="instruction-box">
                    <h4>💵 Payment Process:</h4>
                    <ol>
                      <li>Collect <strong>${selectedCollection.totalAmount.toFixed(2)}</strong> cash from customer after they receive order</li>
                      <li>Show this QR code to cashier</li>
                      <li>Cashier scans QR and confirms payment received</li>
                      <li>Click "Mark as Handed Over" after giving cash to cashier</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="qr-modal-footer">
                <button className="copy-qr-btn" onClick={handleCopyQRData}>
                  📋 Copy QR Data
                </button>
                <button className="print-btn" onClick={() => globalThis.print()}>
                  🖨️ Print
                </button>
                <button 
                  className="handover-btn" 
                  onClick={() => handleMarkAsHandedOver(selectedCollection.id)}
                >
                  ✅ Mark as Handed Over
                </button>
                <button className="done-btn" onClick={handleCloseQRModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProxyOrder;
