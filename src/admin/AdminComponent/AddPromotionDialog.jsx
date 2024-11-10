// src/admin/AddPromotionDialog.jsx
import React, { useState } from 'react';
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
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';

const promotionTypes = ['ProductPromotion', 'BillPromotion', 'CustomerPromotion'];

const AddPromotionDialog = ({ open, handleClose, handleSave, products }) => {
  const [promotion, setPromotion] = useState({
    name: '',
    description: '',
    discount: '',
    startDay: '',
    endDay: '',
    type: '',
    specificFields: {},
  });

  const handleChange = (e) => {
    setPromotion({ ...promotion, [e.target.name]: e.target.value });
  };

  const handleSpecificFieldChange = (e) => {
    setPromotion({
      ...promotion,
      specificFields: { ...promotion.specificFields, [e.target.name]: e.target.value },
    });
  };

  const onSave = () => {
    // Validate promotion data
    handleSave(promotion);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Promotion</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          name="name"
          value={promotion.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={promotion.description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Discount"
          name="discount"
          type="number"
          inputProps={{ step: '0.01' }}
          value={promotion.discount}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Start Date"
          name="startDay"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={promotion.startDay}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="End Date"
          name="endDay"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={promotion.endDay}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControl fullWidth margin="dense" required>
          <InputLabel>Promotion Type</InputLabel>
          <Select
            name="type"
            value={promotion.type}
            onChange={handleChange}
            label="Promotion Type"
          >
            {promotionTypes.map((type) => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Specific Fields Based on Promotion Type */}
        {promotion.type === 'ProductPromotion' && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Products</InputLabel>
            <Select
              multiple
              name="productIds"
              value={promotion.specificFields.productIds || []}
              onChange={handleSpecificFieldChange}
              input={<OutlinedInput label="Products" />}
              renderValue={(selected) =>
                selected
                  .map(
                    (productId) =>
                      products.find((product) => product.ProductID === productId)?.PName || ''
                  )
                  .join(', ')
              }
            >
              {products.map((product) => (
                <MenuItem key={product.ProductID} value={product.ProductID}>
                  <Checkbox
                    checked={
                      promotion.specificFields.productIds?.indexOf(product.ProductID) > -1 ||
                      false
                    }
                  />
                  <ListItemText primary={product.PName} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select products for the promotion</FormHelperText>
          </FormControl>
        )}

        {promotion.type === 'BillPromotion' && (
          <>
            <TextField
              margin="dense"
              label="Apply Price"
              name="applyPrice"
              type="number"
              value={promotion.specificFields.applyPrice || ''}
              onChange={handleSpecificFieldChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Promotion Chance"
              name="promotionChance"
              type="number"
              value={promotion.specificFields.promotionChance || ''}
              onChange={handleSpecificFieldChange}
              fullWidth
              required
            />
          </>
        )}

        {promotion.type === 'CustomerPromotion' && (
          <TextField
            margin="dense"
            label="Product ID"
            name="productId"
            value={promotion.specificFields.productId || ''}
            onChange={handleSpecificFieldChange}
            fullWidth
            required
          />
        )}
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

export default AddPromotionDialog;