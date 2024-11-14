// src/admin/ManagePromotions.jsx
import React, { useState, useEffect } from 'react';
import AddPromotionDialog from './AdminComponent/AddPromotionDialog';
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
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // Fetch promotions from different endpoints using Axios
        const [billPromotionsRes, customerPromotionsRes, productPromotionsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/bill`),
          axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/customer`),
          axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/product`),
        ]);

        // Extract data from responses
        const billPromotions = billPromotionsRes.data;
        const customerPromotions = customerPromotionsRes.data;
        const productPromotions = productPromotionsRes.data;

        // Add a 'type' field to distinguish promotion types
        const formattedBillPromotions = billPromotions.map((promo) => ({
          ...promo,
          type: 'Bill Promotion',
        }));
        const formattedCustomerPromotions = customerPromotions.map((promo) => ({
          ...promo,
          type: 'Customer Promotion',
        }));
        const formattedProductPromotions = productPromotions.map((promo) => ({
          ...promo,
          type: 'Product Promotion',
        }));

        // Combine all promotions into one array
        setPromotions([
          ...formattedBillPromotions,
          ...formattedCustomerPromotions,
          ...formattedProductPromotions,
        ]);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchPromotions();
    fetchProducts();
  }, []);

  const handleAddPromotion = () => {
    setOpenAddDialog(true);
  };

  const handleSavePromotion = async (newPromotion) => {
    // Handle saving new promotion using Axios
    // You need to implement the API call based on your backend
    console.log('Save new promotion:', newPromotion);
  };

  const handleEditPromotion = (promotionId) => {
    // Handle editing promotion
    console.log('Edit promotion:', promotionId);
  };

  const handleDeletePromotion = (promotionId) => {
    // Handle deleting promotion
    console.log('Delete promotion:', promotionId);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Promotions
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddPromotion}
        sx={{ mb: 2 }}
      >
        Add New Promotion
      </Button>
      <AddPromotionDialog
        open={openAddDialog}
        handleClose={() => setOpenAddDialog(false)}
        handleSave={handleSavePromotion}
        products={products}
      />
      <TableContainer component={Paper}>
        <Table aria-label="promotions table">
          <TableHead>
            <TableRow>
              <TableCell>Promotion ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow
                key={
                  promotion.promotionId ||
                  promotion.promotionID ||
                  promotion.id
                }
              >
                <TableCell>
                  {promotion.promotionId ||
                    promotion.promotionID ||
                    promotion.id}
                </TableCell>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>
                  <Chip
                    label={promotion.type}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{promotion.discount * 100}%</TableCell>
                <TableCell>
                  {promotion.type === 'Bill Promotion' && (
                    <Typography variant="body2">
                      Apply Price: ${promotion.applyPrice.toFixed(2)}
                      <br />
                      Chance: {promotion.promotionChance}
                    </Typography>
                  )}
                  {promotion.type === 'Customer Promotion' &&
                    promotion.product && (
                      <Typography variant="body2">
                        Product: {promotion.product.pName}
                      </Typography>
                    )}
                  {promotion.type === 'Product Promotion' &&
                    promotion.products && (
                      <Stack direction="row" spacing={1}>
                        {promotion.products.map((product) => (
                          <Tooltip
                            key={product.productID || product.productId}
                            title={product.pName}
                          >
                            <Chip label={product.pName} />
                          </Tooltip>
                        ))}
                      </Stack>
                    )}
                </TableCell>
                <TableCell>
                  {new Date(promotion.startDay).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(promotion.endDay).toLocaleDateString()}
                </TableCell>
                <TableCell>{promotion.description}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleEditPromotion(
                        promotion.promotionId ||
                          promotion.promotionID ||
                          promotion.id
                      )
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDeletePromotion(
                        promotion.promotionId ||
                          promotion.promotionID ||
                          promotion.id
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {promotions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No promotions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagePromotions;