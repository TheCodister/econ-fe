// src/components/Promotions.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import "./Promotions.scss";

const Promotions = () => {
  const { user } = useAuth();
  const [billPromotions, setBillPromotions] = useState([]);
  const [productPromotions, setProductPromotions] = useState([]);
  const [customerPromotions, setCustomerPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBillPromotions = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/bill`);
          setBillPromotions(response.data);
      } catch (error) {
          console.error("Error fetching bill promotions:", error);
      }
  };

  const fetchProductPromotions = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/product`);
          setProductPromotions(response.data);
      } catch (error) {
          console.error("Error fetching product promotions:", error);
      }
  };

  const fetchCustomerPromotions = async (customerId) => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/customer/${customerId}`);
          setCustomerPromotions(response.data);
      } catch (error) {
          console.error("Error fetching customer promotions:", error);
      }
  };

  useEffect(() => {
      const initializePromotions = async () => {
          setLoading(true);
          await fetchBillPromotions();
          await fetchProductPromotions();
          if (user && user.role === "Customer") {
              await fetchCustomerPromotions(user.id); // Adjust 'user.id' based on your user object structure
          }
          setLoading(false);
      };
      initializePromotions();
  }, [user]);

  return (
      <div className="promotion-container">
          <h1 className="promotion-title">Promotions</h1>
          <p className="promotion-subtitle">Check out our latest promotions!</p>

          {loading ? (
              <p>Loading promotions...</p>
          ) : (
              <>
                  {/* Bill Promotions */}
                  <div className="promo-section">
                      <div className="promo-list-title">Bill Promotions</div>
                      <ul className="promo-list">
                          {billPromotions.map((promo) => (
                              <li key={promo.promotionId} className="promo-item">
                                  <div className="promo-header">
                                      <h3 className="promo-name">{promo.name}</h3>
                                      <div className="promo-discount">
                                          <span>{(promo.discount * 100).toFixed(0)}%</span>
                                          <span>Off</span>
                                      </div>
                                  </div>
                                  <div className="promo-details">
                                      <p>{promo.description}</p>
                                      <div className="promo-dates">
                                          <p><strong>Start Date:</strong> {new Date(promo.startDay).toLocaleDateString()}</p>
                                          <p><strong>End Date:</strong> {new Date(promo.endDay).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Product Promotions */}
                  <div className="promo-section">
                      <div className="promo-list-title">Product Promotions</div>
                      <ul className="promo-list">
                          {productPromotions.map((promo) => (
                              <li key={promo.promotionID} className="promo-item">
                                  <div className="promo-header">
                                      <h3 className="promo-name">{promo.name}</h3>
                                      <div className="promo-discount">
                                          <span>{(promo.discount * 100).toFixed(0)}%</span>
                                          <span>Off</span>
                                      </div>
                                  </div>
                                  <div className="promo-details">
                                      <p>{promo.description}</p>
                                      <div className="promo-dates">
                                          <p><strong>Start Date:</strong> {new Date(promo.startDay).toLocaleDateString()}</p>
                                          <p><strong>End Date:</strong> {new Date(promo.endDay).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                                  {promo.products && promo.products.length > 0 && (
                                      <div className="promo-products">
                                          <strong>Applicable Products:</strong>
                                          <ul>
                                              {promo.products.map((product) => (
                                                  <li key={product.productID}>
                                                      {product.pName} - {(product.discount * 100).toFixed(0)}% Off
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  )}
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Customer Promotions */}
                  {user && user.role === "Customer" && (
                      customerPromotions.length > 0 ? (
                          <div className="promo-section">
                              <div className="promo-list-title">Your Promotions</div>
                              <ul className="promo-list">
                                  {customerPromotions.map((promo) => (
                                      <li key={promo.promotionId} className="promo-item">
                                          <div className="promo-header">
                                              <h3 className="promo-name">{promo.name}</h3>
                                              <div className="promo-discount">
                                                  <span>{(promo.discount * 100).toFixed(0)}%</span>
                                                  <span>Off</span>
                                              </div>
                                          </div>
                                          <div className="promo-details">
                                              <p>{promo.description}</p>
                                              <div className="promo-dates">
                                                  <p><strong>Start Date:</strong> {new Date(promo.startDay).toLocaleDateString()}</p>
                                                  <p><strong>End Date:</strong> {new Date(promo.endDay).toLocaleDateString()}</p>
                                              </div>
                                          </div>
                                          {promo.product && (
                                              <div className="promo-products">
                                                  <strong>Product:</strong>
                                                  <p>{promo.product.pName} - ${promo.product.price}</p>
                                              </div>
                                          )}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      ) : (
                          <div className="promo-section">
                              <div className="promo-list-title">Your Promotions</div>
                              <p>No promotions available for you at the moment.</p>
                          </div>
                      )
                  )}
              </>
          )}
      </div>
  );
}

export default Promotions;