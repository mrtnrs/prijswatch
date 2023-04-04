'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

async function getAllMetaProducts(category) {
  try {
      const res = await fetch(`http://localhost:3001/api/products/${category}/meta-product`);
      return res.json();
  } catch (error) {
        console.error(`Error in fetch request for ${caller}: ${error.message}`);
    throw error;
  }
}

function MetaProducts() {
  const [metaProducts, setMetaProducts] = useState([]);
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      const data = await getAllMetaProducts(params.category);
      setMetaProducts(data);
    }

    fetchData();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {metaProducts.map((metaProduct) => (
        <div key={metaProduct.slug} style={{ border: '1px solid #ccc', padding: '16px' }}>
          <h3>{metaProduct.name}</h3>
          <Link href={`/${params.category}/${metaProduct.slug}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

function MetaProductsFallback() {
  return <div>Loading...</div>;
}

export default function CategoryPage() {


  return (
    <div>
      <Suspense fallback={<MetaProductsFallback />}>
        <MetaProducts />
      </Suspense>
    </div>
  );
}
