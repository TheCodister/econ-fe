// src/admin/AddUserDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const AddUserDialog = ({ open, handleClose, handleSave }) => {
  const [user, setUser] = useState({
    userName: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    // Validate user data
    handleSave(user);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Username"
          name="userName"
          value={user.userName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControl fullWidth margin="dense" required>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={user.role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Shipper">Shipper</MenuItem>
            <MenuItem value="StoreManager">Store Manager</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;