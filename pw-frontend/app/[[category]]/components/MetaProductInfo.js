import React from 'react';
import { Box, Typography } from '@mui/material';

const MetaProductInfo = ({ metaProduct }) => {

  const placeholderImage = 'https://via.placeholder.com/150'; // Replace with your preferred placeholder image URL

  return (
    <Box>
      <img src={metaProduct.imageUrl || placeholderImage} alt={metaProduct.name} />
      <Typography variant="h6">{metaProduct.brand}</Typography>
      <Typography variant="h4">{metaProduct.name}</Typography>
      <Typography>{metaProduct.description}</Typography>
    </Box>
  );
};

export default MetaProductInfo;