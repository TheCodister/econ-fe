// src/Pages/CheckOut/CheckOut.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Footer, Title, CartSummary, InfoForm } from '../../Components';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Import axios for making HTTP requests
import '../Cart/Cart.css';
import './CheckOut.scss';

const CheckOut = () => {
  const { state, dispatch } = useCart();
  const { user } = useAuth(); // Get user from context
  const navigate = useNavigate(); // For navigation after purchase

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false); // To manage button state

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
        const totalPrice = items.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
        const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0); // Assuming each item has a 'weight' property

        // Prepare the includes array
        const includes = items.map(item => ({
          productID: item.productID,
          numberOfProductInBill: item.quantity,
          subTotal: item.discountedPrice * item.quantity,
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

        console.log('Transaction data:', transactionData);

        // POST /transactions
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/transactions`, transactionData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log('Transaction response:', response.data);

        return response.data;
      });

      // Execute all transactions concurrently
      await Promise.all(transactionPromises);

      // Clear the cart after successful transactions
      dispatch({ type: 'CLEAR_CART' });

      toast.success('Purchase successful! Thank you for your order.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });

      // Redirect to order confirmation page or orders page
      navigate('/');
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


  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + (item.discountedPrice) * item.quantity;
    }, 0);
  };

  const subtotal = Number(calculateTotal());
  const shipping = subtotal > 50 ? 0 : 0; // Example: Free shipping over $50
  const estimate = "Ho Chi Minh city"; // Example: Estimate based on the shipping address
  const total = parseFloat((subtotal + shipping).toFixed(2));

  return (
    <div className="cart">
      <Header />
      <div className="cart-content">
        {/* <h1 className="cart-title">My Cart</h1> */}
        <Title titleText="Checkout" size={24} margin_b={12} />
        {state.cart.length === 0 ? (
          <div className="empty-cart">
            <img src='/Images/Frame.png' alt='empty cart' className='empty-card-img' />
            <p className="empty-cart-message">Your cart is empty.</p>
          </div>
        ) : (
          <div>
            <p className="cart-item-count">You have 
              <span className="item-count-number"> {state.cart.length} </span>
            item(s) in your cart.</p>
            <div className="cart-items-wrapper">
              <div className="shipping-info-check">
                <InfoForm />
                <div className="payment-method">
                  <h2>Choose Payment Method</h2>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Credit Card"
                        checked={selectedPaymentMethod === 'Credit Card'}
                        onChange={handlePaymentMethodChange}
                      />
                      Credit Card
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Debit Card"
                        checked={selectedPaymentMethod === 'Debit Card'}
                        onChange={handlePaymentMethodChange}
                      />
                      Debit Card
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Cash"
                        checked={selectedPaymentMethod === 'Cash'}
                        onChange={handlePaymentMethodChange}
                      />
                      Cash on delivery
                    </label>
                  </div>
                </div>
              </div>
              <div className="cart-items">
                <h2>Your Order</h2>
                {state.cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="item-details">
                      <Link 
                        to={`/buy-product/${item.productID}/${item.storeID}`} 
                        className="product-link"
                      >
                        <p className="item-name">{item.pName}</p>
                      </Link>
                      <p className="item-quantity_2">x {item.quantity}</p>
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
                  </div>
                ))}
                <div className="cart-summary">
                  <CartSummary subtotal={subtotal} shipping={shipping} estimate={estimate} total={total} checkout={true} />
                </div>
                <button className="buy-button" onClick={handleBuyButtonClick} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Place an Order ➔'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckOut;