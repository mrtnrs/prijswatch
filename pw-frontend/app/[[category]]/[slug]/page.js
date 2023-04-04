'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';

import productService from '@/api/productService'

// MUI 

import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import MetaProductInfo from '../components/MetaProductInfo';
import PriceChart from '../components/PriceChart'
import ProductGrid from '../components/ProductGrid'

import RechartsAreaChart from '../components/RechartsAreaChart'

async function getMetaProductBySlug(category, slug) {
  try {
      console.log('FETCHED');
  const res = await fetch(`http://localhost:3001/api/products/${category}/${slug}/meta-product`);
  console.log(res);
  return res.json();
  } catch (error) {
    console.error(`Error in fetch request for ${caller}: ${error.message}`);
    throw error;
  }
}


function MetaProduct() {
  const [metaProduct, setMetaProduct] = useState(null);
  const [products, setProducts] = useState([]);
  
  const params = useParams();


  
  useEffect(() => {
    async function fetchData() {
      const data = await getMetaProductBySlug(params.category, params.slug);
      console.log('data ja :');
      console.log(data);
      setMetaProduct(data);
      fetchProducts(data.id);
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log('metaProduct updated:', metaProduct);
    if (metaProduct) {
      fetchProducts();
    }
  }, [metaProduct]);

async function fetchProducts() {
  console.log("hello");
  if (!metaProduct || !metaProduct.id) {
    console.log('MetaProduct or metaProduct.id is not defined');
    return;
  }
  try {
    const data = await productService.fetchProducts(metaProduct.id);
    console.log('data:');
    console.log(data);
    setProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}





  if (!metaProduct) {
    return null;
  }

    return (
    <Container>
      <Grid container spacing={4}>
        {/* MetaProductInfo component */}
        <Grid item xs={12} md={3}>
          <MetaProductInfo metaProduct={metaProduct} />
        </Grid>

        {/* MetaProductChart component */}
        <Grid item xs={12} md={9}>
          <PriceChart metaProduct={metaProduct} />
        </Grid>

        {/* MetaProductGrid component */}
        <Grid item xs={12}>
          <ProductGrid products={products} />
        </Grid>
      </Grid>
    </Container>
  );

  // return (
  //  <div>
  //  <MetaProductInfo 
  //   metaProduct={metaProduct}
  //   />
  //   <PriceChart />
  //     {Object.entries(metaProduct).map(([key, value]) => (
  //       <div key={key}>
  //         <strong>{key}:</strong> {JSON.stringify(value)}
  //       </div>
  //     ))}
  //   </div>
  // );
}


function MetaProductFallback() {
  return <div>Loading...</div>;
}

export default function ProductPage() {
 // const params = useParams();

  return (
    <div>
      <Suspense fallback={<MetaProductFallback />}>
        <MetaProduct />
      </Suspense>
    </div>
  );
}
