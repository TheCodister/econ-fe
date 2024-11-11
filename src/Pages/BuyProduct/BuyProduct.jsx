import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header, Footer } from "../../Components";
import { useCart } from '../../Context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./BuyProduct.scss";

const BuyProduct = () => {
  const { productId, storeId } = useParams();
  const [product, setProduct] = useState(null);
  const [productAtStore, setproductAtStore] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [promotions, setPromotions] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [ store, setStore ] = useState();
  const { state, dispatch } = useCart();
  const [buttonClass, setButtonClass] = useState('');

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
        console.log('Fetched Product Data:', response.data);
        return response.data;
      })
      .then((data) => {
        console.log('Fetched Data:', data);
        setProduct(data);
      })
      .catch((error) => console.error(`Error fetching product ${productId} data:`, error));

      // Fetch additional information: number at store based on the productId
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/atstore/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('Fetched Data:', response.data);
          return response.data;
        })
        .then((data) => {
          console.log('Fetched Data:', data);
          // Choose the storeId with the same storeId
          const selectedStoreInfo = data.find((storeInfo) => storeInfo.storeID === (storeId));
          console.log('Selected Store Info:', selectedStoreInfo);
          setproductAtStore(selectedStoreInfo);
        })
        .catch((error) => console.error(`Error fetching product ${productId} data:`, error));
  }, [productId]);

  // Fetch additional information: promotion based on the productId
  useEffect(() => {
    const fetchPromotionInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/promotionfromproduct/${productId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const promotionInfo = response.data;
        setPromotions(promotionInfo);
        setTotalDiscount(calculateTotalDiscount(promotionInfo));
      } catch (error) {
        console.error(`Error fetching promotion info for product ${product.productID}:`, error);
      }
    };

    fetchPromotionInfo();
  }, [productId]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/stores/${storeId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('Fetched Data:', response.data);
          return response.data;
        })
        .then((data) => {
          console.log('Fetched Data:', data);
          setStore(data);
        })
        .catch((error) => console.error(`Error fetching store ${storeId} data:`, error));
    }, [storeId]);

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
  };    

  const calculateTotalDiscount = (promotions) => {
    if (!promotions || promotions.length === 0) {
      return 0; // No discounts
    }
    const totalDiscount = promotions.reduce((total, promotion) => total + promotion.Discount, 0);
    // Ensure the total discount does not exceed 0.99
    return Math.min(totalDiscount, 0.99);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    const maxQuantity = productAtStore ? productAtStore.numberAtStore : 1;
    setQuantity(newQuantity > 0 ? Math.min(newQuantity, maxQuantity) : 1);
  };

  const handleAddToCart = () => {
    // Handle button class changes
    if (!getCookie('userID')) {
      console.error("Error: User is not logged in.");

      toast.error('Log in to add items to your cart!', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      return; // Prevent adding to cart if user is not logged in
    }

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
      const newQuantity = existingCartItem.Quantity + quantity;
  
      // Check if the new quantity exceeds the available stock
      if (newQuantity > productAtStore.numberAtStore) {
        console.error("Error: Quantity exceeds available stock.");
        return; // Prevent adding to cart if quantity exceeds stock
      }
  
      // Update the quantity of the existing item in the cart
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { ...existingCartItem, Quantity: newQuantity } });
      console.log(`Updated quantity of ${product.pName} in the cart: ${newQuantity}`);
      setQuantity(1); // Reset the quantity to 1 after adding to cart

      toast.success(`Updated quantity of ${product.pName} successfully!`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    } else {
      // If the product does not exist, add it to the cart
      const purchaseInfo = {
        ProductID: product.productID,
        PName: product.pName,
        Quantity: quantity,
        Price: product.price,
        storeID: productAtStore.storeID,
        StoreName: store.name,
        Promotion: promotions,
        TotalDiscount: totalDiscount
        // Add other relevant info
      };
  
      // Add the new item to the cart
      dispatch({ type: 'ADD_TO_CART', payload: purchaseInfo });
      console.log(`Added ${quantity} ${product.pName} to the cart.`);
      setQuantity(1); // Reset the quantity to 1 after adding to cart

      toast.success(`Added ${quantity} ${product.pName} to the cart.`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
                  <div className="">
                    {/* Use Link to navigate to the Store page with productId */}
                    <Link className='product-category' to={`/Store/${productAtStore.storeID}`}>
                      {store?.name && <p>{store.name}</p>}
                    </Link>
                  {/* Add more details as needed */}
                  </div>
                  {/* <p>Category: {product.category}</p> */}
                  <p className="product-description">{product.Description}</p>
                  {promotions && promotions.length > 0 ? (
                    <>
                      <p className="promo-product-price_2">${product.price.toFixed(2)}</p>
                      <p className="product__disscount_num">{totalDiscount.toFixed(2) * 100}% off</p>
                      <p className="promo-product-discount_2">${(product.price * (1 - totalDiscount)).toFixed(2)}</p>
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

                {/* Add more details as needed */}
                {/* Additional Information */}
                {/* <div className="provider">
                  <Link to={`/Store/${productAtStore.storeID}`}>
                    {store?.name && <p>Store: {store.name}</p>}
                  </Link>
                </div> */}
              </div>
              {/* Quantity Input */}
              <div className=''>
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
