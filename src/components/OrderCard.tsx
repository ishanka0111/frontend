/**
 * OrderCard - Reusable order display card component
 * Displays order details in a card format with customizable actions
 */

import React from 'react';
import { IoRestaurantOutline, IoTimeOutline } from 'react-icons/io5';
import type { Order } from '../services/mockDataGenerator';
import { getOrderStatusBadgeClass, getOrderStatusLabel, formatRelativeDate } from '../utils/orderHelpers';
import { getMenuItemNameById } from '../utils/menuHelpers';
import './OrderCard.css';

interface OrderCardProps {
  order: Order;
  showTable?: boolean;
  showTotal?: boolean;
  showEstimatedTime?: boolean;
  showDate?: boolean;
  actionButton?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showTable = true,
  showTotal = true,
  showEstimatedTime = true,
  showDate = true,
  actionButton,
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`order-card ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="order-card__header">
        <div className="order-card__header-left">
          <h3 className="order-id">Order #{order.id}</h3>
          {showDate && (
            <span className="order-date">{formatRelativeDate(order.createdAt)}</span>
          )}
        </div>
        <span className={`status-badge ${getOrderStatusBadgeClass(order.status)}`}>
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="order-card__body">
        {(showTable || showEstimatedTime) && (
          <div className="order-info">
            {showTable && (
              <span className="order-table">
                <IoRestaurantOutline className="status-icon" />
                Table {order.tableId}
              </span>
            )}
            {showEstimatedTime && order.estimatedTime && ['PLACED', 'PREPARING'].includes(order.status) && (
              <span className="order-eta">
                <IoTimeOutline className="status-icon" />
                ~{order.estimatedTime} min
              </span>
            )}
          </div>
        )}

        <div className="order-items">
          {order.items.map((item, idx) => (
            <div key={`${order.id}-${item.menuItemId}-${idx}`} className="order-item">
              <span className="order-item__quantity">{item.quantity}x</span>
              <span className="order-item__name">{getMenuItemNameById(item.menuItemId)}</span>
            </div>
          ))}
        </div>

        {(showTotal || actionButton) && (
          <div className="order-card__footer">
            {showTotal && (
              <div className="order-total">
                <span>Total:</span>
                <span className="order-total__amount">${order.totalAmount.toFixed(2)}</span>
              </div>
            )}
            {actionButton && <div className="order-actions">{actionButton}</div>}
          </div>
        )}
      </div>
    </div>
  );
};
