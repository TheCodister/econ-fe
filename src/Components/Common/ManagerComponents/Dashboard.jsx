// src/pages/Manager/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { ShowProduct, StoreCard } from "../../../Components";
import Pagination from "../../../Components/Helper/Pagination";
import ProductList from "../ProductList/ProductList";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import "./Dashboard.scss";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(4); // Adjust the number of products per page as needed
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/employees/${user.id}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const employeeData = response.data;
        setStoreId(employeeData.storeID);
      } catch (error) {
        console.error(`Error fetching employee ${user.id} data:`, error);
      }
    };

    if (user && user.id) {
      fetchEmployeeInfo();
    }
  }, [user]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Fetch store information
        const storeResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/stores/${storeId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setStore(storeResponse.data);

        // Fetch products
        const productsResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products/store/${storeId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error(`Error fetching store ${storeId} data:`, error);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  // Calculate indexes for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Dashboard</h1>
      {store && (
        <div className="store__header">
          <img
            className="cover_picture"
            src="/Images/prop_image/store.jpg"
            alt="store_image"
          />
          <StoreCard store={store} />
        </div>
      )}
      <h2>Products</h2>
      <ProductList products={currentProducts} storeId={storeId} size="small" />
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Dashboard;