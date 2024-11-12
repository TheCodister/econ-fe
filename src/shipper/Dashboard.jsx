// src/shipper/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [shipperOrders, setShipperOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth(); // Get the current shipper's information

  useEffect(() => {
    const fetchShipperOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/transactions`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        // Filter transactions assigned to the current shipper with status Accepted (2) or OnDelivery (3)
        const filteredOrders = response.data.filter(
          (tx) =>
            tx.shipperID === user.id &&
            (tx.deliveryStatus === 2 || tx.deliveryStatus === 3)
        );

        // Sort transactions by dateAndTime in descending order
        const sortedOrders = filteredOrders.sort(
          (a, b) => new Date(b.dateAndTime) - new Date(a.dateAndTime)
        );

        setShipperOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch transactions.',
          severity: 'error',
        });
      }
    };

    fetchShipperOrders();
  }, [user.id]);

  const handleUpdateStatus = async (transactionId, newStatus) => {
    try {
      // Update delivery status
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/transactions/status/${transactionId}/${newStatus}`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      // If setting to Delivered, no need to assign shipper again
      if (newStatus === 3) {
        // Optionally, you can assign the shipper here if not already assigned
        // For this case, shipperID is already assigned
      }

      // Update local state
      setShipperOrders((prev) =>
        prev.map((tx) =>
          tx.transactionId === transactionId
            ? { ...tx, deliveryStatus: newStatus }
            : tx
        )
      );

      setSnackbar({
        open: true,
        message:
          newStatus === 3
            ? 'Delivery status updated to On Delivery.'
            : 'Delivery status updated to Delivered.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating delivery status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update delivery status.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Prepared';
      case 2:
        return 'Accepted';
      case 3:
        return 'On Delivery';
      case 4:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Shipper Dashboard
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="shipper orders table">
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Store ID</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date and Time</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Total Weight</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipperOrders.map((tx) => (
              <TableRow key={tx.transactionId}>
                <TableCell>{tx.transactionId}</TableCell>
                <TableCell>{tx.customerID}</TableCell>
                <TableCell>{tx.storeID}</TableCell>
                <TableCell>{tx.paymentMethod}</TableCell>
                <TableCell>{new Date(tx.dateAndTime).toLocaleString()}</TableCell>
                <TableCell>{getStatusText(tx.deliveryStatus)}</TableCell>
                <TableCell>${tx.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{tx.totalWeight} g</TableCell>
                <TableCell align="center">
                  {tx.deliveryStatus === 2 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateStatus(tx.transactionId, 3)}
                      sx={{ marginRight: '8px' }}
                    >
                      Set On Delivery
                    </Button>
                  )}
                  {tx.deliveryStatus === 3 && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateStatus(tx.transactionId, 4)}
                    >
                      Set Delivered
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {shipperOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No current orders to ship.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;