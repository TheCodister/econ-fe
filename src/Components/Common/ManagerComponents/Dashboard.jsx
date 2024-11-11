import React, { useEffect, useState } from "react";
import { ShowProduct, StoreCard } from "../../../Components";
import Pagination from "../../../Components/Helper/Pagination";
import ProductList from "../ProductList/ProductList";
import axios from "axios";
import "./Dashboard.scss";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(4); // Adjust the number of products per page as needed
    const storeId = 1;
    const [store, setStore] = useState();

    useEffect(() => {
        // Fetch products
        axios
            .get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/store/${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) =>
                console.error(`Error fetching store ${storeId} data:`, error)
            );

        // Fetch store details
        axios
            .get(`${import.meta.env.VITE_REACT_APP_API_URL}/store/${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                setStore(response.data);
            })
            .catch((error) =>
                console.error(`Error fetching store ${storeId} data:`, error)
            );
    }, [storeId]);

    // Calculate indexes for pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Dashboard</h1>
            {store && 
                <div className="store__header">
                    <img className="cover_picture" src="/Images/prop_image/store.jpg" alt="store_image" />
                    <StoreCard store={store} />
                </div>
            }
            <h2>Products</h2>
            {/* <div className="products__container_2">
                {currentProducts.map((product) => (
                    <ShowProduct key={product.productID} product={product} storeId={storeId} />
                ))}
            </div> */}
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
