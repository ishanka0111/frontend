/**
 * Profile Page - User profile management with interactive UI
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../api/auth';
import { Button, Layout, Modal } from '../../components';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });

  const handleEdit = () => {
    setError('');
    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    });
    setShowEditModal(true);
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setError('');
    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    });
  };

  const handleSave = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!formData.fullName.trim()) {
        setError('Full name is required');
        setIsLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        setError('Phone number is required');
        setIsLoading(false);
        return;
      }

      await updateProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      await refreshUser();
      setShowEditModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // In production, this would call a delete account API
    console.log('Account deletion requested');
    setShowDeleteModal(false);
    // For now, just show a message
    alert('Account deletion would be processed here. This is a demo.');
  };

  const handleChangePassword = () => {
    // Navigate to change password page or open password modal
    alert('Change password feature would open here. This is a demo.');
  };

  const getRoleLabel = (role?: number): string => {
    if (role === 1) return 'Customer';
    if (role === 2) return 'Admin';
    if (role === 3) return 'Kitchen Staff';
    return 'Unknown';
  };

  return (
    <Layout title="My Profile">
      <div className="profile-page">
        <div className="profile-container">
          {/* Profile Header Card */}
          <div className="profile-header-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">{user?.fullName}</h1>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role-badge">
                {getRoleLabel(user?.role)}
              </span>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="profile-details-card">
            <h2 className="section-title">Profile Information</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Full Name</label>
                <p className="info-value">{user?.fullName}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Email Address</label>
                <p className="info-value">{user?.email}</p>
                <span className="info-badge">Verified</span>
              </div>

              <div className="info-item">
                <label className="info-label">Phone Number</label>
                <p className="info-value">{user?.phone || 'Not provided'}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Account Role</label>
                <p className="info-value">{getRoleLabel(user?.role)}</p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="profile-actions-card">
            <h2 className="section-title">Account Actions</h2>
            
            <div className="actions-grid">
              <button className="action-button action-primary" onClick={handleEdit}>
                <span className="action-icon">✏️</span>
                <div className="action-content">
                  <h3>Edit Profile</h3>
                  <p>Update your personal information</p>
                </div>
              </button>

              <button className="action-button action-secondary" onClick={handleChangePassword}>
                <span className="action-icon">🔒</span>
                <div className="action-content">
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                </div>
              </button>

              <button className="action-button action-danger" onClick={handleDeleteAccount}>
                <span className="action-icon">🗑️</span>
                <div className="action-content">
                  <h3>Delete Account</h3>
                  <p>Permanently remove your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={handleCancel}
          title="Edit Profile"
          size="md"
        >
          <div className="modal-form">
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="edit-fullname" className="form-label">Full Name *</label>
              <input
                id="edit-fullname"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email" className="form-label">Email Address</label>
              <input
                id="edit-email"
                type="email"
                value={user?.email}
                disabled
                className="form-input form-input-disabled"
              />
              <p className="form-hint">Email cannot be changed</p>
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone" className="form-label">Phone Number *</label>
              <input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="modal-actions">
              <Button 
                variant="primary" 
                onClick={handleSave}
                isLoading={isLoading}
              >
                Save Changes
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
          size="sm"
        >
          <div className="modal-confirm">
            <div className="confirm-icon confirm-icon-danger">⚠️</div>
            <h3 className="confirm-title">Are you sure?</h3>
            <p className="confirm-message">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="modal-actions">
              <Button 
                variant="primary" 
                onClick={confirmDelete}
                style={{ backgroundColor: '#ef4444' }}
              >
                Yes, Delete
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Success!"
          size="sm"
        >
          <div className="modal-success">
            <div className="success-icon">✅</div>
            <h3 className="success-title">Profile Updated</h3>
            <p className="success-message">
              Your profile has been successfully updated!
            </p>
            <div className="modal-actions">
              <Button 
                variant="primary" 
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default ProfilePage;

