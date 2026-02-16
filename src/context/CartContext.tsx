/**
 * Cart Context - Manages shopping cart state
 */

import React, { createContext, useState, useEffect } from 'react';
import type { MenuItem, CartItem } from '../types';
import { STORAGE_KEYS, cartStorage } from '../constants/storage';

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addItem: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeItem: (itemId: number, notes?: string) => void;
  updateQuantity: (itemId: number, quantity: number, notes?: string) => void;
  updateNotes: (itemId: number, oldNotes: string | undefined, newNotes: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on init
    return cartStorage.get();
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    cartStorage.set(items);
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = (item: MenuItem, quantity = 1, notes?: string) => {
    setItems(current => {
      const existingIndex = current.findIndex(i => i.id === item.id && i.notes === notes);
      
      if (existingIndex >= 0) {
        // Update quantity for existing item
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      
      // Add new item
      const cartItem: CartItem = {
        ...item,
        quantity,
        notes,
      };
      return [...current, cartItem];
    });
  };

  const removeItem = (itemId: number, notes?: string) => {
    setItems(current => current.filter(item => 
      !(item.id === itemId && item.notes === notes)
    ));
  };

  const updateQuantity = (itemId: number, quantity: number, notes?: string) => {
    if (quantity <= 0) {
      removeItem(itemId, notes);
      return;
    }
    
    setItems(current =>
      current.map(item =>
        item.id === itemId && item.notes === notes ? { ...item, quantity } : item
      )
    );
  };

  const updateNotes = (itemId: number, oldNotes: string | undefined, newNotes: string) => {
    setItems(current =>
      current.map(item =>
        item.id === itemId && item.notes === oldNotes ? { ...item, notes: newNotes } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value: CartContextType = React.useMemo(() => ({
    items,
    itemCount,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [items, itemCount, totalAmount, isCartOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext };
