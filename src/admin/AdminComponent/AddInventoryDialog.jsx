// src/admin/AddInventoryDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const AddInventoryDialog = ({ open, handleClose, handleSave, products, stores }) => {
  const [inventoryRecord, setInventoryRecord] = useState({
    productID: '',
    storeID: '',
    numberAtStore: '',
  });

  const handleChange = (e) => {
    setInventoryRecord({ ...inventoryRecord, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    // Validate data
    handleSave({
      ...inventoryRecord,
      numberAtStore: parseInt(inventoryRecord.numberAtStore, 10),
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Inventory Record</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" required>
          <InputLabel>Product</InputLabel>
          <Select
            name="productID"
            value={inventoryRecord.productID}
            onChange={handleChange}
            label="Product"
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.pName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense" required>
          <InputLabel>Store</InputLabel>
          <Select
            name="storeID"
            value={inventoryRecord.storeID}
            onChange={handleChange}
            label="Store"
          >
            {stores.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Quantity"
          name="numberAtStore"
          type="number"
          value={inventoryRecord.numberAtStore}
          onChange={handleChange}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInventoryDialog;