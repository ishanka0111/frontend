/**
 * Admin Dashboard - Restaurant management hub
 */

import React, { useState, useEffect } from 'react';
import {
  IoBarChartOutline,
  IoCashOutline,
  IoCubeOutline,
  IoListOutline,
  IoPeopleOutline,
  IoPricetagOutline,
  IoTrendingUpOutline,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components';
import { getActiveOrders } from '../../api/orders';
import { MOCK_MENU_ITEMS, MOCK_ORDERS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  const loadStats = async () => {
    try {
      const orders = await getActiveOrders();
      setActiveOrders(orders);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const calculateStats = () => {
    const totalActiveOrders = activeOrders.length;
    const staffOnline = 8; // Mock: 2 kitchen + 2 waiter + 1 admin + 3 others
    
    // Calculate today's revenue from PAID orders
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = MOCK_ORDERS
      .filter(o => o.status === 'PAID' && o.createdAt.startsWith(today))
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    const totalMenuItems = MOCK_MENU_ITEMS.filter(i => i.isActive).length;

    return {
      activeOrders: totalActiveOrders,
      staffOnline,
      todayRevenue: todayRevenue.toFixed(2),
      menuItems: totalMenuItems
    };
  };

  const stats = calculateStats();

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p className="welcome-text">Welcome back, {user?.fullName}!</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/admin/cashier" className="dashboard-card admin-card cashier-highlight">
            <div className="card-icon">
              <IoCashOutline />
            </div>
            <h3>Cashier - Receive Cash</h3>
            <p>Scan waiter QR codes and receive cash</p>
          </Link>

          <Link to="/admin/staff" className="dashboard-card admin-card">
            <div className="card-icon">
              <IoPeopleOutline />
            </div>
            <h3>Staff Management</h3>
            <p>Manage kitchen staff and waiters</p>
          </Link>

          <Link to="/admin/menu" className="dashboard-card admin-card">
            <div className="card-icon">
              <IoListOutline />
            </div>
            <h3>Menu Management</h3>
            <p>Add, edit, and remove menu items</p>
          </Link>

          <Link to="/admin/categories" className="dashboard-card admin-card">
            <div className="card-icon">
              <IoPricetagOutline />
            </div>
            <h3>Category Management</h3>
            <p>Organize menu categories</p>
          </Link>

          <Link to="/admin/inventory" className="dashboard-card admin-card">
            <div className="card-icon">
              <IoCubeOutline />
            </div>
            <h3>Inventory</h3>
            <p>Track stock levels and reorders</p>
          </Link>

          <Link to="/admin/orders" className="dashboard-card admin-card">
            <div className="card-icon">
              <IoBarChartOutline />
            </div>
            <h3>Order Overview</h3>
            <p>Monitor all restaurant orders</p>
          </Link>

          <Link to="/admin/analytics" className="dashboard-card admin-card">
            <div className="card-icon">
              <IoTrendingUpOutline />
            </div>
            <h3>Analytics</h3>
            <p>Sales reports and insights</p>
          </Link>
        </div>

        <div className="quick-stats">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.activeOrders}</div>
              <div className="stat-label">Active Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.staffOnline}</div>
              <div className="stat-label">Staff Online</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${stats.todayRevenue}</div>
              <div className="stat-label">Today's Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.menuItems}</div>
              <div className="stat-label">Menu Items</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
