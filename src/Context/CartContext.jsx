// CartContext.js
import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((_, index) => index !== action.payload),
      };
    case "UPDATE_CART_ITEM":
      // eslint-disable-next-line no-case-declarations
      const updatedCart = state.cart.map((item) =>
        item.ProductID === action.payload.ProductID &&
        item.StoreID === action.payload.StoreID
          ? { ...item, Quantity: action.payload.Quantity }
          : item
      );
      return {
        ...state,
        cart: updatedCart,
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };
    // Add more cases for other actions as needed
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
