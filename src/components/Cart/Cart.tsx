/**
 * Cart Component - Shopping cart sidebar
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from '../Button/Button';
import './Cart.css';

const Cart: React.FC = () => {
  const { 
    items, 
    itemCount, 
    totalAmount, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/menu');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <button 
        className="cart__backdrop" 
        onClick={closeCart}
        onKeyDown={(e) => e.key === 'Escape' && closeCart()}
        aria-label="Close cart"
        type="button"
      />

      {/* Sidebar */}
      <div className="cart__sidebar">
        <div className="cart__header">
          <div className="cart__header-content">
            <h2 className="cart__title">Your Cart</h2>
            <span className="cart__count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button onClick={closeCart} className="cart__close-btn">
            ✕
          </button>
        </div>

        <div className="cart__content">
          {items.length === 0 ? (
            <div className="cart__empty">
              <div className="cart__empty-icon">🛒</div>
              <p className="cart__empty-text">Your cart is empty</p>
              <Button 
                variant="primary" 
                onClick={handleContinueShopping}
                className="cart__empty-btn"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart__items">
                {items.map((item) => (
                  <div key={`${item.id}-${item.notes || 'default'}`} className="cart-item">
                    <div className="cart-item__details">
                      <h3 className="cart-item__name">{item.name}</h3>
                      {item.notes && (
                        <p className="cart-item__notes">📝 {item.notes}</p>
                      )}
                      <div className="cart-item__price">
                        ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div className="cart-item__actions">
                      {/* Quantity Controls */}
                      <div className="cart-item__quantity">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.notes)}
                          className="cart-item__quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="cart-item__quantity-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.notes)}
                          className="cart-item__quantity-btn"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id, item.notes)}
                        className="cart-item__remove-btn"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart */}
              <button onClick={clearCart} className="cart__clear-btn">
                Clear Cart
              </button>
            </>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items.length > 0 && (
          <div className="cart__footer">
            <div className="cart__total">
              <span className="cart__total-label">Total:</span>
              <span className="cart__total-amount">${totalAmount.toFixed(2)}</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCheckout}
              className="cart__checkout-btn"
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
