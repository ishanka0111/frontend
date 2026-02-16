/**
 * Re usable Header Component with Navigation
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoRestaurant, IoLocationSharp, IoWarning } from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import Button from '../Button/Button';
import './Header.css';

interface HeaderProps {
  title?: string;
  showNavigation?: boolean;
  showTableId?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Restaurant', 
  showNavigation = true,
  showTableId = false 
}) => {
  const { user, tableId, logout } = useAuth();
  const { isCustomer, isAdmin, isKitchen, isWaiter, roleName } = useRole();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <div className="header__title">
            <IoRestaurant className="header__title-icon" />
            <h1>{title}</h1>
          </div>
          {isCustomer && (
            tableId ? (
              <span className="header__table-badge">
                <IoLocationSharp className="badge-icon" />
                Table {tableId}
              </span>
            ) : (
              <span 
                className="header__table-badge header__table-badge--warning"
                title="Please scan QR code at your table"
              >
                <IoWarning className="badge-icon" />
                Scan QR Code
              </span>
            )
          )}
          {showTableId && !isCustomer && tableId && (
            <span className="header__table-badge">
              <IoLocationSharp className="badge-icon" />
              Table {tableId}
            </span>
          )}
        </div>

        <div className="header__right">
          {showNavigation && user && !isCustomer && (
            <nav className="header__nav">
              {isAdmin && (
                <>
                  <Link to="/admin" className="header__nav-link">Home</Link>
                  <Link to="/admin/customers" className="header__nav-link">Customers</Link>
                  <Link to="/admin/staff" className="header__nav-link">Staff</Link>
                  <Link to="/admin/menu" className="header__nav-link">Menu</Link>
                  <Link to="/admin/inventory" className="header__nav-link">Inventory</Link>
                </>
              )}
              {isKitchen && (
                <>
                  <Link to="/kitchen" className="header__nav-link">Kitchen Display</Link>
                </>
              )}
              {isWaiter && (
                <>
                  <Link to="/waiter" className="header__nav-link">Home</Link>
                  <Link to="/waiter/proxy-order" className="header__nav-link">Take Order</Link>
                  <Link to="/waiter/tables" className="header__nav-link">Tables</Link>
                </>
              )}
            </nav>
          )}

          {user && !isCustomer && (
            <div className="header__user">
              <button 
                onClick={handleProfileClick} 
                className="header__user-name header__user-name--clickable"
                title="View profile"
              >
                {user.fullName} <span className="header__user-role">({roleName})</span>
              </button>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
