// src/Shipper.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../../Components/UserLayout/UserLayout';
import ShipperDashboard from '../../shipper/Dashboard';
import DeliveryHistory from '../../shipper/DeliveryHistory';
import PendingDeliveries from '../../shipper/PendingDeliveries';
import {
  LocalShipping as LocalShippingIcon,
  Assignment as AssignmentIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';

const Shipper = () => {
  const [open, setOpen] = React.useState(true);

  // Menu items for the shipper sidebar
  const shipperMenuItems = [
    { text: 'Dashboard', icon: <LocalShippingIcon />, path: '/shipper/dashboard' },
    { text: 'Pending Deliveries', icon: <ListAltIcon />, path: '/shipper/pending-deliveries' },
    { text: 'Delivery History', icon: <AssignmentIcon />, path: '/shipper/delivery-history' },
  ];

  const shipperName = 'Shipper Name'; // Replace with dynamic data
  const shipperEmail = 'shipper@example.com'; // Replace with dynamic data

  return (
    <UserLayout
      menuItems={shipperMenuItems}
      userName={shipperName}
      userEmail={shipperEmail}
      userInitial={shipperName.charAt(0)}
      open={open}
      setOpen={setOpen}
    >
      <Routes>
        <Route path="/dashboard" element={<ShipperDashboard />} />
        <Route path="/pending-deliveries" element={<PendingDeliveries />} />
        <Route path="/delivery-history" element={<DeliveryHistory />} />
      </Routes>
    </UserLayout>
  );
};

export default Shipper;