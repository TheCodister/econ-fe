// src/contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((_, index) => index !== action.payload),
      };
    case 'UPDATE_CART_ITEM':
      const updatedCart = state.cart.map((item) =>
        item.productID === action.payload.productID && item.storeID === action.payload.storeID
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        cart: updatedCart,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        selectedCustomerPromotion: null,
      };
    case 'SET_CUSTOMER_PROMOTION':
      return {
        ...state,
        selectedCustomerPromotion: action.payload,
      };
    case 'CLEAR_CUSTOMER_PROMOTION':
      return {
        ...state,
        selectedCustomerPromotion: null,
      };
    default:
      return state;
  }
};

// Function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return { cart: [], selectedCustomerPromotion: null };
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error('Could not load cart from localStorage:', e);
    return { cart: [], selectedCustomerPromotion: null };
  }
};

// Function to save cart to localStorage
const saveCartToLocalStorage = (state) => {
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem('cart', serializedCart);
  } catch (e) {
    console.error('Could not save cart to localStorage:', e);
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {}, loadCartFromLocalStorage);

  useEffect(() => {
    saveCartToLocalStorage(state);
  }, [state]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};