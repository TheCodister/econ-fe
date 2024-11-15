// src/Pages/Cart/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Footer, Title, CartSummary } from '../../Components';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth
import PromotionTicket from '../../Components/Common/PromotionTicket/PromotionTicket';

import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Import axios for making HTTP requests
import './Cart.css';
import './Style.scss';

const Cart = () => {
  const { state, dispatch } = useCart();
  const { user } = useAuth(); // Get user from context
  const navigate = useNavigate(); // For navigation after purchase
  const [customerPromotions, setCustomerPromotions] = useState([]);

  const customerId = user?.role === 'Customer' ? user.id : null; // Get customerId if user is a customer

  useEffect(() => {
    // Clear any selected customer promotion when entering the cart page
    dispatch({ type: 'CLEAR_CUSTOMER_PROMOTION' });

    const fetchCustomerPromotions = async () => {
      if (!customerId) return; // Return if user is not a customer
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/promotions/customer/${customerId}`
        );
        setCustomerPromotions(response.data);
        console.log('Customer promotions:', response.data);
      } catch (error) {
        console.error('Error fetching customer promotions:', error);
      }
    };

    fetchCustomerPromotions();
  }, []);

  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discountAmount = 0;
  
    state.cart.forEach((item) => {
      const itemTotal = item.discountedPrice * item.quantity;
      subtotal += itemTotal;
  
      // Apply promotion if it matches the product in the cart
      if (
        state.selectedCustomerPromotion &&
        state.selectedCustomerPromotion.product.productId === item.productID
      ) {
        discountAmount += itemTotal * state.selectedCustomerPromotion.discount;
      }
    });
  
    const temp_total = subtotal - discountAmount;
    // console.log('Subtotal:', subtotal, 'Discount:', discountAmount, 'Total:', temp_total);
  
    return { subtotal, discountAmount, temp_total };
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

  const handleSelectPromotion = (promotion) => {
    if (state.selectedCustomerPromotion?.promotionId === promotion.promotionId) {
      dispatch({ type: 'CLEAR_CUSTOMER_PROMOTION' });
      return;
    }
    dispatch({ type: 'SET_CUSTOMER_PROMOTION', payload: promotion });
  };


  const { subtotal, discountAmount, temp_total } = calculateTotals();
  // console.log('Subtotal:', subtotal, 'Discount:', discountAmount, 'Total:', temp_total);
  const shipping = subtotal > 50 ? 0 : 0; // Example: Free shipping over $50
  const estimate = "Ho Chi Minh city"; // Example: Estimate based on the shipping address
  const total = parseFloat((temp_total + shipping).toFixed(2));

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
                
                {/* Apply Promotion */}
                <div className='promotion-select'>
                  <Typography variant="h5" 
                  sx={{ 
                    mt: 2,
                    mb: 2,
                    fontWeight: '900',
                    fontFamily: 'Quicksand',
                  }}>
                    Apply Promotion
                  </Typography>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {customerPromotions.map((promotion) => {
                      // Check if the promotion's product is in the cart
                      const productInCart = state.cart.find(
                        (item) => item.productID === promotion.product.productId
                      );
                    
                      return (
                        <PromotionTicket
                          key={promotion.promotionId}
                          promotion={promotion}
                          onSelect={handleSelectPromotion}
                          disabled={!productInCart}
                          selected={state.selectedCustomerPromotion?.promotionId === promotion.promotionId}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="cart-summary">
                <CartSummary 
                  subtotal={subtotal} 
                  shipping={shipping} 
                  estimate={estimate} 
                  customerPromotion={discountAmount}
                  total={total} 
                />
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