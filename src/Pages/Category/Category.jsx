import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Header, Footer, ShowProduct } from "../../Components";
import FeatureAd from '../../Components/Common/Feature_Ad/FeatureAd';
import ProductList from '../../Components/Common/ProductList/ProductList';
import "./Category.css";
import axios from "axios";
const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch category-specific data from JSON file based on categoryName
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/category/${categoryName}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // console.log('Fetched Data:', response.data);
        return response.data;
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error(`Error fetching ${categoryName} data:`, error));
  }, [categoryName]);

  return (
    <div className="category">
      <Header/>
      <div className="category-content">
        <header className="products__header container">
          <h2 className="subtitle subtitle--products">{categoryName} category</h2>
        </header>
        {/* <div className="products__container container">
          {products.map((product) => (
            <>
            <ShowProduct product={product} storeId={null} />
            </>
          ))}
        </div> */}
        <p className="cart-item-count container reduce-mb">We found 
              <span className="item-count-number"> {products.length} </span>
              items for you!</p>
        <div className="container">
          <ProductList products={products} storeId={null} size='small' />
        </div>

      </div>
      <FeatureAd />
      <Footer/>
    </div>
  );
  };
  
  export default Category;
  