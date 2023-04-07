'use client';
import { useEffect, useState, Suspense, useContext } from 'react';
import SettingsContext from '@/core/context/SettingsContext';
import { useCategoryStructure } from '@/core/hooks/useSettings';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import CategoryOrMetaProducts from './components/CategoryOrMetaProducts'



export default function CategoryPage() {

  return <CategoryOrMetaProducts />;

}



// 'use client';
// import { useEffect, useState, Suspense, useContext } from 'react';
// import { useCategoryStructure } from '@/core/hooks/useSettings';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';

// async function getAllMetaProducts(category) {
//   try {
//     const res = await fetch(`http://localhost:3001/api/products/${category}/meta-product`);
//     return res.json();
//   } catch (error) {
//     console.error(`Error in fetch request: ${error.message}`);
//     throw error;
//   }
// }

// function findCategoryBySlug(slug, categories) {
//   for (const category of categories) {
//     if (category.slug === slug) {
//       return category;
//     }
//     if (category.children) {
//       const foundCategory = findCategoryBySlug(slug, category.children);
//       if (foundCategory) {
//         return foundCategory;
//       }
//     }
//   }
//   return null;
// }

// function MetaProducts({ categorySlug }) {
//   const [metaProducts, setMetaProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       const data = await getAllMetaProducts(categorySlug);
//       setMetaProducts(data);
//       setLoading(false);
//     }

//     fetchData();
//   }, [categorySlug]);

//     if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (metaProducts.length === 0) {
//     return (
//       <div>
//         <h1>404 Not Found</h1>
//         <p>The category or meta product you are looking for does not exist.</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
//       {metaProducts.map((metaProduct) => (
//         <div key={metaProduct.slug} style={{ border: '1px solid #ccc', padding: '16px' }}>
//           <h3>{metaProduct.name}</h3>
//           <Link href={`/${categorySlug}/${metaProduct.slug}`}>
//             View Details
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }

// function MetaProductsFallback() {
//   return <div>Loading...</div>;
// }

// export default function CategoryPage() {
//   const params = useParams();
//   const categoryStructure = useCategoryStructure();

//     if (!categoryStructure) {
//     return <div>Loading...</div>;
//   }

//   const category = findCategoryBySlug(params.category, categoryStructure);

//   if (category) {
//     // Render the category landing page
//     return (
//       <div>
//         <h1>custom category landing page</h1>
//       </div>
//     );
//   } else {
//     // Try to fetch the MetaProduct with the given slug
//     // If successful, render the MetaProduct page
//     // If not, render a 404 page
//     return (
//       <div>
//         <Suspense fallback={<MetaProductsFallback />}>
//           <MetaProducts categorySlug={params.category} />
//         </Suspense>
//       </div>
//     );
//   }
// }
