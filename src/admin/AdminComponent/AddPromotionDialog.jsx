// src/admin/AddPromotionDialog.jsx
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
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import axios from 'axios';

const promotionTypes = ['ProductPromotion', 'BillPromotion', 'CustomerPromotion'];
const categoryList = [
  'Vegetable',
  'Seafood',
  'Spice',
  'Grain',
  'Sauce',
  'Beef',
  'Milk',
  'Fruit',
  'Pork',
];

const AddPromotionDialog = ({ open, handleClose, handleSave }) => {
  const [promotion, setPromotion] = useState({
    name: '',
    description: '',
    discount: '',
    startDay: '',
    endDay: '',
    type: '',
    category: '',
    specificFields: {},
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (promotion.category) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_API_URL}/products/category/${promotion.category}`
          );
          setFilteredProducts(response.data);
        } catch (error) {
          console.error('Error fetching products by category:', error);
        }
      } else {
        setFilteredProducts([]);
      }
    };

    fetchProductsByCategory();
  }, [promotion.category]);

  const handleChange = (e) => {
    setPromotion({ ...promotion, [e.target.name]: e.target.value });
  };

  const handleSpecificFieldChange = (e) => {
    setPromotion({
      ...promotion,
      specificFields: { ...promotion.specificFields, [e.target.name]: e.target.value },
    });
  };

  const handleProductSelection = (event) => {
    const { value } = event.target;
    if (promotion.type === 'CustomerPromotion') {
      setPromotion({
        ...promotion,
        specificFields: { productId: value },
      });
    } else {
      setPromotion({
        ...promotion,
        specificFields: { productIds: value },
      });
    }
  };

  const onSave = () => {
    handleSave(promotion);
    handleClose();
    setPromotion({
      name: '',
      description: '',
      discount: '',
      startDay: '',
      endDay: '',
      type: '',
      category: '',
      specificFields: {},
    });
    setFilteredProducts([]);
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
        {promotion.type && promotion.type !== 'BillPromotion' && (
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={promotion.category}
              onChange={handleChange}
              label="Category"
            >
              {categoryList.map((category) => (
                <MenuItem value={category} key={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Specific Fields Based on Promotion Type */}
        {promotion.type === 'ProductPromotion' && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Products</InputLabel>
            <Select
              multiple
              name="productIds"
              value={promotion.specificFields.productIds || []}
              onChange={handleProductSelection}
              input={<OutlinedInput label="Products" />}
              renderValue={(selected) =>
                selected
                  .map(
                    (productId) =>
                      filteredProducts.find((product) => product.productID === productId)?.pName || ''
                  )
                  .join(', ')
              }
            >
              {filteredProducts.map((product) => (
                <MenuItem key={product.productID} value={product.productID}>
                  <Checkbox
                    checked={
                      promotion.specificFields.productIds?.indexOf(product.productID) > -1 ||
                      false
                    }
                  />
                  <ListItemText primary={product.pName} />
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Product</InputLabel>
            <Select
              name="productId"
              value={promotion.specificFields.productId || ''}
              onChange={handleProductSelection}
              label="Product"
            >
              {filteredProducts.map((product) => (
                <MenuItem key={product.productID} value={product.productID}>
                  {product.pName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a product for the promotion</FormHelperText>
          </FormControl>
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