// src/admin/EditInventoryDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const EditInventoryDialog = ({ open, handleClose, handleSave, record }) => {
  const [quantity, setQuantity] = useState(0);

  const onSave = () => {
    const updatedRecord = { ...record, numberAtStore: parseInt(quantity, 10) };
    handleSave(updatedRecord);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Inventory</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Product Name"
          value={""}
          fullWidth
          disabled
        />
        <TextField
          margin="dense"
          label="Store Name"
          value={"record.storeName"}
          fullWidth
          disabled
        />
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInventoryDialog;