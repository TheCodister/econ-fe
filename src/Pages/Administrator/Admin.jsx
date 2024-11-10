// src/Admin.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserLayout from '../../Components/UserLayout/UserLayout';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';


// Custom theme with primary color #fe3bd4

const Admin = () => {
  const [open, setOpen] = React.useState(true);

  // Menu items for the admin sidebar
  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Manage Products', icon: <ShoppingCartIcon />, path: '/admin/manage-products' },
    { text: 'Manage Inventory', icon: <InventoryIcon />, path: '/admin/manage-inventory' },
    { text: 'Manage Promotions', icon: <LocalOfferIcon />, path: '/admin/manage-promotions' },
    { text: 'View Orders', icon: <ShoppingBagIcon />, path: '/admin/view-orders' },
    { text: 'Manage Users', icon: <PeopleIcon />, path: '/admin/manage-users' },
  ];

  const adminName = 'Admin Name'; // Replace with dynamic name if available
  const adminEmail = 'admin@example.com'; // Replace with dynamic name if available

  return (
    <UserLayout
      menuItems={adminMenuItems}
      userName={adminName}
      userEmail={adminEmail}
      userInitial={adminName.charAt(0)}
      open={open}
      setOpen={setOpen}
    >
      <Outlet />
    </UserLayout>
  );
};

export default Admin;