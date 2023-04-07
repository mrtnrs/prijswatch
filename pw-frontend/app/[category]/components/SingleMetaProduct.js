import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';

export default function SingleMetaProduct({ categorySlug, metaProductSlug }) {
  const [metaProduct, setMetaProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(categorySlug);

  useEffect(() => {
async function fetchMetaProduct() {
  console.log('fetchProduct');
  console.log(categorySlug);
  console.log(metaProductSlug);
  try {
    const res = await fetch(`http://localhost:3001/api/products/${categorySlug}/${metaProductSlug}/meta-product`);
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      setMetaProduct(data);
      setLoading(false);
    } else {
      setMetaProduct(null);
    }
  } catch (error) {
    console.error(`Error in fetch request: ${error.message}`);
  }
}

    fetchMetaProduct();
  }, [categorySlug, metaProductSlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metaProduct) {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>The meta product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{metaProduct.name}</h1>
      <p>{metaProduct.brand}</p>
      <ProductGrid />
    </div>
  );
}
