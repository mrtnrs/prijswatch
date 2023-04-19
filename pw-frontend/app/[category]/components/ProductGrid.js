import { Box, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import ProductCard from './ProductCard';
const IMG_SERVER = process.env.NEXT_PUBLIC_IMG_SERVER;


export default function ProductGrid({ products }) {


return (
  <Box>
    <Grid container spacing={2}>
      {products && products.length > 0 ? (
        products.map((product) => {
          const latestPriceObj = product.prices.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt)
              ? current
              : latest;
          }, product.prices[0]);
          return (
            <Grid item xs={12} md={4} lg={3} key={product.id}>
              <ProductCard
                name={product.name}
                brand={product.brand}
                image={`${IMG_SERVER}${product.imageUrl}`}
                metadata={product.metadata}
                lastCheck={product.updatedAt}
                url={product.url}
                webshopId={product.webshopId}
                price={latestPriceObj.value}
              />
            </Grid>
          );
        })
      ) : (
        <Typography variant="h6">No products found.</Typography>
      )}
    </Grid>
  </Box>
);

}
