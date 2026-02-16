/**
 * Customer Bottom Navigation - Mobile-style bottom nav for customers
 */

import React, { useState } from 'react';
import {
  IoSearchOutline,
  IoCartOutline,
  IoPersonOutline,
  IoClose,
  IoShareSocialOutline,
  IoCopyOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useRole } from '../../hooks/useRole';
import './CustomerBottomNav.css';

const CustomerBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openCart, isCartOpen } = useCart();
  const { isCustomer } = useRole();
  const [showProfile, setShowProfile] = useState(false);
  const referralCode = `REF${user?.id}2024`;

  if (!isCustomer) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenCart = () => {
    setShowProfile(false);
    openCart();
  };

  return (
    <>
      <nav className="customer-bottom-nav">
        <Link
          to="/menu"
          className={`nav-item ${isActive('/menu') ? 'active' : ''}`}
          title="Browse Menu"
        >
          <IoSearchOutline className="nav-icon" />
          <span className="nav-label">Browse</span>
        </Link>

        <button
          onClick={handleOpenCart}
          className={`nav-item ${isCartOpen ? 'active' : ''}`}
          title="My Cart"
        >
          <IoCartOutline className="nav-icon" />
          <span className="nav-label">Baskets</span>
        </button>

        <button
          className={`nav-item ${showProfile ? 'active' : ''}`}
          onClick={() => setShowProfile(!showProfile)}
          title="Account"
        >
          <IoPersonOutline className="nav-icon" />
          <span className="nav-label">Account</span>
        </button>
      </nav>

      {/* Profile and Referral Overlay */}
      {showProfile && (
        <div className="profile-overlay">
          <div className="profile-panel">
            <div className="profile-header">
              <h3>Account</h3>
              <button
                className="close-btn"
                onClick={() => setShowProfile(false)}
              >
                <IoClose />
              </button>
            </div>

            <div className="profile-content">
              {/* User Profile Card */}
              <div className="profile-card">
                <div className="profile-avatar">
                  <IoPersonOutline />
                </div>
                <div className="profile-info">
                  <h4>{user?.fullName}</h4>
                  <p>{user?.email}</p>
                  <p className="phone">{user?.phone}</p>
                </div>
              </div>

              {/* Referral Section */}
              <div className="referral-section">
                <div className="referral-header">
                  <IoShareSocialOutline className="referral-icon" />
                  <h5>Referral Code</h5>
                </div>
                <div className="referral-code-container">
                  <code className="referral-code">{referralCode}</code>
                  <button
                    className="copy-btn"
                    onClick={handleCopyReferral}
                    title="Copy referral code"
                  >
                    <IoCopyOutline />
                  </button>
                </div>
                <p className="referral-text">
                  Share your code and earn rewards!
                </p>
              </div>

              {/* Quick Links */}
              <div className="quick-links">
                <Link to="/profile" className="quick-link">
                  <IoPersonOutline /> Edit Profile
                </Link>
                <Link to="/orders" className="quick-link">
                  <IoCartOutline /> My Orders
                </Link>
              </div>

              {/* Logout Button */}
              <button className="logout-btn" onClick={handleLogout}>
                <IoLogOutOutline className="logout-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerBottomNav;
