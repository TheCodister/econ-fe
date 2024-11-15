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

const ManageInventory = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    // Fetch stores
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/stores`)
      .then((response) => setStores(response.data))
      .catch((error) => console.error('Error fetching stores:', error));
  }, []);

  useEffect(() => {
    if (selectedStore) {
      // Fetch inventory data for selected store
      axios
        .get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/products/atstore/product/${selectedStore}`
        )
        .then((response) => setInventoryData(response.data))
        .catch((error) =>
          console.error('Error fetching inventory data:', error)
        );
    } else {
      setInventoryData([]);
    }
  }, [selectedStore]);

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
  };

  const handleEditInventory = (productID, storeID) => {
    const record = inventoryData.find(
      (item) => item.productID === productID && item.storeID === storeID
    );
    setSelectedRecord(record);
    setOpenEditDialog(true);
  };

  const handleSaveInventory = (updatedRecord) => {
    // Send PUT request to update the inventory record
    axios
      .put(`${import.meta.env.VITE_REACT_APP_API_URL}/inventory`, updatedRecord)
      .then((response) => {
        // Update the inventoryData state
        setInventoryData(
          inventoryData.map((item) =>
            item.productID === response.data.productID &&
            item.storeID === response.data.storeID
              ? response.data
              : item
          )
        );
        setOpenEditDialog(false);
      })
      .catch((error) => console.error('Error updating inventory:', error));
  };

  const handleDeleteInventory = (productID, storeID) => {
    // Send DELETE request to delete the inventory record
    axios
      .delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/inventory/${productID}/${storeID}`
      )
      .then(() => {
        // Update the inventoryData state
        setInventoryData(
          inventoryData.filter(
            (item) =>
              !(item.productID === productID && item.storeID === storeID)
          )
        );
      })
      .catch((error) => console.error('Error deleting inventory:', error));
  };

  const handleAddInventory = () => {
    setOpenAddDialog(true);
  };

  const handleSaveNewInventory = (newRecord) => {
    // Send POST request to add inventory record
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_URL}/inventory`, newRecord)
      .then((response) => {
        // Update the inventoryData state
        setInventoryData([...inventoryData, response.data]);
        setOpenAddDialog(false);
      })
      .catch((error) => console.error('Error adding inventory record:', error));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Inventory
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="store-select-label">Select Store</InputLabel>
        <Select
          labelId="store-select-label"
          id="store-select"
          value={selectedStore}
          label="Select Store"
          onChange={handleStoreChange}
        >
          {stores.map((store) => (
            <MenuItem key={store.storeID} value={store.storeID}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedStore && (
        <>
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
            selectedStore={selectedStore}
            existingProducts={inventoryData.map((item) => item.productID)}
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
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData.map((record) => (
                  <TableRow key={`${record.productID}-${record.storeID}`}>
                    <TableCell>{record.productID}</TableCell>
                    <TableCell>{record.product.pName}</TableCell>
                    <TableCell>{record.numberAtStore}</TableCell>
                    <TableCell>${record.product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleEditInventory(
                            record.productID,
                            record.storeID
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDeleteInventory(
                            record.productID,
                            record.storeID
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {inventoryData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No inventory data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {!selectedStore && (
        <Typography variant="h6" gutterBottom>
          Please select a store to view its inventory.
        </Typography>
      )}
    </Box>
  );
};

export default ManageInventory;