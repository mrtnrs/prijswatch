import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';

import findCategoryBySlug from './utils';
import { categoryStructure as importedCategoryStructure } from '@/utils/categoryStructure';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ApexLineChart from '@/components/chartjs/ApexLineChart';

import updateCategoryTree from '@/core/utils/updateCategoryTree';
import productService from '@/api/productService';
import priceService from '@/api/priceService';



export default function SingleMetaProduct({ categorySlug, metaProductSlug, onProductNotFound, onProductNameUpdate }) {
  const [metaProduct, setMetaProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryStructure = importedCategoryStructure.tree;

  useEffect(() => {
    async function fetchMetaProduct() {
      try {
        const res = await fetch(`http://localhost:3001/api/products/${categorySlug}/${metaProductSlug}/meta-product`);
        if (res.ok) {
          const data = await res.json();
          if(data?.length === 0){
            onProductNotFound();
            setMetaProduct(null);
            setLoading(false);
          } else {
            setMetaProduct(data);
            onProductNameUpdate(data.name);
            setLoading(false);
          }
        } else {
          setMetaProduct(null);
        }
      } catch (error) {
        console.error(`Error in fetch request: ${error.message}`);
      }
    }

    fetchMetaProduct();
  }, [categorySlug, metaProductSlug, onProductNotFound]);

  useEffect(() => {
    if (metaProduct && metaProduct.id) {
      async function fetchProductsData() {
        try {
          const data = await productService.fetchProducts(metaProduct.id);
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }

      fetchProductsData();
    }
  }, [metaProduct]);

  useEffect(() => {
  if (metaProduct && metaProduct.id) {
    async function fetchPriceData() {
      try {
        const data = await priceService.fetchPriceData(metaProduct.id);
        console.log('data', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    }

    fetchPriceData();
  }
}, [metaProduct]);

    const createSeriesArray = (products) => {
    return products.map((product) => {
      return {
        name: product.name,
        data: product.prices.map((price) => {
          return {
            x: new Date(price.createdAt),
            y: price.value,
          };
        }),
      };
    });
  };

    const series = createSeriesArray(products);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metaProduct) {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>The product or category you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <Container>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Box>
            <h1>{metaProduct.name}</h1>
            <p>{metaProduct.brand}</p>
            {metaProduct.imageUrl && (
              <img src={metaProduct.imageUrl} alt={metaProduct.name} />
            )}
            <p>{metaProduct.description}</p>
            <Button variant="outlined">Add to Favorites</Button>
            <Button variant="outlined">Add Alert</Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <ApexLineChart series={series}/>
        </Grid>
      </Grid>
    </Box>
    <ProductGrid products={products} />
  </Container>
  );
}
