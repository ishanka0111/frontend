/**
 * Customer Dashboard - Main hub for customer features
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components';
import './CustomerDashboard.css';

const CustomerDashboard: React.FC = () => {
  const { user, tableId } = useAuth();

  return (
    <Layout>
      <div className="customer-dashboard">
        <div className="dashboard-header">
          <h1>Welcome, {user?.fullName || 'Guest'}!</h1>
          {tableId && <p className="table-info">📍 Table {tableId}</p>}
        </div>

        <div className="dashboard-grid">
          <Link to="/menu" className="dashboard-card">
            <div className="card-icon">🍽️</div>
            <h3>Browse Menu</h3>
            <p>Explore our delicious offerings</p>
          </Link>

          <Link to="/cart" className="dashboard-card">
            <div className="card-icon">🛒</div>
            <h3>My Cart</h3>
            <p>Review and place your order</p>
          </Link>

          <Link to="/orders" className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>My Orders</h3>
            <p>Track current and past orders</p>
          </Link>

          <Link to="/profile" className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Profile</h3>
            <p>Manage your account</p>
          </Link>

          <div className="dashboard-card info-card">
            <div className="card-icon">💬</div>
            <h3>Need Help?</h3>
            <p>Chat with our AI assistant (Coming Soon)</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
