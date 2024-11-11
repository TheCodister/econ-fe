import React from "react";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const Restock = () => {
      //Varables for product restock
    const [productID, setproductID] = useState("");
    const [storeID, setstoreID] = useState("");
    const [amount, setamount] = useState("");

    const restock = async (event) => {
        event.preventDefault();
        console.log('Restock:', productID, storeID, amount);
        axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/products/addtostore/${productID}/${storeID}/${amount}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
            console.log('Restock success', response);
            toast.success('Restock success', {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            return response.data;
          /*setproductID('');
          setstoreID('');
          setamount('');*/
        })
        .catch((error) => {
            console.error("Error restocking product:", error);
            toast.error('Error restocking product', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        });
    }

    return (
        <form >
            <label className="form-label" >
              ProductID:
            </label>
            <input className="form-input" type="text" id="productID" name="ProductID" value={productID} required onChange={(e) => setproductID(e.target.value)} />
            <label className="form-label" >
              storeID:
            </label>
            <input className="form-input" type="text" id="productID" name="ProductID" value={storeID} required onChange={(e) => setstoreID(e.target.value)} />
            <label className="form-label" >
              Amount:
            </label>
            <input className="form-input" type="text" id="productID" name="ProductID" value={amount} required onChange={(e) => setamount(e.target.value)} />
            <button className="form-button" onClick={restock}>
              Restock
            </button>
        </form>
    );

}

export default Restock;