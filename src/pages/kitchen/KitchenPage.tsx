/**
 * Kitchen Dashboard - Order management for kitchen staff
 */

import React, { useState, useEffect } from 'react';
import {
  IoCheckmarkCircle,
  IoFlameOutline,
  IoNotificationsOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components';
import { getActiveOrders, updateOrderStatus } from '../../api/orders';
import type { Order } from '../../services/mockDataGenerator';
import { getMenuItemNameById } from '../../utils/menuHelpers';
import './KitchenPage.css';

const KitchenPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // Refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const activeOrders = await getActiveOrders();
      setOrders(activeOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(o => o.status === status);
  };

  const placedOrders = getOrdersByStatus('PLACED');
  const preparingOrders = getOrdersByStatus('PREPARING');
  const readyOrders = getOrdersByStatus('READY');

  const calculateStats = () => {
    const totalOrders = orders.length;
    const avgPrepTime = 18; // Mock average
    return { totalOrders, avgPrepTime };
  };

  const stats = calculateStats();

  const renderOrderCard = (order: Order, actionButton: React.ReactNode) => {
    const timeAgo = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    
    return (
      <div key={order.id} className="order-card">
        <div className="order-card-header">
          <span className="order-id">{order.id}</span>
          <span className="order-table">Table {order.tableId}</span>
        </div>
        <div className="order-time">{timeAgo} min ago</div>
        <div className="order-items">
          {order.items.map((item) => (
            <div key={`${order.id}-${item.menuItemId}`} className="order-item">
              <span className="item-quantity">{item.quantity}x</span>
              <span className="item-name">{getMenuItemNameById(item.menuItemId)}</span>
            </div>
          ))}
        </div>
        <div className="order-card-footer">
          {actionButton}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="kitchen-dashboard">
          <div className="dashboard-header">
            <h1>Kitchen Display System</h1>
            <p className="welcome-text">Loading orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="kitchen-dashboard">
        <div className="dashboard-header">
          <h1>Kitchen Display System</h1>
          <p className="welcome-text">Welcome, Chef {user?.fullName}!</p>
        </div>

        <div className="orders-columns">
          {/* New Orders Column */}
          <div className="order-column placed">
            <div className="column-header">
              <h2>
                <IoNotificationsOutline className="title-icon" />
                New Orders
              </h2>
              <span className="count">{placedOrders.length}</span>
            </div>
            <div className="order-list">
              {placedOrders.length > 0 ? (
                placedOrders.map(order => renderOrderCard(order,
                  <button 
                    className="order-action-btn start-btn"
                    onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                  >
                    Start Preparing
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <IoTimeOutline />
                  </div>
                  <p>No new orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Preparing Column */}
          <div className="order-column preparing">
            <div className="column-header">
              <h2>
                <IoFlameOutline className="title-icon" />
                Preparing
              </h2>
              <span className="count">{preparingOrders.length}</span>
            </div>
            <div className="order-list">
              {preparingOrders.length > 0 ? (
                preparingOrders.map(order => renderOrderCard(order,
                  <button 
                    className="order-action-btn ready-btn"
                    onClick={() => handleStatusUpdate(order.id, 'READY')}
                  >
                    Mark Ready
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <IoTimeOutline />
                  </div>
                  <p>No orders in preparation</p>
                </div>
              )}
            </div>
          </div>

          {/* Ready Column */}
          <div className="order-column ready">
            <div className="column-header">
              <h2>
                <IoCheckmarkCircle className="title-icon" />
                Ready
              </h2>
              <span className="count">{readyOrders.length}</span>
            </div>
            <div className="order-list">
              {readyOrders.length > 0 ? (
                readyOrders.map(order => renderOrderCard(order,
                  <div className="order-ready-status">
                    Waiting for pickup
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <IoNotificationsOutline />
                  </div>
                  <p>No orders ready for service</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="kitchen-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Active Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avgPrepTime} min</div>
            <div className="stat-label">Avg Prep Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{preparingOrders.length}</div>
            <div className="stat-label">In Preparation</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KitchenPage;
