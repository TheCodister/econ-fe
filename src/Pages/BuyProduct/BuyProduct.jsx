// src/Pages/BuyProduct/BuyProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header, Footer } from "../../Components";
import { useCart } from '../../Context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./BuyProduct.scss";
import { useAuth } from '../../hooks/useAuth'; // Import useAuth

const BuyProduct = () => {
  const { productId, storeId } = useParams();
  const [product, setProduct] = useState(null);
  const [productAtStore, setProductAtStore] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [promotions, setPromotions] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [store, setStore] = useState();
  const { state, dispatch } = useCart();
  const [buttonClass, setButtonClass] = useState('');
  const { user } = useAuth(); // Get user from context

  const defaultImages = [
    '/Images/no-image.jpg',
    '/Images/no-image.jpg',
    '/Images/no-image.jpg',
    '/Images/no-image.jpg'
  ];

  const [selectedImage, setSelectedImage] = useState(defaultImages[0]);

  useEffect(() => {
    // Fetch product details based on the productId
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/product/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Product Data:', response.data);
        setProduct(response.data);
        // Set initial discount and discountedPrice from product data
        if (response.data.discount && response.data.discount > 0) {
          setTotalDiscount(response.data.discount);
        }
      })
      .catch((error) => console.error(`Error fetching product ${productId} data:`, error));

    // Fetch product availability at store
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/atstore/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // Choose the storeId with the same storeId
        const selectedStoreInfo = response.data.find((storeInfo) => storeInfo.storeID === storeId);
        setProductAtStore(selectedStoreInfo);
      })
      .catch((error) => console.error(`Error fetching product availability for ${productId}:`, error));
  }, [productId, storeId]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/stores/${storeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setStore(response.data);
      })
      .catch((error) => console.error(`Error fetching store ${storeId} data:`, error));
  }, [storeId]);

  // Function to fetch promotion information on demand
  const fetchPromotionInfo = async () => {
    if (!product) {
      toast.error('Product information is not available.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/product/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Promotion Data:', response.data);
      setPromotions(response.data);
      setTotalDiscount(calculateTotalDiscount(response.data));
      toast.success('Promotions applied successfully!', {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "colored",
      });
    } catch (error) {
      console.error(`Error fetching promotion info for product ${productId}:`, error);
      toast.error('Failed to apply promotions. Please try again later.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
    }
  };

  const calculateTotalDiscount = (promotions) => {
    if (!promotions || promotions.length === 0) {
      return product.discount || 0; // Use product's discount if no promotions
    }
    const promotionDiscount = promotions.reduce((total, promotion) => total + promotion.Discount, 0);
    // Ensure the total discount does not exceed 0.99
    return Math.min((product.discount || 0) + promotionDiscount, 0.99);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    const maxQuantity = productAtStore ? productAtStore.numberAtStore : 1;
    setQuantity(newQuantity > 0 ? Math.min(newQuantity, maxQuantity) : 1);
  };

  const handleAddToCart = () => {
    // Check if user is authenticated and is a customer
    if (!user || user.role !== 'Customer') {
      toast.error('Log in to add items to your cart!', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
      return; // Prevent adding to cart if user is not a customer
    }
  
    // Handle button class changes
    setButtonClass('onclic');
    setTimeout(() => {
      setButtonClass('validate');
      setTimeout(() => {
        setButtonClass('');
      }, 1250);
    }, 2250);
  
    // Check if the product already exists in the cart
    const existingCartItem = state.cart.find(
      (item) => item.productID === product.productID && item.storeID === productAtStore.storeID
    );
  
    if (existingCartItem) {
      // If the product exists, calculate the new quantity
      const newQuantity = existingCartItem.quantity + quantity;
  
      // Check if the new quantity exceeds the available stock
      if (newQuantity > productAtStore.numberAtStore) {
        toast.error('Quantity exceeds available stock.', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
        });
        return; // Prevent adding to cart if quantity exceeds stock
      }
  
      // Update the quantity of the existing item in the cart
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { ...existingCartItem, quantity: newQuantity } });
      setQuantity(1); // Reset the quantity to 1 after adding to cart
  
      toast.success(`Updated quantity of ${product.pName} successfully!`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
  
    } else {
      // If the product does not exist, add it to the cart
      const purchaseInfo = {
        productID: product.productID,
        pName: product.pName,
        quantity: quantity,
        price: product.price,
        storeID: productAtStore.storeID,
        storeName: store.name,
        discount: product.discount || 0,
        discountedPrice: product.discountedPrice || product.price,
        weight: product.weight || 0,
        // Add other relevant info
      };
  
      // Add the new item to the cart
      dispatch({ type: 'ADD_TO_CART', payload: purchaseInfo });
      setQuantity(1); // Reset the quantity to 1 after adding to cart
  
      toast.success(`Added ${quantity} ${product.pName} to the cart.`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
    }
  };

  return (
    <div className="buy-product">
      <Header />
      <div className="buy-product-content">
        {product && productAtStore ? (
          <>
            <div className="product-image-section">
              {/* Main Product Image */}
              <img src={selectedImage} alt={product.pName} className="product-image" />

              {/* Thumbnail Images */}
              <div className="product-thumbnails">
                {defaultImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail-image"
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>
            <div className='product-info-section'>
              <Link to={`/Category/${product.category}`}>
                <p className='product-category'>{product.category}</p>
              </Link>
              <h2 className="product-name">{product.pName}</h2>
              <div className='info'>
                <div className="product-info">
                  {/* Use Link to navigate to the Store page with storeId */}
                  <Link className='product-category' to={`/Store/${productAtStore.storeID}`}>
                    {store?.name && <p>{store.name}</p>}
                  </Link>
                  <p className="product-description">{product.description}</p>
                  {product.discount && product.discount > 0 ? (
                    <>
                      <p className="promo-product-price_2">${product.price.toFixed(2)}</p>
                      <p className="product__disscount_num">{totalDiscount.toFixed(2) * 100}% off</p>
                      <p className="promo-product-discount_2">${(product.discountedPrice).toFixed(2)}</p>
                    </>
                  ) : (
                    <>
                      <p className="product-card-price">${product.price.toFixed(2)}</p>
                    </>
                  )}
                  <div className='product-at-store'>
                    <p>Stock: </p>
                    <p className='aeon_pink'> {productAtStore.numberAtStore} Items In Stock</p>
                  </div>
                </div>
              </div>
              {/* Quantity Input */}
              <div className='quantity-section'>
                <div className="quantity-input">
                  <label htmlFor="quantity"></label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                  />
                </div>
                {/* Add to Cart Button */}
                <button
                  id='add-to-cart-button'
                  className={`add-to-cart ${buttonClass}`}
                  onClick={handleAddToCart}
                >
                </button>
              </div>
              {/* Optional: Button to Fetch Promotions
              {product.discount === 0 && (
                <div className="fetch-promotion">
                  <button onClick={fetchPromotionInfo} className="apply-promotion-button">
                    Apply Promotions
                  </button>
                </div>
              )} */}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuyProduct;