import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyOrders.scss"; // Ensure you have a corresponding SCSS file
import { useAuth } from "../../../hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
} from "@mui/material";

const MyOrders = () => {
  const { user } = useAuth(); // Access user from useAuth
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      if (!user && user.id) return;

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/transactions/customer/${user.id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      let fetchedTransactions = response.data || [];

      // Sort transactions from newest to oldest based on dateAndTime
      fetchedTransactions.sort((a, b) => {
        return new Date(b.dateAndTime) - new Date(a.dateAndTime);
      });

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const deliveryStatusMap = {
    0: "Pending",
    1: "Prepared",
    2: "Accepted",
    3: "On Delivery",
    4: "Delivered",
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  return (
    <div className="my-orders">
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      {transactions && transactions.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Order ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((order) => (
                <TableRow key={order.transactionId}>
                  <TableCell>#{order.transactionId}</TableCell>
                  <TableCell>
                    {new Date(order.dateAndTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {deliveryStatusMap[order.deliveryStatus] || "Unknown"}
                  </TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.transactionId}`} underline="none">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No transactions available</Typography>
      )}
    </div>
  );
};

export default MyOrders;
