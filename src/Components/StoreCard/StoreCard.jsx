import React from 'react';
import './StoreCard.scss';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }) => {
  // OpeningDate : "2012-01-15T00:00:00+07:00"

  const open_year = new Date(store.OpeningDate).getFullYear();
  

  return (
    <Link to={`/store/${store.StoreID}`} className="store-link">
      <div className="store-card">
        <div className="store-card-header">
          <div className="store-logo">
            <img src="/Images/prop_image/store-icon.svg" alt={`${store.Name} logo`} />
          </div>
          <div className="store-details">
            <p className='open_year_style'>
              <span className="store-open-year">Since {open_year}</span>
            </p>
            <h3>{store.Name}</h3>
            <p className="store-rating">⭐⭐⭐⭐⭐ (5.0)</p>
            {/* <p className="store-category">Mall</p> */}
          </div>
        </div>
        <div className="store-info">
          <p className="store-address">
            Address: {store.Location}
          </p>
          <p className="store-contact">
            Call Us: {store.ContactInfo}
          </p>
        </div>
        {/* <div className="store-products">
          <button className="store-btn">Visit Store ➔</button>
        </div> */}
      </div>
      <div className="store-products">
        <button className="store-btn">Visit Store ➔</button>
      </div>
    </Link>
  );
};

export default StoreCard;