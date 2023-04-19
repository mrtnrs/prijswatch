import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getMetaProduct } from '../api/metaProducts';
import ProductGrid from './ProductGrid';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ApexLineChart from './ApexLineChart';

const IMG_SERVER = process.env.NEXT_PUBLIC_IMG_SERVER;


export default function MetaProductPage() {
  const router = useRouter();
  const { category, name } = router.query;
  const [metaProduct, setMetaProduct] = useState(null);

  useEffect(() => {
    async function fetchMetaProduct() {
      try {
        const metaProduct = await getMetaProduct(category, name);
        setMetaProduct(metaProduct);
      } catch (error) {
        console.error(error);
      }
    }

    if (category && name) {
      fetchMetaProduct();
    }
  }, [category, name]);

  if (!metaProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{metaProduct.name}</h1>
      <img src={`${IMG_SERVER}${product.imageUrl}`} alt={metaProduct.name} />
      <p>{metaProduct.description}</p>
      <ProductGrid products={metaProduct.products} />
    </div>
  );
}
