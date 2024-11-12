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

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false); // To manage button state

  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + (item.price * (1 - item.totalDiscount)) * item.quantity;
    }, 0);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleBuyButtonClick = async () => {
    if (isProcessing) return; // Prevent multiple submissions
    setIsProcessing(true);

    try {
      if (!user) {
        toast.error('You must be logged in to make a purchase.', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
        });
        setIsProcessing(false);
        return;
      }

      // Split the cart items based on storeID
      const itemsByStore = state.cart.reduce((result, item) => {
        const storeID = item.storeID;
        if (!result[storeID]) {
          result[storeID] = [];
        }
        result[storeID].push(item);
        return result;
      }, {});

      const purchaseTime = new Date().toISOString(); // Current time in ISO format

      // Prepare transactions for each store
      const transactionPromises = Object.entries(itemsByStore).map(async ([storeID, items]) => {
        // Calculate totalPrice and totalWeight for this store
        const totalPrice = items.reduce((sum, item) => sum + (item.price * (1 - item.totalDiscount)) * item.quantity, 0);
        const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0); // Assuming each item has a 'weight' property

        // Prepare the includes array
        const includes = items.map(item => ({
          productID: item.productID,
          numberOfProductInBill: item.quantity,
          subTotal: (item.price * (1 - item.totalDiscount)) * item.quantity,
        }));

        // Create the transaction object
        const transactionData = {
          paymentMethod: selectedPaymentMethod,
          dateAndTime: purchaseTime,
          customerID: user.id, // Assuming user object has 'id' property
          storeID: storeID,
          includes: includes,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
          totalWeight: totalWeight,
        };

        // POST /transactions
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/transactions`, transactionData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        return response.data;
      });

      // Execute all transactions concurrently
      const results = await Promise.all(transactionPromises);

      // Clear the cart after successful transactions
      dispatch({ type: 'CLEAR_CART' });

      toast.success('Purchase successful! Thank you for your order.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });

      // Redirect to order confirmation page or orders page
      // navigate('/orders');
    } catch (error) {
      console.error('Error while processing the purchase:', error);
      toast.error('There was an error processing your purchase. Please try again.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
    } finally {
      setIsProcessing(false);
    }
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

  // Helper function to calculate the total for a specific store
  const calculateTotalForStore = (items) => {
    return items.reduce((total, item) => {
      return total + (item.price * (1 - item.totalDiscount)) * item.quantity;
    }, 0);
  };

  const subtotal = Number(calculateTotal());
  const shipping = subtotal > 50 ? 0 : 5; // Example: Free shipping over $50
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
                      {item.promotion && item.promotion.length > 0 ? (
                        <>
                          <p className="promo-product-price">${item.price.toFixed(2)}</p>
                          <p className="cart_product__disscount_num">{(item.totalDiscount * 100).toFixed(0)}% off</p>
                          <p className="promo-product-discount">Price: ${(item.price * (1 - item.totalDiscount)).toFixed(2)}</p>
                        </>
                      ) : (
                        <>
                          <p className="item-price">Price: ${item.price.toFixed(2)}</p>
                        </>
                      )}
                      {/* Add other details as needed */}
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