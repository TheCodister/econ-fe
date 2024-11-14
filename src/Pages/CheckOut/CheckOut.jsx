// src/Pages/CheckOut/CheckOut.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Footer, Title, CartSummary, InfoForm } from '../../Components';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Paper, Stack, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import '../Cart/Cart.css';
import './CheckOut.scss';

const PromotionTicket = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  position: 'relative',
  background: '#fff',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    height: '20px',
    width: '20px',
    borderRadius: '50%',
    background: theme.palette.background.default,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&::before': {
    left: '-10px',
  },
  '&::after': { right: '-10px' },
}));

const StyledTypography = styled(Typography)({
  fontFamily: "'Quicksand', sans-serif",
  fontWeight: 900,
});

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  borderRight: `2px dashed ${theme.palette.divider}`,
  paddingRight: theme.spacing(2),
  flex: 2,
}));

const DiscountBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
}));

const CheckOut = () => {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billPromotion, setBillPromotion] = useState(null);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let customerPromotionDiscount = 0;

    state.cart.forEach((item) => {
      const itemTotal = item.discountedPrice * item.quantity;
      subtotal += itemTotal;

      if (
        state.selectedCustomerPromotion &&
        state.selectedCustomerPromotion.product.productId === item.productID
      ) {
        customerPromotionDiscount += itemTotal * state.selectedCustomerPromotion.discount;
      }
    });

    return { subtotal, customerPromotionDiscount };
  };

  const { subtotal, customerPromotionDiscount } = calculateTotals();
  const shipping = 0;
  const estimate = 'Ho Chi Minh city';

  const totalBeforeBillPromotion = subtotal - customerPromotionDiscount + shipping;
  const [total, setTotal] = useState(totalBeforeBillPromotion);
  const [billDiscountAmount, setBillDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchBillPromotion = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/promotions/bill/price/${totalBeforeBillPromotion}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setBillPromotion(response.data);
        const discount = totalBeforeBillPromotion * response.data.discount;
        setBillDiscountAmount(discount);
        setTotal(totalBeforeBillPromotion - discount);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setBillPromotion(null);
          setBillDiscountAmount(0);
          setTotal(totalBeforeBillPromotion);
        } else {
          console.error('Error fetching BillPromotion:', error);
        }
      }
    };

    if (totalBeforeBillPromotion >= 0) {
      fetchBillPromotion();
    }
  }, [totalBeforeBillPromotion]);

  const handleBuyButtonClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (!user || user.role !== 'Customer') {
        toast.error('You must be logged in to make a purchase.', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          theme: 'colored',
        });
        setIsProcessing(false);
        return;
      }

      const itemsByStore = state.cart.reduce((result, item) => {
        const storeID = item.storeID;
        if (!result[storeID]) {
          result[storeID] = [];
        }
        result[storeID].push(item);
        return result;
      }, {});

      const purchaseTime = new Date().toISOString();

      const transactionPromises = Object.entries(itemsByStore).map(async ([storeID, items]) => {
        let totalPrice = 0;
        let totalWeight = 0;
        let discountAmount = 0;

        const includes = items.map((item) => {
          let itemTotal = item.discountedPrice * item.quantity;
          totalWeight += item.weight * item.quantity;

          if (
            state.selectedCustomerPromotion &&
            state.selectedCustomerPromotion.product.productId === item.productID
          ) {
            const promotionDiscount = itemTotal * state.selectedCustomerPromotion.discount;
            itemTotal -= promotionDiscount;
            discountAmount += promotionDiscount;
          }

          totalPrice += itemTotal;

          return {
            productID: item.productID,
            numberOfProductInBill: item.quantity,
            subTotal: itemTotal,
          };
        });

        let billPromotionDiscount = 0;
        if (billPromotion) {
          billPromotionDiscount = totalPrice * billPromotion.discount;
          totalPrice = parseFloat((totalPrice - billPromotionDiscount).toFixed(2));
        }

        const transactionData = {
          paymentMethod: selectedPaymentMethod,
          dateAndTime: purchaseTime,
          customerID: user.id,
          storeID: storeID,
          includes: includes,
          totalPrice: totalPrice,
          totalWeight: totalWeight,
        };

        if (discountAmount > 0) {
          transactionData.discount = parseFloat(discountAmount.toFixed(2));
          transactionData.promotionId = state.selectedCustomerPromotion.promotionId;
        }

        if (billPromotionDiscount > 0) {
          transactionData.billPromotionDiscount = parseFloat(billPromotionDiscount.toFixed(2));
          transactionData.billPromotionId = billPromotion.promotionId;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/transactions`,
          transactionData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        console.log('Transaction response:', response.data);

        return response.data;
      });

      await Promise.all(transactionPromises);

      // If a customer promotion was used, delete it
      if (state.selectedCustomerPromotion) {
        try {
          const promotionId = state.selectedCustomerPromotion.promotionId;
          const customerId = user.id;

          await axios.delete(
            `${import.meta.env.VITE_REACT_APP_API_URL}/promotions/customer/${promotionId}/${customerId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );

          console.log(`Promotion ${promotionId} for customer ${customerId} has been deleted.`);
        } catch (deleteError) {
          console.error('Error deleting used promotion:', deleteError);
          // Optionally, notify the user about the failure to delete the promotion
          toast.warn('Purchase was successful, but we failed to remove the used promotion.', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            theme: 'colored',
          });
        }
      }

      dispatch({ type: 'CLEAR_CART' });

      toast.success('Purchase successful! Thank you for your order.', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        theme: 'colored',
      });

      navigate('/');
    } catch (error) {
      console.error('Error while processing the purchase:', error);
      toast.error('There was an error processing your purchase. Please try again.', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        theme: 'colored',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart">
      <Header />
      <div className="cart-content">
        <Title titleText="Checkout" size={24} margin_b={12} />
        {state.cart.length === 0 ? (
          <div className="empty-cart">
            <img src="/Images/Frame.png" alt="empty cart" className="empty-card-img" />
            <p className="empty-cart-message">Your cart is empty.</p>
          </div>
        ) : (
          <div>
            <p className="cart-item-count">
              You have
              <span className="item-count-number"> {state.cart.length} </span>
              item(s) in your cart.
            </p>
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

                <div className="cart-summary">
                  <CartSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    estimate={estimate}
                    total={total}
                    checkout={true} 
                    customerPromotion={customerPromotionDiscount}
                    billPromotion={billDiscountAmount}
                  />
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
                          <p className="cart_product__disscount_num">
                            {(item.discount * 100).toFixed(0)}% off
                          </p>
                          <p className="promo-product-discount">
                            Price: ${item.discountedPrice.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="item-price">Price: ${item.price.toFixed(2)}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {state.selectedCustomerPromotion && (
                  <PromotionTicket elevation={3}>
                    <Stack direction="row" spacing={2}>
                      <ContentBox>
                        <StyledTypography variant="h6" sx={{ color: '#fe3bd4' }}>
                          {state.selectedCustomerPromotion.name}
                        </StyledTypography>
                        <StyledTypography variant="body2">
                          {state.selectedCustomerPromotion.description}
                        </StyledTypography>
                      </ContentBox>
                      <DiscountBox>
                        <StyledTypography variant="h4" sx={{ color: '#fe3bd4' }}>
                          {(state.selectedCustomerPromotion.discount * 100).toFixed(0)}%
                        </StyledTypography>
                        <StyledTypography variant="subtitle2">OFF</StyledTypography>
                      </DiscountBox>
                    </Stack>
                  </PromotionTicket>
                )}

                {billPromotion && (
                  <PromotionTicket elevation={3}>
                    <Stack direction="row" spacing={2}>
                      <ContentBox>
                        <StyledTypography variant="h6" sx={{ color: '#fe3bd4' }}>
                          {billPromotion.name}
                        </StyledTypography>
                        <StyledTypography variant="body2">
                          {billPromotion.description}
                        </StyledTypography>
                      </ContentBox>
                      <DiscountBox>
                        <StyledTypography variant="h4" sx={{ color: '#fe3bd4' }}>
                          {(billPromotion.discount * 100).toFixed(0)}%
                        </StyledTypography>
                        <StyledTypography variant="subtitle2">OFF</StyledTypography>
                      </DiscountBox>
                    </Stack>
                  </PromotionTicket>
                )}

                <button
                  className="buy-button"
                  onClick={handleBuyButtonClick}
                  disabled={isProcessing}
                >
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