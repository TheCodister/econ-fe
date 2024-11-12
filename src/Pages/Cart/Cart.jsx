// src/Pages/Cart/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Footer, Title, CartSummary } from '../../Components';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Import axios for making HTTP requests
import './Cart.css';
import './Style.scss';

const Cart = () => {
  const { state, dispatch } = useCart();
  const { user } = useAuth(); // Get user from context
  const navigate = useNavigate(); // For navigation after purchase


  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + (item.discountedPrice) * item.quantity;
    }, 0);
  };


  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.info('Cart has been cleared.', {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      theme: "colored",
    });
  };


  const subtotal = Number(calculateTotal());
  const shipping = subtotal > 50 ? 0 : 0; // Example: Free shipping over $50
  const estimate = "Ho Chi Minh city"; // Example: Estimate based on the shipping address
  const total = parseFloat((subtotal + shipping).toFixed(2));

  return (
    <div className="cart">
      <Header />
      <div className="cart-content">
        <Title titleText="My Cart" size={24} margin_b={12} />
        {state.cart.length === 0 ? (
          <div className="empty-cart">
            <img src='/Images/Frame.png' alt='empty cart' className='empty-card-img' />
            <p className="empty-cart-message">Your cart is empty.</p>
          </div>
        ) : (
          <div>
            <div className="cart-items-wrapper">
              <div className="cart-items">
                <div className='cart-row'>
                  <p className="cart-item-count">You have 
                    <span className="item-count-number"> {state.cart.length} </span>
                    item(s) in your cart.
                  </p>
                  <button
                    className="clear-cart-button button-89"
                    onClick={clearCart}
                    role="button"
                  >
                    Clear Cart
                  </button>
                </div>
                {state.cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="item-details">
                      <Link 
                        to={`/buy-product/${item.productID}/${item.storeID}`} 
                        className="product-link"
                      >
                        <p className="item-name">{item.pName}</p>
                      </Link>
                      <p className="item-storeid">Store: {item.storeName}</p>
                      {item.discount > 0 ? (
                        <>
                          <p className="promo-product-price">${item.price.toFixed(2)}</p>
                          <p className="cart_product__disscount_num">{(item.discount * 100).toFixed(0)}% off</p>
                          <p className="promo-product-discount">Price: ${item.discountedPrice.toFixed(2)}</p>
                        </>
                      ) : (
                        <>
                          <p className="item-price">Price: ${item.price.toFixed(2)}</p>
                        </>
                      )}
                    </div>
                    <p className="item-quantity">x {item.quantity}</p>
                    <button
                      className="remove-item-button x_button"
                      onClick={() => handleRemoveItem(index)}
                      role="button"
                    >
                      <span>remove</span>
                      <div className="icon">
                        <i className="fa fa-remove"></i>
                      </div>
                    </button>
                  </div>
                ))}
                <div className='promotion-select'>
                  <h3>Apply Promotion</h3>
                  {/* Implement promotion application logic here */}
                </div>
              </div>
              <div className="cart-summary">
                <CartSummary subtotal={subtotal} shipping={shipping} estimate={estimate} total={total} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;