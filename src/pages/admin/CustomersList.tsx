/**
 * Customers List - View all registered customers with their status
 */

import React, { useState } from 'react';
import { Layout } from '../../components';
import './CustomersList.css';

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

// Mock customer data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    fullName: 'John Customer',
    email: 'john@example.com',
    phone: '+1234567890',
    status: 'ACTIVE',
    totalOrders: 15,
    totalSpent: 450.00,
    lastOrderDate: '2026-02-15',
    createdAt: '2026-01-10',
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    status: 'ACTIVE',
    totalOrders: 8,
    totalSpent: 320.50,
    lastOrderDate: '2026-02-14',
    createdAt: '2026-01-15',
  },
  {
    id: 3,
    fullName: 'Bob Johnson',
    email: 'bob.j@example.com',
    phone: '+1234567892',
    status: 'INACTIVE',
    totalOrders: 3,
    totalSpent: 85.00,
    lastOrderDate: '2025-12-20',
    createdAt: '2025-11-05',
  },
  {
    id: 4,
    fullName: 'Alice Williams',
    email: 'alice.w@example.com',
    phone: '+1234567893',
    status: 'ACTIVE',
    totalOrders: 22,
    totalSpent: 680.75,
    lastOrderDate: '2026-02-16',
    createdAt: '2025-10-12',
  },
  {
    id: 5,
    fullName: 'Charlie Brown',
    email: 'charlie.b@example.com',
    status: 'BLOCKED',
    totalOrders: 5,
    totalSpent: 120.00,
    lastOrderDate: '2026-01-08',
    createdAt: '2025-12-01',
  },
];

const CustomersList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (customerId: number) => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id !== customerId) return customer;
        
        let newStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
        if (customer.status === 'ACTIVE') {
          newStatus = 'INACTIVE';
        } else if (customer.status === 'INACTIVE') {
          newStatus = 'ACTIVE';
        } else {
          newStatus = 'BLOCKED';
        }
        
        return { ...customer, status: newStatus };
      })
    );
  };

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === 'ACTIVE').length,
    inactive: customers.filter((c) => c.status === 'INACTIVE').length,
    blocked: customers.filter((c) => c.status === 'BLOCKED').length,
  };

  return (
    <Layout>
      <div className="customers-list">
        <div className="page-header">
          <h1>👥 Customers List</h1>
          <p>View all registered customers and manage their status</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Customers</div>
          </div>
          <div className="stat-card active">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card inactive">
            <div className="stat-value">{stats.inactive}</div>
            <div className="stat-label">Inactive</div>
          </div>
          <div className="stat-card blocked">
            <div className="stat-value">{stats.blocked}</div>
            <div className="stat-label">Blocked</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="🔍 Search customers..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="status-filters">
            <button
              className={`filter-btn ${statusFilter === null ? 'active' : ''}`}
              onClick={() => setStatusFilter(null)}
            >
              All Status
            </button>
            <button
              className={`filter-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${statusFilter === 'INACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('INACTIVE')}
            >
              Inactive
            </button>
            <button
              className={`filter-btn ${statusFilter === 'BLOCKED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('BLOCKED')}
            >
              Blocked
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="customers-table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Joined Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="customer-name">{customer.fullName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${customer.status.toLowerCase()}`}>
                        {customer.status === 'ACTIVE' && '✓ Active'}
                        {customer.status === 'INACTIVE' && '○ Inactive'}
                        {customer.status === 'BLOCKED' && '✖ Blocked'}
                      </span>
                    </td>
                    <td className="text-center">{customer.totalOrders}</td>
                    <td className="text-money">${customer.totalSpent.toFixed(2)}</td>
                    <td>
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="toggle-status-btn"
                        onClick={() => handleToggleStatus(customer.id)}
                      >
                        Toggle Status
                      </button>
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

export default CustomersList;
