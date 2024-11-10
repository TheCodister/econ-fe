// src/admin/ManageInventory.jsx
import React, { useState, useEffect } from 'react';
import AddInventoryDialog from './AdminComponent/AddInventoryDialog';
import EditInventoryDialog from './AdminComponent/EditInventoryDialog';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const ManageInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // Fetch inventory data from the backend API
    // Replace '/api/inventory' with your actual API endpoint
    fetch('/api/inventory')
      .then((response) => response.json())
      .then((data) => setInventoryData(data))
      .catch((error) => console.error('Error fetching inventory data:', error));
  }, []);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEditInventory = (productId, storeId) => {
    const record = inventoryData.find(
      (item) => item.productID === productId && item.storeID === storeId
    );
    setSelectedRecord(record);
    setOpenEditDialog(true);
  };

  const handleSaveInventory = (updatedRecord) => {
    // Send PUT request to update the inventory record
    fetch(`/api/inventory`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRecord),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the inventoryData state
        setInventoryData(
          inventoryData.map((item) =>
            item.productID === data.productID && item.storeID === data.storeID
              ? data
              : item
          )
        );
      })
      .catch((error) => console.error('Error updating inventory:', error));
  };

  const handleDeleteInventory = (productId, storeId) => {
    // Handle deleting inventory record
    console.log('Delete inventory for product:', productId, 'at store:', storeId);
  };

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch inventory data
    fetch('/api/inventory')
      .then((response) => response.json())
      .then((data) => setInventoryData(data))
      .catch((error) => console.error('Error fetching inventory data:', error));

    // Fetch products
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));

    // Fetch stores
    fetch('/api/stores')
      .then((response) => response.json())
      .then((data) => setStores(data))
      .catch((error) => console.error('Error fetching stores:', error));
  }, []);

  const handleAddInventory = () => {
    setOpenAddDialog(true);
  };

  const handleSaveNewInventory = (newRecord) => {
    // Send POST request to add inventory record
    fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the inventoryData state
        setInventoryData([...inventoryData, data]);
      })
      .catch((error) => console.error('Error adding inventory record:', error));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Inventory
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddInventory}
        sx={{ mb: 2 }}
      >
        Add New Inventory Record
      </Button>
      <AddInventoryDialog
        open={openAddDialog}
        handleClose={() => setOpenAddDialog(false)}
        handleSave={handleSaveNewInventory}
        products={products}
        stores={stores}
      />
      <EditInventoryDialog
        open={openEditDialog}
        handleClose={() => setOpenEditDialog(false)}
        handleSave={handleSaveInventory}
        record={selectedRecord}
      />
      <TableContainer component={Paper}>
        <Table aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Store ID</TableCell>
              <TableCell>Store Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((record) => (
              <TableRow key={`${record.productID}-${record.storeID}`}>
                <TableCell>{record.productID}</TableCell>
                <TableCell>{record.productName}</TableCell>
                <TableCell>{record.storeID}</TableCell>
                <TableCell>{record.storeName}</TableCell>
                <TableCell>{record.numberAtStore}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditInventory(record.productID, record.storeID)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteInventory(record.productID, record.storeID)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {inventoryData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No inventory data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageInventory;