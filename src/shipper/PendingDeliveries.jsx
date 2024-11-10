// src/PendingDeliveries.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const PendingDeliveries = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [vehicleCapacity, setVehicleCapacity] = useState(0);

  useEffect(() => {
    // Fetch vehicle capacity
    axios.get('/api/shipper/vehicle-capacity')
      .then(response => setVehicleCapacity(response.data.capacity))
      .catch(error => console.error('Error fetching vehicle capacity:', error));

    // Fetch pending deliveries
    axios.get('/api/shipper/pending-deliveries')
      .then(response => setPendingOrders(response.data))
      .catch(error => console.error('Error fetching pending deliveries:', error));
  }, []);

  const handleAddToDeliveries = (order) => {
    const currentTotalWeight = selectedOrders.reduce((sum, o) => sum + o.totalWeight, 0);
    if (currentTotalWeight + order.totalWeight <= vehicleCapacity) {
      setSelectedOrders(prev => [...prev, order]);
    } else {
      alert('Cannot add order. Exceeds vehicle capacity.');
    }
  };

  const handleConfirmDeliveries = () => {
    const orderIds = selectedOrders.map(order => order.id);
    axios.post('/api/shipper/accept-deliveries', { orderIds })
      .then(() => {
        // Update pending orders and reset selected orders
        setPendingOrders(prev => prev.filter(order => !orderIds.includes(order.id)));
        setSelectedOrders([]);
        alert('Deliveries accepted successfully.');
      })
      .catch(error => console.error('Error accepting deliveries:', error));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Pending Deliveries
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total Weight</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingOrders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.totalWeight}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleAddToDeliveries(order)}
                >
                  Add to Deliveries
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedOrders.length > 0 && (
        <div>
          <h2>Selected Orders</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Total Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.totalWeight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmDeliveries}
          >
            Confirm Deliveries
          </Button>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;