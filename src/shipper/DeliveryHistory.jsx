// src/DeliveryHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Fetch delivery history from the backend
    axios.get('/api/shipper/delivery-history')
      .then(response => setDeliveries(response.data))
      .catch(error => console.error('Error fetching delivery history:', error));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Delivery History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.map(delivery => (
            <TableRow key={delivery.id}>
              <TableCell>{delivery.id}</TableCell>
              <TableCell>{delivery.date}</TableCell>
              <TableCell>{delivery.customerName}</TableCell>
              <TableCell>{delivery.totalPrice}</TableCell>
              <TableCell>{delivery.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryHistory;