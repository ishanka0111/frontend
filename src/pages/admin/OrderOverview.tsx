/**
 * Order Overview - Admin view of all restaurant orders
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, OrderStatsRow, OrderStatusFilter } from '../../components';
import type { StatItem } from '../../components/OrderStatsRow';
import type { FilterOption } from '../../components/OrderStatusFilter';
import { MOCK_ORDERS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import { getOrderStatusBadgeClass } from '../../utils/orderHelpers';
import './OrderOverview.css';

const OrderOverview: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrders = () => {
    // Sort by most recent first
    const sorted = [...MOCK_ORDERS].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sorted);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.tableId.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    placed: orders.filter((o) => o.status === 'PLACED').length,
    preparing: orders.filter((o) => o.status === 'PREPARING').length,
    ready: orders.filter((o) => o.status === 'READY').length,
    served: orders.filter((o) => o.status === 'SERVED').length,
    paid: orders.filter((o) => o.status === 'PAID').length,
    totalRevenue: orders
      .filter((o) => o.status === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const statsData: StatItem[] = [
    { value: stats.total, label: 'Total Orders' },
    { value: stats.placed, label: 'Placed' },
    { value: stats.preparing, label: 'Preparing' },
    { value: stats.ready, label: 'Ready' },
    { value: stats.served, label: 'Served' },
    { value: `$${stats.totalRevenue.toFixed(2)}`, label: 'Total Revenue (Paid)', highlight: true },
  ];

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'PLACED', label: 'Placed' },
    { value: 'PREPARING', label: 'Preparing' },
    { value: 'READY', label: 'Ready' },
    { value: 'SERVED', label: 'Served' },
    { value: 'PAID', label: 'Paid' },
  ];

  const getStatusColor = (status: Order['status']) => {
    // Use shared helper for consistent badge styling
    return getOrderStatusBadgeClass(status);
  };

  return (
    <Layout>
      <div className="order-overview">
        <div className="page-header">
          <h1>📊 Order Overview</h1>
        </div>

        {/* Stats Cards */}
        <OrderStatsRow stats={statsData} />

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="🔍 Search by Order ID or Table..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <OrderStatusFilter 
            options={filterOptions}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td>Table {order.tableId}</td>
                    <td>{order.items.length} items</td>
                    <td className="order-total">${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: getStatusColor(order.status),
                          color: 'white',
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <Link to={`/orders/${order.id}`} className="view-btn">
                        👁️ View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default OrderOverview;
