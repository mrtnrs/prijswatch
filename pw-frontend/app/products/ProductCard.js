import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const ProductCard = ({ product }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${product.category}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
