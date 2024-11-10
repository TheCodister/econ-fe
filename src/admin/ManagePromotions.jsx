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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch promotions from the backend API
    // Replace '/api/promotions' with your actual API endpoint
    fetch('/api/promotions')
      .then((response) => response.json())
      .then((data) => setPromotions(data))
      .catch((error) => console.error('Error fetching promotions:', error));
    
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/products/store/1`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleAddPromotion = () => {
    setOpenAddDialog(true);
  };

  const handleSavePromotion = (newPromotion) => {
    // Prepare the data to match your backend's expected format
    // Include specific fields based on the promotion type

    // Send POST request to add promotion
    fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPromotion),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the promotions list
        setPromotions([...promotions, data]);
      })
      .catch((error) => console.error('Error adding promotion:', error));
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
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.id}</TableCell>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>
                  <Chip label={promotion.type} color="primary" variant="outlined" />
                </TableCell>
                <TableCell>{promotion.discount}</TableCell>
                <TableCell>{new Date(promotion.startDay).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(promotion.endDay).toLocaleDateString()}</TableCell>
                <TableCell>{promotion.description}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditPromotion(promotion.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeletePromotion(promotion.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {promotions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
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