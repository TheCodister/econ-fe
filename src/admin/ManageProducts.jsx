// src/admin/ManageProducts.jsx
import React, { useState, useEffect } from 'react';
import AddProductDialog from './AdminComponent/AddProductDialog';
import EditProductDialog from './AdminComponent/EditProductDialog';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend API
    // Replace '/api/products' with your actual API endpoint
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/products/store/1`)
      .then((response) => response.json())
      .then((data) => (
        console.log('Fetched products:', data),
        setProducts(data)
      ))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddProduct = () => {
    setOpenAddDialog(true);
  };

  const handleSaveProduct = (newProduct) => {
    // Convert price and weight to proper types
    newProduct.price = parseFloat(newProduct.price);
    newProduct.weight = parseInt(newProduct.weight);

    // Send POST request to add product
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the products list
        setProducts([...products, data]);
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.productID === productId);
    setSelectedProduct(product);
    setOpenEditDialog(true);
  };

  const handleUpdateProduct = (updatedProduct) => {
    // Send PUT request to update the product
    fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the products list in state
        setProducts(
          products.map((product) =>
            product.id === data.id ? data : product
          )
        );
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  const handleDeleteProduct = (productId) => {
    return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
        .then(() => {
          // Remove the deleted product from the state
          setProducts(products.filter((product) => product.id !== productId));
        })
        .catch((error) => console.error('Error deleting product:', error));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddProduct}
        sx={{ mb: 2 }}
      >
        Add New Product
      </Button>
      <AddProductDialog
        open={openAddDialog}
        handleClose={() => setOpenAddDialog(false)}
        handleSave={handleSaveProduct}
      />
      <TableContainer component={Paper}>
        <Table aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell>Image URL</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productID}>
                <TableCell>{product.productID}</TableCell>
                <TableCell>{product.pName}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">${product.price}</TableCell>
                <TableCell align="right">{product.weight}</TableCell>
                <TableCell>{product.imageURL}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduct(product.productID)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteProduct(product.productID)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <EditProductDialog
            open={openEditDialog}
            handleClose={() => setOpenEditDialog(false)}
            handleSave={handleUpdateProduct}
            product={selectedProduct}
          />
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageProducts;