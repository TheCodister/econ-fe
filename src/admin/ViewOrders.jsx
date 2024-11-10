// src/admin/ViewOrders.jsx
import React, { useState, useEffect } from 'react';
import OrderDetailsDialog from './AdminComponent/OrderDetailsDialog';
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
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const deliveryStatuses = [
  'Pending',
  'Prepared',
  'Accepted',
  'OnDelivery',
  'Delivered',
];

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = () => {
    // Fetch orders from the backend API
    // Replace '/api/orders' with your actual API endpoint
    let endpoint = '/api/orders';
    if (filterStatus) {
      endpoint += `?status=${filterStatus}`;
    }
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  };

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDetailsDialog(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    // Update the delivery status of the order
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryStatus: newStatus }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the orders state to reflect the change
          setOrders(
            orders.map((order) =>
              order.id === orderId ? { ...order, deliveryStatus: newStatus } : order
            )
          );
        } else {
          console.error('Failed to update status');
        }
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        View Orders
      </Typography>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Status</InputLabel>
        <Select
          value={filterStatus}
          label="Filter by Status"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {deliveryStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date and Time</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.storeName}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(order.dateAndTime).toLocaleString()}
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <FormControl variant="standard">
                    <Select
                      value={order.deliveryStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      {deliveryStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {/* You can add more actions if needed */}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <OrderDetailsDialog
            open={openDetailsDialog}
            handleClose={() => setOpenDetailsDialog(false)}
            orderId={selectedOrderId}
          />
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewOrders;