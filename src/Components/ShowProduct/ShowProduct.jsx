// ShowProduct.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./ShowProduct.scss";

const ShowProduct = ({ product, storeId }) => {
  const [promotions, setPromotions] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [pageStoreId, setPageStoreId] = useState(storeId);

  // Fetch store information based on productId if storeId is not provided
  useEffect(() => {
    const fetchStoreInfo = async () => {
      if (!pageStoreId) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/atstore/${product.ProductID}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const storeInfoArray = response.data;
          
          // Choose the storeId with the highest NumberAtStore
          const selectedStoreInfo = storeInfoArray.reduce((prev, current) => (prev.NumberAtStore > current.NumberAtStore) ? prev : current);
          const fetchedStoreId = selectedStoreInfo.StoreID;
          
          // Use the fetched storeId or set a default value if needed
          setPageStoreId(fetchedStoreId);
        } catch (error) {
          console.error(`Error fetching store info for product ${product.ProductID}:`, error);
        }
      }
    };
  
    fetchStoreInfo();
  }, [pageStoreId, product.ProductID]);
  
  useEffect(() => {
    const fetchPromotionInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/promotionfromproduct/${product.ProductID}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const promotionInfo = response.data;
        setPromotions(promotionInfo);
        setTotalDiscount(calculateTotalDiscount(promotionInfo));
      } catch (error) {
        console.error(`Error fetching promotion info for product ${product.ProductID}:`, error);
      }
    };

    fetchPromotionInfo();
  }, [product.ProductID]);

  const calculateTotalDiscount = (promotions) => {
    if (!promotions || promotions.length === 0) {
      return 0; // No discounts
    }
    const totalDiscount = promotions.reduce((total, promotion) => total + promotion.Discount, 0);
    // Ensure the total discount does not exceed 0.99
    return Math.min(totalDiscount, 0.99);
  };

  return (
    <div className="item-product">
      <Link 
        to={`/buy-product/${product.ProductID}/${pageStoreId}`} 
        key={product.ProductID}
        className="product-link"
      >
      <article className="product-card" key={product.PName}>
      {/* <div className='product-img-wrapper'>
        {product.Image ? (
          <img src={`${product.Image}`} alt={product.PName} className="product-card__img" />
        ) : (
          <img src="/Images/no-image.jpg" alt={product.PName} className="product-card__img" />
        )}
      </div> */}
      <div className="product-card__body">
        <div className='product-img-wrapper'>
          {product.Image ? (
            <img src={`${product.Image}`} alt={product.PName} className="product-card__img" />
          ) : (
            <img src="/Images/no-image.jpg" alt={product.PName} className="product-card__img" />
          )}
        </div>
        <p className="product-card__name">{product.PName}</p>
        {promotions && promotions.length > 0 ? (
            <>
                <p className="promo-product-price">${product.Price.toFixed(2)}</p>
                <p className="product__disscount">-{totalDiscount.toFixed(2) * 100}%</p>
                <p className="promo-product-discount">${(product.Price * (1 - totalDiscount)).toFixed(2)}</p>
            </>
        ) : (
            <>
            <p className="product-card__price">${product.Price.toFixed(2)}</p>
            </>
        )}
        <div className="product-card__buttons">
          <button className="btn btn--secondary">Buy</button>
          <button className="btn btn--secondary--transparent">Details</button>
        </div>
        </div>
        </article>
      </Link>
    </div>
  );
};

export default ShowProduct;
