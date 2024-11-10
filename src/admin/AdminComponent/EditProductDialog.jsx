// src/admin/EditProductDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const EditProductDialog = ({ open, handleClose, handleSave, product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);

  useEffect(() => {
    setUpdatedProduct(product);
  }, [product]);

  const handleChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    // Validate updated product data
    handleSave(updatedProduct);
    handleClose();
  };

  if (!updatedProduct) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Product Name"
          name="pName"
          value={updatedProduct.PName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Category"
          name="category"
          value={updatedProduct.Category}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={updatedProduct.Description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Price"
          name="price"
          type="number"
          value={updatedProduct.Price}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Weight"
          name="weight"
          type="number"
          value={updatedProduct.Weight}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Image URL"
          name="imageURL"
          value={updatedProduct.imageURL}
          onChange={handleChange}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;