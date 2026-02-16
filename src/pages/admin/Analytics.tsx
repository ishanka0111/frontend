/**
 * Analytics - Admin sales reports and insights
 */

import React from 'react';
import { Layout } from '../../components';
import { MOCK_ORDERS } from '../../services/mockDataGenerator';
import './Analytics.css';

const Analytics: React.FC = () => {
  const paidOrders = MOCK_ORDERS.filter((o) => o.status === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0;

  const ordersByStatus = MOCK_ORDERS.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topTables = MOCK_ORDERS.reduce((acc, order) => {
    acc[order.tableId] = (acc[order.tableId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const topTableList = Object.entries(topTables)
    .map(([table, count]) => ({ table, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalOrders = MOCK_ORDERS.length;
  const activeOrders = MOCK_ORDERS.filter(
    (o) => o.status === 'PLACED' || o.status === 'PREPARING' || o.status === 'READY'
  ).length;

  return (
    <Layout>
      <div className="analytics-page">
        <div className="page-header">
          <h1>📈 Analytics & Reports</h1>
          <p>Key performance metrics and sales insights</p>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-value">${totalRevenue.toFixed(2)}</div>
            <div className="kpi-label">Total Revenue</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">{totalOrders}</div>
            <div className="kpi-label">Total Orders</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">${avgOrderValue.toFixed(2)}</div>
            <div className="kpi-label">Avg Order Value</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">{activeOrders}</div>
            <div className="kpi-label">Active Orders</div>
          </div>
        </div>

        {/* Charts & Reports */}
        <div className="reports-grid">
          <div className="report-card">
            <h3>Orders by Status</h3>
            <div className="status-list">
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <div key={status} className="status-row">
                  <span className="status-name">{status}</span>
                  <div className="status-bar">
                    <div
                      className="status-fill"
                      style={{
                        width: `${(count / totalOrders) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="report-card">
            <h3>Top Performing Tables</h3>
            <div className="top-tables">
              {topTableList.map((table, index) => (
                <div key={table.table} className="table-row">
                  <span className="rank">#{index + 1}</span>
                  <span className="table-name">Table {table.table}</span>
                  <span className="table-count">{table.count} orders</span>
                </div>
              ))}
            </div>
          </div>

          <div className="report-card full-width">
            <h3>Revenue Overview</h3>
            <div className="revenue-chart">
              {paidOrders.slice(0, 10).map((order) => (
                <div key={order.id} className="revenue-bar">
                  <div className="bar-label">#{order.id}</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(order.totalAmount / 100) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="bar-value">${order.totalAmount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
