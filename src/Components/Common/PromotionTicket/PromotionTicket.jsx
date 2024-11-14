// src/components/PromotionTicket.jsx
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const PromotionTicket = ({ promotion, onSelect, disabled }) => {
  return (
    <Card variant="outlined" sx={{ borderColor: disabled ? 'grey.500' : 'primary.main' }}>
      <CardContent>
        <Typography variant="h6">{promotion.name}</Typography>
        <Typography variant="body2">{promotion.description}</Typography>
        <Typography variant="body2">
          Discount: {promotion.discount * 100}%
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSelect(promotion)}
          disabled={disabled}
          sx={{ mt: 1 }}
        >
          {disabled ? 'Unavailable' : 'Apply Promotion'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromotionTicket;