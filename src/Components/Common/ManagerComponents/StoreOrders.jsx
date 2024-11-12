// src/admin/StoreOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

const StoreOrders = () => {
  const [transactions, setTransactions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/transactions`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setSnackbar({ open: true, message: "Failed to fetch transactions.", severity: "error" });
      }
    };

    fetchTransactions();
  }, []);

  const handlePrepare = async (transactionId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/transactions/status/${transactionId}/1`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.transactionId === transactionId ? { ...tx, deliveryStatus: 1 } : tx
        )
      );
      setSnackbar({ open: true, message: "Transaction status updated to Prepared.", severity: "success" });
    } catch (error) {
      console.error("Error updating transaction status:", error);
      setSnackbar({ open: true, message: "Failed to update transaction status.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Prepared";
      case 2:
        return "Accepted";
      case 3:
        return "On Delivery";
      case 4:
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Store Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Store ID</TableCell>
              <TableCell>Shipper ID</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date and Time</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Total Weight</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.transactionId}>
                <TableCell>{tx.transactionId}</TableCell>
                <TableCell>{tx.customerID}</TableCell>
                <TableCell>{tx.storeID}</TableCell>
                <TableCell>{tx.shipperID || "N/A"}</TableCell>
                <TableCell>{tx.paymentMethod}</TableCell>
                <TableCell>{new Date(tx.dateAndTime).toLocaleString()}</TableCell>
                <TableCell>{getStatusText(tx.deliveryStatus)}</TableCell>
                <TableCell>${tx.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{tx.totalWeight} g</TableCell>
                <TableCell align="center">
                  {tx.deliveryStatus === 0 && (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#fe3bd4", color: "white" }}
                      onClick={() => handlePrepare(tx.transactionId)}
                    >
                      Prepare
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No transactions found.
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreOrders;