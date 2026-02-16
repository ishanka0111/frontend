/**
 * Waiter Order Overview - Track all active orders
 */

import React, { useMemo, useState } from 'react';
import { IoListOutline } from 'react-icons/io5';
import { Layout, OrderStatsRow, OrderStatusFilter } from '../../components';
import type { StatItem } from '../../components/OrderStatsRow';
import type { FilterOption } from '../../components/OrderStatusFilter';
import { MOCK_ORDERS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import { getOrderStatusBadgeClass } from '../../utils/orderHelpers';
import { getMenuItemNameById } from '../../utils/menuHelpers';
import './WaiterOrderOverview.css';

const WaiterOrderOverview: React.FC = () => {
  const orders = useMemo(
    () =>
      [...MOCK_ORDERS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    []
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'PREPARING' | 'READY' | 'SERVED'>('all');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const stats = {
    preparing: orders.filter((o) => o.status === 'PREPARING').length,
    ready: orders.filter((o) => o.status === 'READY').length,
    served: orders.filter((o) => o.status === 'SERVED').length,
    total: orders.length,
  };

  const statsData: StatItem[] = [
    { value: stats.preparing, label: 'Preparing' },
    { value: stats.ready, label: 'Ready' },
    { value: stats.served, label: 'Served' },
    { value: stats.total, label: 'Total Active' },
  ];

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'PREPARING', label: 'Preparing', count: stats.preparing },
    { value: 'READY', label: 'Ready', count: stats.ready },
    { value: 'SERVED', label: 'Served', count: stats.served },
  ];

  const getStatusColor = (status: Order['status']) => {
    // Use shared helper for consistent badge styling
    return getOrderStatusBadgeClass(status);
  };

  return (
    <Layout>
      <div className="waiter-order-overview">
        <div className="page-header">
          <h1>
            <IoListOutline className="title-icon" />
            Order Overview
          </h1>
          <p>Track all active orders and their status</p>
        </div>

        {/* Stats */}
        <OrderStatsRow stats={statsData} />

        {/* Filters */}
        <OrderStatusFilter 
          options={filterOptions}
          activeFilter={statusFilter}
          onFilterChange={(value) => setStatusFilter(value as typeof statusFilter)}
        />

        {/* Orders List */}
        <div className="orders-container">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders matching the selected filter</p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`order-card ${getStatusColor(order.status)}`}
                >
                  <div className="order-header">
                    <div className="order-id">Order #{order.id}</div>
                    <div className="status-badge">
                      <span className={`badge-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="order-table">
                    <span className="label">Table:</span>
                    <span className="value">{order.tableId}</span>
                  </div>

                  <div className="order-items">
                    <h4>Items ({order.items.length})</h4>
                    <ul>
                      {order.items.slice(0, 3).map((item) => (
                        <li key={item.menuItemId}>
                          {item.quantity}x {getMenuItemNameById(item.menuItemId)}
                        </li>
                      ))}
                      {order.items.length > 3 && <li>+{order.items.length - 3} more</li>}
                    </ul>
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="amount">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="order-time">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WaiterOrderOverview;
