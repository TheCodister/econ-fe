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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';

const categoryList = [
  { name: 'Vegetable' },
  { name: 'Seafood' },
  { name: 'Spice' },
  { name: 'Grain' },
  { name: 'Sauce' },
  { name: 'Beef' },
  { name: 'Milk' },
  { name: 'Fruit' },
  { name: 'Pork' },
];

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Vegetable');

  useEffect(() => {
    // Fetch products by selected category using axios
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products/category/${selectedCategory}`
        );
        // console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory]);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddProduct = () => {
    setOpenAddDialog(true);
  };

  const handleSaveProduct = async (newProduct) => {
    newProduct.price = parseFloat(newProduct.price);
    newProduct.weight = parseInt(newProduct.weight, 10);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/products`,
        newProduct
      );
      // Update the products list
      setProducts([...products, response.data]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.productID === productId);
    setSelectedProduct(product);
    setOpenEditDialog(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/products/${updatedProduct.productID}`,
        updatedProduct
      );
      // Update the products list in state
      setProducts(
        products.map((product) =>
          product.productID === response.data.productID ? response.data : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products/${productId}`
        );
        // Remove the deleted product from the state
        setProducts(products.filter((product) => product.productID !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      {/* Category Selection */}
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="category-select-label">Select Category</InputLabel>
        <Select
          labelId="category-select-label"
          value={selectedCategory}
          label="Select Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryList.map((category) => (
            <MenuItem key={category.name} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddProduct}
        sx={{ mb: 2, ml: 2 }}
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
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.productID}>
                  <TableCell>{product.productID}</TableCell>
                  <TableCell>{product.pName}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">${product.price}</TableCell>
                  <TableCell align="right">{product.weight}g</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No products found in this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <EditProductDialog
          open={openEditDialog}
          handleClose={() => setOpenEditDialog(false)}
          handleSave={handleUpdateProduct}
          product={selectedProduct}
        />
      </TableContainer>
    </Box>
  );
};

export default ManageProducts;