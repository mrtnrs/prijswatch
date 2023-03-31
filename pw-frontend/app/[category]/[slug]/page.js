'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';

async function getMetaProductBySlug(category, slug) {
  console.log('FETCHED');
  const res = await fetch(`http://localhost:3001/api/products/${category}/${slug}/meta-product`);
  console.log(res);
  return res.json();
}


function MetaProduct() {
  const [metaProduct, setMetaProduct] = useState(null);
  
  const params = useParams();
  
  useEffect(() => {
    async function fetchData() {
      const data = await getMetaProductBySlug(params.category, params.slug);
      console.log('data ja :');
      console.log(data);
      setMetaProduct(data);
    }

    fetchData();
  }, []);

  if (!metaProduct) {
    return null;
  }

  return (
   <div>
      {Object.entries(metaProduct).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(value)}
        </div>
      ))}
    </div>
  );
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
