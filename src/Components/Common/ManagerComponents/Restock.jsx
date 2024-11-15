import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../../../hooks/useAuth";
import {
  Typography,
  Box,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const Restock = () => {
  const { user } = useAuth();
  const [storeID, setStoreID] = useState("");
  const [products, setProducts] = useState([]);
  const [productID, setProductID] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchStoreID = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/employees/${user.id}`);
        setStoreID(response.data.storeID);
      } catch (error) {
        console.error("Error fetching store ID:", error);
      }
    };

    if (user?.id) {
      fetchStoreID();
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/atstore/product/${storeID}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (storeID) {
      fetchProducts();
    }
  }, [storeID]);

  const restock = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/products/addtostore/${productID}/${storeID}/${amount}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('Restock success', response);
      toast.success('Restock success', {
        position: "bottom-center",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error restocking product:", error);
      toast.error('Error restocking product', {
        position: "bottom-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={restock}
      sx={{
        maxWidth: 700,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 5,
      }}
    >
      <Typography variant="h5" component="div" textAlign="center"
        sx={{ fontWeight: 'bold' }}
      >
        Restock Products
      </Typography>
      <label className="form-label">
        Product:
      </label>
      <select
        className="form-input"
        value={productID}
        required
        onChange={(e) => setProductID(e.target.value)}
      >
        <option value="">Select a product</option>
        {products.map((item) => (
          <option key={item.productID} value={item.productID}>
            {item.product.pName} (Current Stock: {item.numberAtStore})
          </option>
        ))}
      </select>
      <label className="form-label">
        Amount:
      </label>
      <input
        className="form-input"
        type="number"
        value={amount}
        required
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="form-button" type="submit">
        Restock
      </button>
    </Box>
  );
};

export default Restock;