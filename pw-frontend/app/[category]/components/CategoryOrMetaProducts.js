'use client'
import { useParams } from 'next/navigation';
import MetaProducts, { MetaProductsFallback } from './MetaProducts';
import SingleMetaProduct from './SingleMetaProduct';
import findCategoryBySlug from './utils';
import { Suspense, useState, useEffect } from 'react';

import { categoryStructure as importedCategoryStructure } from '@/utils/categoryStructure';

import ChildCategories from './ChildCategories';
import MetaProductsByBrand from './MetaProductsByBrand';

import productService from '@/api/productService';
import BasicBreadcrumbs from '@/components/breadcrumbs/BasicBreadcrumbs'
import Typography from '@mui/material/Typography'

export default function CategoryOrMetaProducts() {
  const params = useParams();
  const categoryStructure = importedCategoryStructure.tree;
  const [metaProducts, setMetaProducts] = useState([]);
  const joinedParams = [params.category, params.subcategory, params.subsubcategory].filter(Boolean).join('/');
  const lastParam = joinedParams.split('/').pop();
  const category = findCategoryBySlug(joinedParams, categoryStructure);


  console.log('params', params);
  console.log('catStruc', categoryStructure);

  if (!categoryStructure) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (category) {
      async function fetchMetaProductsData() {
        try {
          const data = await productService.fetchMetaProductsByCategoryAndBrand(category.slug);
          setMetaProducts(data);
        } catch (error) {
          console.error('Error fetching MetaProducts:', error);
        }
      }

      fetchMetaProductsData();
    }
  }, [category]);



  console.log(joinedParams);
  console.log(lastParam);

  console.log('categoryStructure', categoryStructure);


  console.log(category);


  if (category) {
    // Render the category landing page
    console.log('metaProducts', category.metaProducts);
    return (
     <div>
     <BasicBreadcrumbs />
      <Typography variant="h1">{lastParam}</Typography>
      <MetaProductsByBrand metaProducts={metaProducts} />
    </div>
    );
  } else {
    // Render the single meta product page if the last parameter is a MetaProduct
    const paramsArray = joinedParams.split('/');
    paramsArray.pop();
    const newCategorySlug = paramsArray.join('/');
    return (
        <Suspense fallback={<MetaProductsFallback />}>
          <BasicBreadcrumbs />
          <SingleMetaProduct
            categorySlug={newCategorySlug}
            metaProductSlug={lastParam}
          />
        </Suspense>
    );
  }
}
