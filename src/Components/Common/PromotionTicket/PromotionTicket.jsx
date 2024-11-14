// src/components/PromotionTicket.jsx
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import './PromotionTicket.css';

const PromotionTicket = ({ promotion, onSelect, disabled, selected }) => {
  return (
    <Card
      className={`ticket-card ${selected ? 'selected' : ''}`}
      onClick={() => !disabled && onSelect(promotion)}
      style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      <CardContent className="ticket-content">
        <Typography variant="h6" gutterBottom>
          {promotion.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {promotion.description}
        </Typography>
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          Discount: {(promotion.discount * 100).toFixed(0)}%
        </Typography>
      </CardContent>
      <CardContent className="ticket-actions">
        <Button
          variant={selected ? 'contained' : 'outlined'}
          color="primary"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering card click
            onSelect(promotion);
          }}
          disabled={disabled}
          fullWidth
        >
          {selected ? 'Selected' : 'Apply Promotion'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromotionTicket;