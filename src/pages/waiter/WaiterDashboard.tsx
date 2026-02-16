/**
 * Waiter Dashboard - Table service management
 */

import React from 'react';
import {
  IoDocumentTextOutline,
  IoGridOutline,
  IoInformationCircleOutline,
  IoRestaurantOutline,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components';
import './WaiterDashboard.css';

const WaiterDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="waiter-dashboard">
        <div className="dashboard-header">
          <h1>Waiter Dashboard</h1>
          <p className="welcome-text">Welcome, {user?.fullName}!</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/waiter/proxy-order" className="dashboard-card waiter-card">
            <div className="card-icon">
              <IoDocumentTextOutline />
            </div>
            <h3>Proxy Order</h3>
            <p>Take orders with customer name • Collect cash payment</p>
          </Link>

          <Link to="/waiter/serve" className="dashboard-card waiter-card">
            <div className="card-icon">
              <IoRestaurantOutline />
            </div>
            <h3>Serve Orders</h3>
            <p>View prepared orders and serve to tables</p>
          </Link>

          <Link to="/waiter/tables" className="dashboard-card waiter-card">
            <div className="card-icon">
              <IoGridOutline />
            </div>
            <h3>Table Status</h3>
            <p>Manage table status • View assignments</p>
          </Link>

          <div className="dashboard-card info-card">
            <div className="card-icon">
              <IoInformationCircleOutline />
            </div>
            <h3>Payment Note</h3>
            <p>Collected cash → Give to cashier/admin</p>
          </div>
        </div>

        <div className="active-tables">
          <h2>Active Tables</h2>
          <div className="tables-grid">
            <div className="table-card empty">
              <div className="table-number">1</div>
              <div className="table-status">Available</div>
            </div>
            <div className="table-card empty">
              <div className="table-number">2</div>
              <div className="table-status">Available</div>
            </div>
            <div className="table-card empty">
              <div className="table-number">3</div>
              <div className="table-status">Available</div>
            </div>
            <div className="table-card empty">
              <div className="table-number">4</div>
              <div className="table-status">Available</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WaiterDashboard;
