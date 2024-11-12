// src/Components/Common/UserComponents/MyAccount.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../hooks/useAuth';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MyAccount = () => {
  const { user } = useAuth(); // Access user from useAuth
  const [rank, setRank] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchRank(user.id);
    }
  }, [user]);

  const fetchRank = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/customers/customer-rank/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setRank(response.data.rank);
    } catch (error) {
      console.error('Error fetching rank:', error);
    }
  };

  const getRankIcon = () => {
    switch (rank) {
      case 'iron':
        return <img src="/Images/user-ranks/bronze.png" alt="Iron Icon" style={{ width: 75 }} />;
      case 'bronze':
        return <img src="/Images/user-ranks/iron.png" alt="Bronze Icon" style={{ width: 75 }} />;
      case 'silver':
        return <img src="/Images/user-ranks/silver.png" alt="Silver Icon" style={{ width: 75 }} />;
      case 'gold':
        return <img src="/Images/user-ranks/gold.png" alt="Gold Icon" style={{ width: 75 }} />;
      case 'platinum':
        return <img src="/Images/user-ranks/plat.png" alt="Platinum Icon" style={{ width: 75 }} />;
      default:
        return null;
    }
  };

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            My Account
          </Typography>
          <Typography variant="h6">
            Hello {user.fName} {user.lName}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {user.address}
          </Typography>
          {rank ? (
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                <strong>Your current rank:</strong> {rank}
              </Typography>
              {getRankIcon()}
            </Box>
          ) : (
            <Typography variant="body1" mt={2}>
              No rank available
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyAccount;