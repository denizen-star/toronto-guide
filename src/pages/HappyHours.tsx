import React from 'react';
import { Container, Typography } from '@mui/material';

const HappyHours = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Happy Hours
      </Typography>
      <Typography variant="body1">
        Coming soon...
      </Typography>
    </Container>
  );
};

export default HappyHours; 