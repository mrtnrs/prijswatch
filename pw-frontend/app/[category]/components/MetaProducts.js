import { useState, useEffect } from 'react';
import Link from 'next/link';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

async function getAllMetaProducts(category) {
  try {
    const res = await fetch(`${SERVER_URL}/api/products/${category}/meta-product`);
    return res.json();
  } catch (error) {
    console.error(`Error in fetch request: ${error.message}`);
    throw error;
  }
}


function MetaProducts({ categorySlug }) {
  const [metaProducts, setMetaProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllMetaProducts(categorySlug);
      setMetaProducts(data);
      setLoading(false);
    }

    fetchData();
  }, [categorySlug]);

    if (loading) {
    return <div>Loading...</div>;
  }

  if (metaProducts.length === 0) {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>The category or meta product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {metaProducts.map((metaProduct) => (
        <div key={metaProduct.slug} style={{ border: '1px solid #ccc', padding: '16px' }}>
          <h3>{metaProduct.name}</h3>
          <Link href={`/${categorySlug}/${metaProduct.slug}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

export function MetaProductsFallback() {
  return <div>Loading...</div>;
}


export default MetaProducts;