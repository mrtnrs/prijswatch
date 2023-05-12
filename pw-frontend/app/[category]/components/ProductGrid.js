import { Box, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import ProductCard from './ProductCard';
const IMG_SERVER = process.env.NEXT_PUBLIC_IMG_SERVER;


export default function ProductGrid({ products }) {


return (
    <Box>
      <Grid container spacing={2}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <Grid item xs={12} md={4} lg={3} key={product.id}>
              <Product product={product} displayMode="grid" />
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No products found.</Typography>
        )}
      </Grid>
    </Box>
);

}
