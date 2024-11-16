// src/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import AddUserDialog from './AdminComponent/AddUserDialog';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend API using axios
    const fetchUsers = async () => {
      try {
        // Fetch customers
        const customersResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/customers`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        const customers = customersResponse.data.map((customer) => ({
          ...customer,
          role: 'Customer',
        }));

        // Fetch employees
        const employeesResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/employees`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        const employees = employeesResponse.data.map((employee) => ({
          ...employee,
          role: 'Employee',
        }));

        // Fetch shippers
        const shippersResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/shippers`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        const shippers = shippersResponse.data.map((shipper) => ({
          ...shipper,
          role: 'Shipper',
        }));

        // Combine all users
        const allUsers = [...customers, ...employees, ...shippers];
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddUser = () => {
    setOpenAddDialog(true);
  };

  const handleSaveUser = (newUser) => {
    // Depending on role, select the correct endpoint
    let endpoint = '';
    if (newUser.role === 'Customer') {
      endpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/register/customer`;
    } else if (newUser.role === 'Employee') {
      endpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/register/employee`;
    } else if (newUser.role === 'Shipper') {
      endpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/register/shipper`;
    }

    // Send POST request to add user
    axios.post(endpoint, newUser, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
      .then((response) => {
        // Update the users list
        setUsers([...users, { ...response.data, role: newUser.role }]);
      })
      .catch((error) => console.error('Error adding user:', error));
  };

  const handleEditUser = (user) => {
    // Handle editing user
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Depending on role, select the correct endpoint
      let endpoint = '';
      if (user.role === 'Customer') {
        endpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/customers/${user.id}`;
      } else if (user.role === 'Employee') {
        endpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/employees/${user.id}`;
      } else if (user.role === 'Shipper') {
        endpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/shippers/${user.id}`;
      }

      axios.delete(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
        .then(() => {
          // Remove the deleted user from the state
          setUsers(users.filter((u) => u.id !== user.id));
        })
        .catch((error) => console.error('Error deleting user:', error));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PersonAddIcon />}
        onClick={handleAddUser}
        sx={{ mb: 2 }}
      >
        Add New User
      </Button>
      <AddUserDialog
        open={openAddDialog}
        handleClose={() => setOpenAddDialog(false)}
        handleSave={handleSaveUser}
      />
      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Additional Info</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              let additionalInfo = '';
              if (user.role === 'Customer') {
                additionalInfo = `Fortune Chances: ${user.fortuneChance} | Total Money Spent: ${user.totalMoneySpent}`;
              } else if (user.role === 'Employee') {
                additionalInfo = `Salary: ${user.salary} | Store ID: ${user.storeID}`;
              } else if (user.role === 'Shipper') {
                additionalInfo = `Vehicle Capacity: ${user.vehicleCapacity}`;
              }

              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{`${user.fName} ${user.lName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{additionalInfo}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditUser(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageUsers;