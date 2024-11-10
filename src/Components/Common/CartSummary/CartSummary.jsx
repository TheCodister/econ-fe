import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import './CartSummary.scss';

const CartSummary = ({ subtotal = 0, shipping = 0, estimate = '', total = 0, checkout = false }) => {
    const navigate = useNavigate();

    const handleCheckOut = () => {
        navigate('/CheckOut');
    };

    const handleBackToCart = () => {
        navigate('/Cart');
    };

  return (
    <div className="cart-summary_inside">
      <div className="summary-item">
        <span>Subtotal</span>
        <span>${Number(subtotal).toFixed(2)}</span>
      </div>
      <hr />
      <div className="summary-item">
        <span>Shipping</span>
        <span>{Number(shipping) > 0 ? `$${Number(shipping).toFixed(2)}` : 'Free'}</span>
      </div>
      <div className="summary-item">
        <span>Estimate for</span>
        <span>{estimate}</span>
      </div>
      <hr />
      <div className="summary-item">
        <span>Total</span>
        <span>${Number(total).toFixed(2)}</span>
      </div>
      {!checkout && (
        <button className="checkout-btn" onClick={handleCheckOut}>
          Proceed To CheckOut <span>➔</span>
        </button>
      )}
      {checkout && (
        <button className="checkout-btn" onClick={handleBackToCart}>
          Back To Cart <span>➔</span>
        </button>
      )}
    </div>
  );
};

CartSummary.propTypes = {
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  estimate: PropTypes.string,
  total: PropTypes.number,
};

export default CartSummary;