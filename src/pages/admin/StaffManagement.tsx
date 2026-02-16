/**
 * Staff Management - Manage restaurant staff (kitchen, waiters, admins)
 */

import React, { useMemo, useState } from 'react';
import {
  IoAddCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCreateOutline,
  IoPauseCircle,
  IoPeopleOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { Layout } from '../../components';
import { MOCK_USERS } from '../../services/mockDataGenerator';
import type { UserProfile } from '../../types';
import './StaffManagement.css';

interface StaffMember extends UserProfile {
  status?: 'active' | 'inactive';
}

const ROLE_NAMES: Record<number, string> = {
  1: 'Customer',
  2: 'Admin',
  3: 'Kitchen Staff',
  4: 'Waiter',
};

const StaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => [
    { ...MOCK_USERS.admin, status: 'active' },
    { ...MOCK_USERS.kitchen, status: 'active' },
    { ...MOCK_USERS.waiter, status: 'active' },
    {
      id: 2002,
      fullName: 'Michael Brown',
      email: 'michael@restaurant.com',
      role: 2,
      phone: '555-0202',
      createdAt: new Date('2024-02-01').toISOString(),
      status: 'active',
    },
    {
      id: 3002,
      fullName: 'Lisa Garcia',
      email: 'lisa@restaurant.com',
      role: 3,
      phone: '555-0302',
      createdAt: new Date('2024-03-01').toISOString(),
      status: 'active',
    },
    {
      id: 3003,
      fullName: 'James Wilson',
      email: 'james@restaurant.com',
      role: 3,
      phone: '555-0303',
      createdAt: new Date('2024-03-15').toISOString(),
      status: 'inactive',
    },
    {
      id: 4002,
      fullName: 'Jennifer Lee',
      email: 'jennifer@restaurant.com',
      role: 4,
      phone: '555-0402',
      createdAt: new Date('2024-04-01').toISOString(),
      status: 'active',
    },
    {
      id: 4003,
      fullName: 'David Martinez',
      email: 'david@restaurant.com',
      role: 4,
      phone: '555-0403',
      createdAt: new Date('2024-04-10').toISOString(),
      status: 'active',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 3,
  });

  const filteredStaff = useMemo(() => {
    let filtered = [...staffList];

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== null) {
      filtered = filtered.filter((s) => s.role === roleFilter);
    }

    return filtered;
  }, [searchTerm, roleFilter, staffList]);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: 3,
    });
    setShowModal(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone || '',
      role: staff.role,
    });
    setShowModal(true);
  };

  const handleDeleteStaff = (staffId: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaffList(staffList.filter((s) => s.id !== staffId));
    }
  };

  const handleToggleStatus = (staffId: number) => {
    setStaffList(
      staffList.map((s) =>
        s.id === staffId
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStaff) {
      // Update existing staff
      setStaffList(
        staffList.map((s) =>
          s.id === editingStaff.id
            ? {
                ...s,
                ...formData,
              }
            : s
        )
      );
    } else {
      // Add new staff
      const newStaff: StaffMember = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      setStaffList([...staffList, newStaff]);
    }

    setShowModal(false);
  };

  const stats = {
    total: staffList.length,
    active: staffList.filter((s) => s.status === 'active').length,
    admins: staffList.filter((s) => s.role === 2).length,
    kitchen: staffList.filter((s) => s.role === 3).length,
    waiters: staffList.filter((s) => s.role === 4).length,
  };

  return (
    <Layout>
      <div className="staff-management">
        <div className="page-header">
          <h1>
            <IoPeopleOutline className="title-icon" />
            Staff Management
          </h1>
          <button className="btn btn-primary" onClick={handleAddStaff}>
            <IoAddCircle className="btn-icon" />
            Add Staff Member
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Staff</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.admins}</div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.kitchen}</div>
            <div className="stat-label">Kitchen</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.waiters}</div>
            <div className="stat-label">Waiters</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="role-filters">
            <button
              className={`filter-btn ${roleFilter === null ? 'active' : ''}`}
              onClick={() => setRoleFilter(null)}
            >
              All Roles
            </button>
            <button
              className={`filter-btn ${roleFilter === 2 ? 'active' : ''}`}
              onClick={() => setRoleFilter(2)}
            >
              Admins
            </button>
            <button
              className={`filter-btn ${roleFilter === 3 ? 'active' : ''}`}
              onClick={() => setRoleFilter(3)}
            >
              Kitchen
            </button>
            <button
              className={`filter-btn ${roleFilter === 4 ? 'active' : ''}`}
              onClick={() => setRoleFilter(4)}
            >
              Waiters
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="staff-table-container">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No staff members found
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="staff-name">{staff.fullName}</td>
                    <td>{staff.email}</td>
                    <td>{staff.phone || 'N/A'}</td>
                    <td>
                      <span className={`role-badge role-${staff.role}`}>
                        {ROLE_NAMES[staff.role]}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-badge status-${staff.status}`}
                        onClick={() => handleToggleStatus(staff.id)}
                        title="Click to toggle status"
                      >
                        {staff.status === 'active' ? (
                          <>
                            <IoCheckmarkCircle className="status-icon" />
                            Active
                          </>
                        ) : (
                          <>
                            <IoPauseCircle className="status-icon" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td>{new Date(staff.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditStaff(staff)}
                        title="Edit"
                      >
                        <IoCreateOutline />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteStaff(staff.id)}
                        title="Delete"
                      >
                        <IoTrashOutline />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <IoCloseCircle />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@restaurant.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="555-0000"
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: Number(e.target.value) })
                    }
                  >
                    <option value={2}>Admin</option>
                    <option value={3}>Kitchen Staff</option>
                    <option value={4}>Waiter</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingStaff ? 'Update' : 'Add'} Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StaffManagement;
