import React, { useState } from "react";
import axios from "axios";
import "./Promotions.scss";

const Promotions = () => {
    const [promotion, setpromotion] = useState([]);

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

    const submitloginForm = async () => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotion/`,{
            headers: {
              "Content-Type": "application/json",
          },
          })
            .then((response) => {
              console.log('Fetched Cookie:', response.data);
              return response.data;
            })
            .then((data) => {
              console.log('Fetched data:', data);
              setpromotion(data);
            })
            .catch((error) => console.error(`Error fetching promotions data:`, error));
    }


    useState(() => {
        if (getCookie("userID")) {
          submitloginForm();
        }
      }, []);

    return (
      <div className="promotion-container">
        <h1 className="promotion-title">Promotions</h1>
        <p className="promotion-subtitle">Check out our latest promotions!</p>
        <div className="promo-list-title">Your Promotions:</div>
        <ul className="promo-list">
          {promotion.map((promotion) => (
            <li key={promotion.PromotionID} className="promo-item">
              <div className="promo-header">
                <h3 className="promo-name">{promotion.name}</h3>
                <div className="promo-discount">
                  <span>{Number(promotion.Discount * 100).toFixed(0)}%</span>
                  <span>Off</span>
                </div>
              </div>
              <div className="promo-details">
                <p>{promotion.Description}</p>
                <div className="promo-dates">
                  <p><i className="fas fa-calendar-alt"></i><strong> Start Date:</strong> {new Date(promotion.StartDay).toLocaleDateString()}</p>
                  <p><i className="fas fa-calendar-alt"></i><strong> End Date:</strong> {new Date(promotion.EndDay).toLocaleDateString()}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );

}

export default Promotions;