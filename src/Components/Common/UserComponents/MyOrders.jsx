import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyOrders.scss"; // Ensure you have a corresponding SCSS file

const MyOrders = () => {
  const [transaction, setTransaction] = useState([]);

  function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/customers/shipping/${getCookie('userID')}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Fetched Data:', response.data);
      setTransaction(response.data.data || []);
    } catch (error) {
      console.error(`Error fetching ${getCookie('userID')} data:`, error);
    }
  };

  useEffect(() => {
    if (getCookie("userID")) {
      fetchTransactions();
    }
  }, []);

  return (
    <div className="my-orders">
      <h2>Your Orders</h2>
      {transaction && transaction.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transaction.map((order) => (
              <tr key={order.transactionID}>
                <td>#{order.TransactionID}</td>
                {/* <td>{new Date(order.Date).toLocaleDateString()}</td> */}
                {order.Date ? (
                  <td>{new Date(order.Date).toLocaleDateString()}</td>
                ) : (
                  <td>
                    {/* default date 29/02/2024 */}
                    29/02/2024
                  </td>
                )
                }
                {order.Status ? (
                  <td className="status">{order.Status}</td>
                ) : (
                  <td className="status">Unknown</td>
                )
                }
                {order.Total ? (
                  <td>${order.Total}</td>
                ) : (
                  <td>$0.00</td>
                )
                }
                <td><a href={`/orders/${order.TransactionID}`} className="view-link">View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions available</p>
      )}
    </div>
  );
};

export default MyOrders;
