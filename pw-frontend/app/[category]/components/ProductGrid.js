import { Box, Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default function ProductGrid({ products }) {


  return (
     <Box>

      <Grid container spacing={2}>
      {products && products.length > 0 ? (
        products.map((product) => (
          <Grid item xs={12} md={6} key={product.id}>
            <Box>
              <Typography variant="h6">{product.name}</Typography>
              <Typography>Meta info: {product.brand}</Typography>
              <Typography>Webshop: {product.webshop?.name || 'NVT'}</Typography>
              <Typography>Current price: {product.latestPrice || 'Not available'}</Typography>
              <Typography>
                Recent price change: {product.recentPriceChange}
              </Typography>
              <Link href={product.url} target="_blank" rel="noopener noreferrer">
                Visit Webshop
              </Link>
            </Box>
          </Grid>
          ))
  ) : (
   <Typography variant="h6">No products found.</Typography>
        )}
      </Grid>
    </Box>
  );
}
