import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getMetaProduct } from '../api/metaProducts';
import ProductGrid from './ProductGrid';

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
      <img src={metaProduct.imageUrl} alt={metaProduct.name} />
      <p>{metaProduct.description}</p>
      <ProductGrid products={metaProduct.products} />
    </div>
  );
}
