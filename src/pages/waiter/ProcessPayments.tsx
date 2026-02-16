/**
 * Process Payments - Handle cash and card payments
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { MOCK_ORDERS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import './ProcessPayments.css';

const ProcessPayments: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH');
  const [discount, setDiscount] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const served = MOCK_ORDERS.filter((o) => o.status === 'SERVED');
    setOrders(served);
  };

  const handlePayment = () => {
    if (!selectedOrder) return;

    setOrders(
      orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: 'PAID' as const } : o
      )
    );

    alert(
      `Payment processed! \nMethod: ${paymentMethod}\nAmount: $${(selectedOrder.totalAmount - discount + tipAmount).toFixed(2)}`
    );
    setSelectedOrder(null);
    setDiscount(0);
    setTipAmount(0);
    loadOrders();
  };

  const finalAmount = selectedOrder
    ? Math.max(0, selectedOrder.totalAmount - discount + tipAmount)
    : 0;

  const stats = {
    servedOrders: orders.length,
    totalRevenue: orders
      .filter((o) => o.status === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <Layout>
      <div className="process-payments">
        <div className="page-header">
          <h1>💰 Process Payments</h1>
          <p>Handle cash and card payments</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.servedOrders}</div>
            <div className="stat-label">Ready for Payment</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Revenue Today</div>
          </div>
        </div>

        <div className="payment-container">
          {/* Orders List */}
          <div className="orders-section">
            <h2>Orders Ready for Payment</h2>
            {orders.length === 0 ? (
              <p className="empty-state">No orders waiting for payment</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    role="button"
                    tabIndex={0}
                    className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedOrder(order)}
                  >
                    <div className="order-header">
                      <div className="order-id">Order #{order.id}</div>
                      <div className="order-table">Table {order.tableId}</div>
                    </div>
                    <div className="order-amount">${order.totalAmount.toFixed(2)}</div>
                    <div className="item-count">{order.items.length} items</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Form */}
          {selectedOrder && (
            <div className="payment-form">
              <h2>Payment Details</h2>

              {/* Order Info */}
              <div className="info-box">
                <div className="info-row">
                  <span>Order ID:</span>
                  <span className="value">#{selectedOrder.id}</span>
                </div>
                <div className="info-row">
                  <span>Table:</span>
                  <span className="value">{selectedOrder.tableId}</span>
                </div>
                <div className="info-row">
                  <span>Items:</span>
                  <span className="value">{selectedOrder.items.length}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-group">
                <span className="form-label">Payment Method:</span>
                <div className="payment-methods">
                  <button
                    className={`method-btn ${paymentMethod === 'CASH' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('CASH')}
                  >
                    💵 Cash
                  </button>
                  <button
                    className={`method-btn ${paymentMethod === 'CARD' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    💳 Card
                  </button>
                </div>
              </div>

              {/* Amounts */}
              <div className="form-group">
                <span className="form-label">Subtotal:</span>
                <div className="amount-display">${selectedOrder.totalAmount.toFixed(2)}</div>
              </div>

              <div className="form-group">
                <label htmlFor="discount-input">Discount ($):</label>
                <input
                  id="discount-input"
                  type="number"
                  min="0"
                  max={selectedOrder.totalAmount}
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Number.parseFloat(e.target.value) || 0))}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tip-input">Tip ($):</label>
                <input
                  id="tip-input"
                  type="number"
                  min="0"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(Math.max(0, Number.parseFloat(e.target.value) || 0))}
                  placeholder="0.00"
                />
              </div>

              {/* Total */}
              <div className="total-amount">
                <span>Total Amount:</span>
                <span className="amount">${finalAmount.toFixed(2)}</span>
              </div>

              {/* Action Button */}
              <button className="payment-btn" onClick={handlePayment}>
                {paymentMethod === 'CASH' ? '✓ Confirm Payment' : '💳 Process Card'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProcessPayments;
