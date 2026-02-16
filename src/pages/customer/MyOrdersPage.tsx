/**
 * My Orders Page - Customer order history
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layout, Button, LoadingSpinner, OrderCard } from '../../components';
import { MOCK_ORDERS } from '../../services/mockDataGenerator';
import type { Order } from '../../services/mockDataGenerator';
import './MyOrdersPage.css';

const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      // Filter orders by current user
      const userOrders = MOCK_ORDERS
        .filter(order => order.customerId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['PLACED', 'PREPARING', 'READY'].includes(order.status);
    if (filter === 'completed') return ['SERVED', 'PAID'].includes(order.status);
    return true;
  });

  if (isLoading) {
    return (
      <Layout title="My Orders">
        <div className="my-orders-page">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Orders">
      <div className="my-orders-page">
        <div className="my-orders-container">
          <div className="my-orders-header">
            <h1>My Orders</h1>
            <p className="my-orders-subtitle">Track and view your order history</p>
          </div>

          {/* Filter Tabs */}
          <div className="order-filters">
            <button
              className={`filter-tab ${filter === 'all' ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button
              className={`filter-tab ${filter === 'active' ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({orders.filter(o => ['PLACED', 'PREPARING', 'READY'].includes(o.status)).length})
            </button>
            <button
              className={`filter-tab ${filter === 'completed' ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({orders.filter(o => ['SERVED', 'PAID'].includes(o.status)).length})
            </button>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="my-orders-empty">
              <div className="my-orders-empty__icon">📋</div>
              <h2>No Orders Found</h2>
              <p>You haven't placed any orders yet</p>
              <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showTable={true}
                  showTotal={true}
                  showEstimatedTime={true}
                  showDate={true}
                  actionButton={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrdersPage;
