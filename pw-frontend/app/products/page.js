'use client'
import fetchProducts from '../../lib/api'
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard'; // Import the ProductCard component


export default function ProductsPage() {
  const [products, setProducts] = useState([]);

useEffect(() => {
  // Fetch products data here and update the state
  const fetchData = async () => {
    const fetchedProducts = await fetchProducts();
    setProducts(fetchedProducts);
  };
  fetchData();
}, []);

  return (
    <div>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}