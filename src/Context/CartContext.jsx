// src/contexts/CartContext.js
import React, { createContext, useContext, useReducer } from 'react';

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
          ? { ...item, Quantity: action.payload.Quantity }
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
        selectedCustomerPromotion: null, // Clear promotion when cart is cleared
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

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [], selectedCustomerPromotion: null });

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};