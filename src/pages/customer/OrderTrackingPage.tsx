/**
 * Order Tracking Page - Track individual order status
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoDocumentTextOutline,
  IoFlameOutline,
  IoNotificationsOutline,
  IoRestaurantOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, LoadingSpinner } from '../../components';
import { getOrderById } from '../../api/orders';
import { MOCK_MENU_ITEMS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import './OrderTrackingPage.css';

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    try {
      if (!orderId) return;
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
      setError(null);
    } catch (err) {
      setError('Order not found');
      console.error('Failed to load order:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      loadOrder();
      const interval = setInterval(loadOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId, loadOrder]);

  const getMenuItemName = (menuItemId: number): string => {
    const item = MOCK_MENU_ITEMS.find(i => i.id === menuItemId);
    return item ? item.name : 'Unknown Item';
  };

  const getStatusStep = (status: Order['status']) => {
    const steps = {
      PLACED: 1,
      PREPARING: 2,
      READY: 3,
      SERVED: 4,
      PAID: 5,
    };
    return steps[status] || 0;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <Layout title="Order Tracking">
        <div className="order-tracking-page">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout title="Order Tracking">
        <div className="order-tracking-page">
          <div className="tracking-error">
            <div className="tracking-error__icon">
              <IoCloseCircle />
            </div>
            <h2>Order Not Found</h2>
            <p>{error || 'The order you are looking for does not exist'}</p>
            <Button onClick={() => navigate('/orders')}>View My Orders</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <Layout title="Order Tracking">
      <div className="order-tracking-page">
        <div className="tracking-container">
          {/* Success Banner */}
          {currentStep === 1 && (
            <div className="tracking-success-banner">
              <div className="success-icon">
                <IoCheckmarkCircle />
              </div>
              <div>
                <h2>Order Placed Successfully!</h2>
                <p>Your order has been sent to the kitchen</p>
              </div>
            </div>
          )}

          {/* Order Header */}
          <div className="tracking-header">
            <div className="tracking-header__left">
              <h1>Order #{order.id}</h1>
              <p className="tracking-table">
                <IoRestaurantOutline className="status-icon" />
                Table {order.tableId}
              </p>
            </div>
            <div className="tracking-header__right">
              <span className="tracking-time">Placed at {formatTime(order.createdAt)}</span>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="order-progress">
            <div className="progress-steps">
              <div className={`progress-step ${currentStep >= 1 ? 'progress-step--active' : ''} ${currentStep > 1 ? 'progress-step--completed' : ''}`}>
                <div className="progress-step__icon">
                  {currentStep > 1 ? (
                    <IoCheckmarkCircle />
                  ) : (
                    <IoDocumentTextOutline />
                  )}
                </div>
                <div className="progress-step__label">Order Placed</div>
              </div>

              <div className={`progress-line ${currentStep >= 2 ? 'progress-line--active' : ''}`}></div>

              <div className={`progress-step ${currentStep >= 2 ? 'progress-step--active' : ''} ${currentStep > 2 ? 'progress-step--completed' : ''}`}>
                <div className="progress-step__icon">
                  {currentStep > 2 ? (
                    <IoCheckmarkCircle />
                  ) : (
                    <IoFlameOutline />
                  )}
                </div>
                <div className="progress-step__label">Preparing</div>
              </div>

              <div className={`progress-line ${currentStep >= 3 ? 'progress-line--active' : ''}`}></div>

              <div className={`progress-step ${currentStep >= 3 ? 'progress-step--active' : ''} ${currentStep > 3 ? 'progress-step--completed' : ''}`}>
                <div className="progress-step__icon">
                  {currentStep > 3 ? (
                    <IoCheckmarkCircle />
                  ) : (
                    <IoNotificationsOutline />
                  )}
                </div>
                <div className="progress-step__label">Ready</div>
              </div>

              <div className={`progress-line ${currentStep >= 4 ? 'progress-line--active' : ''}`}></div>

              <div className={`progress-step ${currentStep >= 4 ? 'progress-step--active' : ''} ${currentStep > 4 ? 'progress-step--completed' : ''}`}>
                <div className="progress-step__icon">
                  {currentStep > 4 ? (
                    <IoCheckmarkCircle />
                  ) : (
                    <IoRestaurantOutline />
                  )}
                </div>
                <div className="progress-step__label">Served</div>
              </div>
            </div>

            {order.estimatedTime && ['PLACED', 'PREPARING'].includes(order.status) && (
              <div className="estimated-time">
                <span className="estimated-time__icon">
                  <IoTimeOutline />
                </span>
                <span className="estimated-time__text">Estimated time: ~{order.estimatedTime} minutes</span>
              </div>
            )}

            {order.status === 'READY' && (
              <div className="ready-alert">
                <span className="ready-alert__icon">
                  <IoNotificationsOutline />
                </span>
                <span className="ready-alert__text">Your order is ready for pickup!</span>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="tracking-items">
            <h2>Order Details</h2>
            <div className="tracking-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="tracking-item">
                  <div className="tracking-item__main">
                    <span className="tracking-item__quantity">{item.quantity}x</span>
                    <span className="tracking-item__name">{getMenuItemName(item.menuItemId)}</span>
                  </div>
                  <span className="tracking-item__price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="tracking-total">
              <span>Total Amount:</span>
              <span className="tracking-total__amount">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="tracking-actions">
            <Button
              variant="secondary"
              onClick={() => navigate('/menu')}
            >
              Back to Menu
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTrackingPage;
