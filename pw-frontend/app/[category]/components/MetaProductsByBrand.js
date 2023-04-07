// components/MetaProductsByBrand.js
import { useMemo } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';

const MetaProductsByBrand = ({ metaProducts }) => {
  console.log('metaProducts: ', metaProducts);
const sortedMetaProducts = useMemo(() => {
  const sorted = {};
  metaProducts.forEach((metaProduct) => {
    const brand = metaProduct.brand;
    if (!sorted[brand]) {
      sorted[brand] = [];
    }
    metaProduct.metaProductIds.forEach((_, index) => {
      sorted[brand].push({
        id: metaProduct.metaProductIds[index],
        name: metaProduct.names[index],
        imageUrl: metaProduct.imageUrls[index],
        slug: metaProduct.slugs[index],
      });
    });
  });

  return sorted;
}, [metaProducts]);


  return (
    <div>
      <Typography variant="h2">{"Category"}</Typography>
      {Object.entries(sortedMetaProducts).map(([brand, products]) => (
        <Box key={brand}>
          <Typography variant="h4">{brand}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {products.length} smartphones found for {brand}
          </Typography>
          {/* Brand logo */}
          <img src={`path/to/brand/logos/${brand}.png`} sx={{
            width: '150px',
    height: '150px',
    objectFit: 'contain',
    bgcolor: 'white',
    padding: '10px',
          }} alt={`${brand} logo`} />
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    image={product.imageUrl || "https://via.placeholder.com/250x250"}
                    alt={product.name}
                    sx={{ borderRadius: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {product.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </div>
  );
};

export default MetaProductsByBrand;
