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

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend API
    // Replace with your actual API endpoint
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddUser = () => {
    setOpenAddDialog(true);
  };

  const handleSaveUser = (newUser) => {
    // Send POST request to add user
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the users list
        setUsers([...users, data]);
      })
      .catch((error) => console.error('Error adding user:', error));
  };

  const handleEditUser = (userId) => {
    // Handle editing user
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })
        .then(() => {
          // Remove the deleted user from the state
          setUsers(users.filter((user) => user.id !== userId));
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
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditUser(user.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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