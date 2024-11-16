// Cart.jsx
import axios from "axios"; // Import axios for making HTTP requests
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CartSummary, Footer, Header, Title } from "../../Components";
import { useCart } from "../../Context/CartContext";
import "./Cart.css";
import "./Style.scss";

const Cart = () => {
  const { state, dispatch } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Credit Card");
  const [billPromotion, setBillPromotion] = useState({});
  const lastBillIdRef = useRef(500100);

  const handleRemoveItem = (index) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: index });
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + item.Price * (1 - item.TotalDiscount) * item.Quantity;
    }, 0);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  useEffect(() => {
    // Fetch category-specific data from JSON file based on categoryName
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/transaction/last`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Fetched Data:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        lastBillIdRef.current = data;
      })
      .catch((error) =>
        console.error(`Error fetching ${categoryName} data:`, error)
      );
  }, []);

  function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  const handleBuyButtonClick = async () => {
    try {
      const purchaseTime = new Date(); // Get the current time
      // Split the cart items based on StoreID
      const itemsByStore = state.cart.reduce((result, item) => {
        const storeID = item.StoreID;
        if (!result[storeID]) {
          result[storeID] = [];
        }
        result[storeID].push(item);
        return result;
      }, {});

      const newcustomerID = parseInt(getCookie("userID"), 10); // Ensure customerID is an integer

      // Send each store's bill to the backend separately
      const storePromises = Object.entries(itemsByStore).map(
        async ([storeID, items], index) => {
          const newstoreID = parseInt(storeID, 10); // Ensure storeID is an integer
          let newBillId = lastBillIdRef.current + index + 1;
          console.log(getCookie("userID"));
          console.log(storeID);
          console.log(purchaseTime.toISOString());
          console.log(newBillId);
          // Step 1: Post the bill information
          const response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_API_URL}/transaction/`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              TransactionID: newBillId,
              CustomerID: newcustomerID,
              // cart: items,
              // total: calculateTotalForStore(items),
              DateAndTime: purchaseTime.toISOString(), // Convert to ISO string for consistency
              PaymentMethod: selectedPaymentMethod,
              StoreID: newstoreID,
              // Add other relevant information
            }
          );

          // Step 2: Post the NumberOfProductinBill for each item in the bill
          const itemPromises = items.map(async (item) => {
            const response = await axios.post(
              `${import.meta.env.VITE_REACT_APP_API_URL}/transaction/items/`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                TransactionID: newBillId,
                ProductID: item.ProductID,
                StoreID: newstoreID,
                NumberOfProductInBill: item.Quantity, // Assuming quantity is the number of products in the bill
              }
            );

            const response2 = await axios.post(
              `${import.meta.env.VITE_REACT_APP_API_URL}/ship/order`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                TransactionID: newBillId,
              }
            );

            return response.data;
          });

          // Wait for all item transactions to complete
          const itemResponses = await Promise.all(itemPromises);

          return { bill: response.data, items: itemResponses };
        }
      );

      // Wait for all store transactions to complete
      const storeResponses = await Promise.all(storePromises);

      // Clear the cart after a successful purchase
      dispatch({ type: "CLEAR_CART" });

      // Redirect to a success or confirmation page
    } catch (error) {
      console.error("Error while processing the purchase:", error);
      // Handle error scenarios, e.g., show an error message to the user
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // Helper function to calculate the total for a specific store
  const calculateTotalForStore = (items) => {
    return items.reduce((total, item) => {
      return total + item.Price * (1 - item.TotalDiscount) * item.Quantity;
    }, 0);
  };

  const subtotal = Number(calculateTotal());
  const shipping = subtotal > 50 ? 0 : 5; // Example: Free shipping over $50
  const estimate = "Ho Chi Minh city"; // Example: Estimate based on the shipping address
  const total = subtotal + shipping;

  return (
    <div className="cart">
      <Header />
      <div className="cart-content">
        {/* <h1 className="cart-title">My Cart</h1> */}
        <Title titleText="My Cart" size={24} margin_b={12} />
        {state.cart.length === 0 ? (
          <div className="empty-cart">
            <img
              src="/Images/Frame.png"
              alt="empty cart"
              className="empty-card-img"
            />
            <p className="empty-cart-message">Your cart is empty.</p>
          </div>
        ) : (
          <div>
            {/* <p className="cart-item-count">You have 
              <span className="item-count-number"> {state.cart.length} </span>
            item(s) in your cart.</p> */}
            <div className="cart-items-wrapper">
              <div className="cart-items">
                <div className="cart-row">
                  <p className="cart-item-count">
                    You have
                    <span className="item-count-number">
                      {" "}
                      {state.cart.length}{" "}
                    </span>
                    item(s) in your cart.
                  </p>
                  <button
                    className="clear-cart-button"
                    onClick={clearCart}
                    class="button-89"
                    role="button"
                  >
                    Clear Cart
                  </button>
                </div>
                {/* <p className="cart-item-count">You have 
              <span className="item-count-number"> {state.cart.length} </span>
            item(s) in your cart.</p> */}
                {state.cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="item-details">
                      <Link
                        to={`/buy-product/${item.ProductID}/${item.StoreID}`}
                        key={item.ProductID}
                        className="product-link"
                      >
                        <p className="item-name">{item.PName}</p>
                      </Link>
                      <p className="item-storeid">Store: {item.StoreName}</p>
                      {item.Promotion && item.Promotion.length > 0 ? (
                        <>
                          <p className="promo-product-price">
                            ${item.Price.toFixed(2)}
                          </p>
                          <p className="cart_product__disscount_num">
                            {item.TotalDiscount.toFixed(2) * 100}% off
                          </p>
                          <p className="promo-product-discount">
                            Price: $
                            {(item.Price * (1 - item.TotalDiscount)).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="item-price">
                            Price: ${item.Price.toFixed(2)}
                          </p>
                        </>
                      )}
                      {/* Add other details as needed */}
                    </div>
                    <p className="item-quantity">x {item.Quantity}</p>
                    <button
                      className="remove-item-button"
                      onClick={() => handleRemoveItem(index)}
                      class="x_button"
                      href="#"
                      role="button"
                    >
                      <span>remove</span>
                      <div class="icon">
                        <i class="fa fa-remove"></i>
                      </div>
                    </button>
                  </div>
                ))}
                <div className="promotion-select">
                  <h3>Apply Promotion</h3>
                </div>
              </div>
              <div className="cart-summary">
                {/* You can display the total or other summary information here */}
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  estimate={estimate}
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
