/**
 * Serve Orders - See prepared orders and serve them to tables
 */

import React, { useState, useEffect } from 'react';
import { IoCheckmarkCircle, IoRestaurantOutline, IoTimeOutline } from 'react-icons/io5';
import { Layout } from '../../components';
import { MOCK_ORDERS, MOCK_MENU_ITEMS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import './ServeOrders.css';

const ServeOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    // Only show READY orders (preparing orders should stay in kitchen)
    const readyOrders = MOCK_ORDERS.filter(
      (o) => o.status === 'READY'
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(readyOrders);
  };

  const handleServeOrder = (orderId: string, tableId: string) => {
    const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === orderId);
    if (orderIndex !== -1) {
      MOCK_ORDERS[orderIndex] = { ...MOCK_ORDERS[orderIndex], status: 'SERVED' };
      loadOrders();
      setFeedbackMessage(`Order #${orderId} served to Table ${tableId}!`);
      setShowSuccessFeedback(true);
      setTimeout(() => setShowSuccessFeedback(false), 3000);
    }
  };

  const getMenuItemName = (menuItemId: number) => {
    const item = MOCK_MENU_ITEMS.find((m) => m.id === menuItemId);
    return item ? item.name : `Item #${menuItemId}`;
  };

  const stats = {
    ready: orders.length,
  };

  return (
    <Layout>
      <div className="serve-orders">
        <div className="page-header">
          <h1>
            <IoRestaurantOutline className="title-icon" />
            Serve Orders
          </h1>
          <p>Take prepared orders and serve them to tables</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card highlight">
            <div className="stat-value">{stats.ready}</div>
            <div className="stat-label">Ready to Serve</div>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="empty-state">No orders ready to serve</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={`order-card status-${order.status.toLowerCase()}`}>
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-table">Table {order.tableId}</div>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {getMenuItemName(item.menuItemId)} - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="amount">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="order-time">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {/* Serve Button */}
                <div className="order-actions">
                  <button
                    className="serve-btn"
                    onClick={() => handleServeOrder(order.id, order.tableId)}
                    disabled={order.status !== 'READY'}
                  >
                    {order.status === 'READY' ? (
                      <>
                        <IoCheckmarkCircle className="btn-icon" />
                        Mark as Served
                      </>
                    ) : (
                      <>
                        <IoTimeOutline className="btn-icon" />
                        Preparing
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Success Feedback */}
        {showSuccessFeedback && (
          <div className="success-toast">
            {feedbackMessage}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServeOrders;
