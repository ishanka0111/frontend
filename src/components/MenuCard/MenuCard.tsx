/**
 * MenuCard Component - Display individual menu item
 */

import React, { useState } from 'react';
import { IoLeaf, IoLeafOutline, IoRestaurantOutline, IoTimeOutline, IoWarning } from 'react-icons/io5';
import Button from '../Button/Button';
import type { MenuItem } from '../../types';
import './MenuCard.css';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number, notes?: string) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!onAddToCart) return;
    
    setIsAdding(true);
    onAddToCart(item, quantity, notes || undefined);
    
    // Reset and show feedback
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
      setNotes('');
      setShowNotes(false);
    }, 500);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className={`menu-card ${item.isActive ? '' : 'menu-card--unavailable'}`}>
      {/* Image */}
      <div className="menu-card__image-container">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="menu-card__image"
            loading="lazy"
          />
        ) : (
          <div className="menu-card__image-placeholder">
            <IoRestaurantOutline />
          </div>
        )}
        {!item.isActive && (
          <div className="menu-card__unavailable-badge">Unavailable</div>
        )}
        {item.dietaryTags && item.dietaryTags.length > 0 && (
          <div className="menu-card__tags">
            {item.dietaryTags.includes('vegetarian') && (
              <span className="menu-card__tag menu-card__tag--veg">
                <IoLeafOutline />
              </span>
            )}
            {item.dietaryTags.includes('vegan') && (
              <span className="menu-card__tag menu-card__tag--vegan">
                <IoLeaf />
              </span>
            )}
            {item.dietaryTags.includes('gluten-free') && <span className="menu-card__tag menu-card__tag--gf">GF</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="menu-card__content">
        <div className="menu-card__header">
          <h3 className="menu-card__name">{item.name}</h3>
          <span className="menu-card__price">${item.price.toFixed(2)}</span>
        </div>

        <p className="menu-card__description">{item.description}</p>

        {item.allergens && item.allergens.length > 0 && (
          <div className="menu-card__allergens">
            <span className="menu-card__allergens-label">
              <IoWarning className="status-icon" />
              Contains:
            </span>
            <span className="menu-card__allergens-list">{item.allergens.join(', ')}</span>
          </div>
        )}

        {item.preparationTime && (
          <div className="menu-card__prep-time">
            <IoTimeOutline className="status-icon" />
            ~{item.preparationTime} min
          </div>
        )}

        {/* Quantity Selector */}
        {item.isActive && onAddToCart && (
          <div className="menu-card__actions">
            <div className="menu-card__quantity">
              <button 
                onClick={decrementQuantity}
                className="menu-card__quantity-btn"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="menu-card__quantity-value">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="menu-card__quantity-btn"
              >
                +
              </button>
            </div>

            <Button 
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              isLoading={isAdding}
              className="menu-card__add-btn"
            >
              {isAdding ? 'Added!' : 'Add to Cart'}
            </Button>
          </div>
        )}

        {/* Special Notes */}
        {item.isActive && onAddToCart && (
          <div className="menu-card__notes-section">
            {showNotes ? (
              <div className="menu-card__notes-input-container">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., No onions, extra spicy..."
                  className="menu-card__notes-input"
                  rows={2}
                />
                <button 
                  onClick={() => setShowNotes(false)}
                  className="menu-card__notes-cancel"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowNotes(true)}
                className="menu-card__notes-toggle"
              >
                + Add special instructions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
