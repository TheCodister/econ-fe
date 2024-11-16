import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Footer, Header } from "../../Components";
import { useCart } from "../../context/CartContext";
import "./BuyProduct.scss";

const BuyProduct = () => {
  const { productId, storeId } = useParams();
  const [product, setProduct] = useState(null);
  const [productAtStore, setproductAtStore] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [promotions, setPromotions] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [store, setStore] = useState();
  const { state, dispatch } = useCart();
  const [buttonClass, setButtonClass] = useState("");

  const defaultImages = [
    "/Images/no-image.jpg",
    "/Images/no-image.jpg",
    "/Images/no-image.jpg",
    "/Images/no-image.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(defaultImages[0]);

  useEffect(() => {
    // Fetch product details based on the productId
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${productId}`, {
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
        setProduct(data);
      })
      .catch((error) =>
        console.error(`Error fetching product ${productId} data:`, error)
      );

    // Fetch additional information: number at store based on the productId
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/products/productatstore/${productId}/${storeId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Fetched Data:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        setproductAtStore(data);
      })
      .catch((error) =>
        console.error(`Error fetching product ${productId} data:`, error)
      );
  }, [productId]);

  // Fetch additional information: promotion based on the productId
  useEffect(() => {
    const fetchPromotionInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products/promotionfromproduct/${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const promotionInfo = response.data;
        setPromotions(promotionInfo);
        setTotalDiscount(calculateTotalDiscount(promotionInfo));
      } catch (error) {
        console.error(
          `Error fetching promotion info for product ${product.ProductID}:`,
          error
        );
      }
    };

    fetchPromotionInfo();
  }, [productId]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/store/${storeId}`, {
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
        setStore(data);
      })
      .catch((error) =>
        console.error(`Error fetching store ${storeId} data:`, error)
      );
  }, [storeId]);

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

  const calculateTotalDiscount = (promotions) => {
    if (!promotions || promotions.length === 0) {
      return 0; // No discounts
    }
    const totalDiscount = promotions.reduce(
      (total, promotion) => total + promotion.Discount,
      0
    );
    // Ensure the total discount does not exceed 0.99
    return Math.min(totalDiscount, 0.99);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    const maxQuantity = productAtStore ? productAtStore.NumberAtStore : 1;
    setQuantity(newQuantity > 0 ? Math.min(newQuantity, maxQuantity) : 1);
  };

  const handleAddToCart = () => {
    // Handle button class changes
    if (!getCookie("userID")) {
      console.error("Error: User is not logged in.");

      toast.error("Log in to add items to your cart!", {
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

    setButtonClass("onclic");
    setTimeout(() => {
      setButtonClass("validate");
      setTimeout(() => {
        setButtonClass("");
      }, 1250);
    }, 2250);

    // Check if the product already exists in the cart
    const existingCartItem = state.cart.find(
      (item) =>
        item.ProductID === product.ProductID &&
        item.StoreID === productAtStore.StoreID
    );

    if (existingCartItem) {
      // If the product exists, calculate the new quantity
      const newQuantity = existingCartItem.Quantity + quantity;

      // Check if the new quantity exceeds the available stock
      if (newQuantity > productAtStore.NumberAtStore) {
        console.error("Error: Quantity exceeds available stock.");
        return; // Prevent adding to cart if quantity exceeds stock
      }

      // Update the quantity of the existing item in the cart
      dispatch({
        type: "UPDATE_CART_ITEM",
        payload: { ...existingCartItem, Quantity: newQuantity },
      });
      console.log(
        `Updated quantity of ${product.PName} in the cart: ${newQuantity}`
      );
      setQuantity(1); // Reset the quantity to 1 after adding to cart

      toast.success(`Updated quantity of ${product.PName} successfully!`, {
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
        ProductID: product.ProductID,
        PName: product.PName,
        Quantity: quantity,
        Price: product.Price,
        StoreID: productAtStore.StoreID,
        StoreName: store.Name,
        Promotion: promotions,
        TotalDiscount: totalDiscount,
        // Add other relevant info
      };

      // Add the new item to the cart
      dispatch({ type: "ADD_TO_CART", payload: purchaseInfo });
      console.log(`Added ${quantity} ${product.PName} to the cart.`);
      setQuantity(1); // Reset the quantity to 1 after adding to cart

      toast.success(`Added ${quantity} ${product.PName} to the cart.`, {
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
              <img
                src={selectedImage}
                alt={product.PName}
                className="product-image"
              />

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
            <div className="product-info-section">
              <Link to={`/Category/${product.Category}`}>
                <p className="product-category">{product.Category}</p>
              </Link>
              <h2 className="product-name">{product.PName}</h2>
              <div className="info">
                <div className="product-info">
                  <div className="">
                    {/* Use Link to navigate to the Store page with productId */}
                    <Link
                      className="product-category"
                      to={`/Store/${productAtStore.StoreID}`}
                    >
                      {store?.Name && <p>{store.Name}</p>}
                    </Link>
                    {/* Add more details as needed */}
                  </div>
                  {/* <p>Category: {product.Category}</p> */}
                  <p className="product-description">{product.Description}</p>
                  {promotions && promotions.length > 0 ? (
                    <>
                      <p className="promo-product-price_2">
                        ${product.Price.toFixed(2)}
                      </p>
                      <p className="product__disscount_num">
                        {totalDiscount.toFixed(2) * 100}% off
                      </p>
                      <p className="promo-product-discount_2">
                        ${(product.Price * (1 - totalDiscount)).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="product-card-price">
                        ${product.Price.toFixed(2)}
                      </p>
                    </>
                  )}
                  <div className="product-at-store">
                    <p>Stock: </p>
                    <p className="aeon_pink">
                      {" "}
                      {productAtStore.NumberAtStore} Items In Stock
                    </p>
                  </div>
                </div>

                {/* Add more details as needed */}
                {/* Additional Information */}
                {/* <div className="provider">
                  <Link to={`/Store/${productAtStore.StoreID}`}>
                    {store?.Name && <p>Store: {store.Name}</p>}
                  </Link>
                </div> */}
              </div>
              {/* Quantity Input */}
              <div className="">
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
                  id="add-to-cart-button"
                  className={`add-to-cart ${buttonClass}`}
                  onClick={handleAddToCart}
                ></button>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Footer />
    </div>
  );
};

export default BuyProduct;
