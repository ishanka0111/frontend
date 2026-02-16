/**
 * Checkout Page - Order placement for customers
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { Layout, Button } from '../../components';
import { placeOrder } from '../../api/orders';
import type { PlaceOrderRequest } from '../../api/orders';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, tableId } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!user || !tableId) {
      setError('Please scan QR code to select a table');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      const orderRequest: PlaceOrderRequest = {
        tableId: String(tableId),
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await placeOrder(user.id, orderRequest);
      
      // Clear cart
      clearCart();
      
      // Navigate to order tracking with order ID
      navigate(`/orders/${response.orderId}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!tableId) {
    return (
      <Layout title="Checkout">
        <div className="checkout-page">
          <div className="checkout-error">
            <div className="checkout-error__icon">❌</div>
            <h2>No Table Selected</h2>
            <p>Please scan a QR code at your table to continue</p>
            <Button onClick={() => navigate('/menu')}>Back to Menu</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout title="Checkout">
        <div className="checkout-page">
          <div className="checkout-error">
            <div className="checkout-error__icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add some delicious items from our menu</p>
            <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout">
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-header">
            <h1>Review Your Order</h1>
            <div className="checkout-table-info">
              <span className="table-badge">Table {tableId}</span>
            </div>
          </div>

          {error && (
            <div className="checkout-error-banner">
              {error}
            </div>
          )}

          {/* Order Items */}
          <div className="checkout-items">
            <h2>Order Items</h2>
            <div className="checkout-items-list">
              {items.map((item, index) => (
                <div key={`${item.id}-${item.notes || index}`} className="checkout-item">
                  <div className="checkout-item__main">
                    <div className="checkout-item__info">
                      <h3 className="checkout-item__name">{item.name}</h3>
                      {item.notes && (
                        <p className="checkout-item__notes">📝 {item.notes}</p>
                      )}
                    </div>
                    <div className="checkout-item__price">
                      <span className="checkout-item__quantity">{item.quantity}x</span>
                      <span className="checkout-item__unit-price">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="checkout-item__total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Service Charge (10%)</span>
              <span>${(totalAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__total">
              <span>Total</span>
              <span>${(totalAmount * 1.1).toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="checkout-actions">
            <Button
              variant="secondary"
              onClick={() => navigate('/menu')}
              disabled={isPlacingOrder}
            >
              Back to Menu
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlaceOrder}
              isLoading={isPlacingOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>

          <p className="checkout-note">
            💡 Your order will be sent to the kitchen immediately
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
