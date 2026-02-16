/**
 * Re usable Header Component with Navigation
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoRestaurant, IoLocationSharp, IoWarning, IoCart } from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
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
  const { itemCount, openCart } = useCart();
  const { isCustomer, isAdmin, isKitchen, isWaiter, roleName } = useRole();
  const navigate = useNavigate();

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
          {showNavigation && user && (
            <nav className="header__nav">
              {isCustomer && (
                <>
                  <Link to="/menu" className="header__nav-link">Menu</Link>
                  <Link to="/orders" className="header__nav-link">Orders</Link>
                  <Link to="/profile" className="header__nav-link">Profile</Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin" className="header__nav-link">Dashboard</Link>
                  <Link to="/admin/customers" className="header__nav-link">Customers</Link>
                  <Link to="/admin/staff" className="header__nav-link">Staff</Link>
                  <Link to="/admin/menu" className="header__nav-link">Menu</Link>
                  <Link to="/admin/inventory" className="header__nav-link">Inventory</Link>
                  <Link to="/profile" className="header__nav-link">Profile</Link>
                </>
              )}
              {isKitchen && (
                <>
                  <Link to="/kitchen" className="header__nav-link">Kitchen Display</Link>
                  <Link to="/profile" className="header__nav-link">Profile</Link>
                </>
              )}
              {isWaiter && (
                <>
                  <Link to="/waiter" className="header__nav-link">Dashboard</Link>
                  <Link to="/waiter/proxy-order" className="header__nav-link">Take Order</Link>
                  <Link to="/waiter/tables" className="header__nav-link">Tables</Link>
                  <Link to="/profile" className="header__nav-link">Profile</Link>
                </>
              )}
            </nav>
          )}

          {user && (
            <div className="header__user">
              {/* Cart Icon (only for customers) */}
              {isCustomer && (
                <button onClick={openCart} className="header__cart-btn">
                  <IoCart className="header__cart-icon" />
                  {itemCount > 0 && (
                    <span className="header__cart-badge">{itemCount}</span>
                  )}
                </button>
              )}
              
              <span className="header__user-name">
                {user.fullName} <span className="header__user-role">({roleName})</span>
              </span>
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
