import { useParams } from 'next/navigation';
import { categoryStructure as importedCategoryStructure } from '@/utils/categoryStructure';
import { useState, useEffect } from 'react';
import productService from '@/api/productService';
import BasicBreadcrumbs from '@/components/breadcrumbs/BasicBreadcrumbs';
import Typography from '@mui/material/Typography';
import findCategoryBySlug from './utils';
import updateCategoryTree from '@/core/utils/updateCategoryTree';
import MetaProductsByBrand from './MetaProductsByBrand';
import ChildCategories from './ChildCategories';
import SingleMetaProduct from './SingleMetaProduct';
import { usePathname } from 'next/navigation';

import Viernulvier from './viernulvier';

export default function CategoryOrMetaProducts() {
  const tempPathname = usePathname();
  const { category, subcategory, subsubcategory } = useParams();
  const categoryStructure = importedCategoryStructure.tree;
  const joinedParams = [category, subcategory, subsubcategory].filter(Boolean).join('/');
  const categorySlug = joinedParams.split('/').slice(0, -1).join('/');
  const lastParam = joinedParams.split('/').pop();
  const foundCategory = findCategoryBySlug(lastParam, categoryStructure);
  const [metaProducts, setMetaProducts] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductNotFound, setIsProductNotFound] = useState(false);
  const [productName, setProductName] = useState('');


useEffect(() => {
  async function fetchData() {
    if (foundCategory) {
      try {
        const data = await productService.fetchMetaProductsByCategoryAndBrand(foundCategory.slug);
        setMetaProducts(data);
      } catch (error) {
        console.error('Error fetching MetaProducts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (categoryStructure && categoryStructure.length > 0) {
      const category = findCategoryBySlug(categorySlug, categoryStructure);
      const newCategoryTree = [];

      let currentCategory = category;
      while (currentCategory) {
        newCategoryTree.unshift({
          name: currentCategory.name,
          url: currentCategory.slug,
        });
        currentCategory = currentCategory.parent;
      }

      if (newCategoryTree.length === 0) {
        const pathSegments = tempPathname.split('/').slice(0, -1);

        let currentUrl = '';
        for (const segment of pathSegments) {
          currentUrl += `${segment}/`;
          const currentCategory = findCategoryBySlug(segment, categoryStructure);
          if (currentCategory) {
            newCategoryTree.push({
              name: currentCategory.name,
              url: `.${currentUrl}`,
            });
          }
        }
      }

      setCategoryTree(newCategoryTree);
      console.log('newCatTree', newCategoryTree);
    }

    setIsLoading(false);
  }

  fetchData();
}, [foundCategory, categorySlug, tempPathname, categoryStructure]);


  if (!categoryStructure || isLoading) {
    return <div>Loading...</div>;
  }

  if (foundCategory) {
    if (foundCategory.children && foundCategory.children.length > 0) {
      return (
        <div>
          <BasicBreadcrumbs categoryTree={categoryTree} />
          <Typography variant="h1">{lastParam}</Typography>
          <ChildCategories categories={foundCategory.children} />
        </div>
      );
    } else {
      return (
        <div>
          <BasicBreadcrumbs categoryTree={categoryTree} />
          <Typography variant="h1">{lastParam}</Typography>
          {metaProducts.length === 0 ? (
            <Typography variant="h6">This category doesn't have any products... yet</Typography>
          ) : (
            <MetaProductsByBrand
              metaProducts={metaProducts}
              category={foundCategory}
              categoryStructure={categoryStructure}
            />
          )}
        </div>
      );
    }
  } else {
    const categorySlug = tempPathname.split('/')[tempPathname.split('/').length - 2];
    return (
      <>
      <BasicBreadcrumbs categoryTree={categoryTree} productName={productName} />
      <SingleMetaProduct
        categorySlug={categorySlug}
        metaProductSlug={lastParam}
        onProductNotFound={() => setIsProductNotFound(true)}
        onProductNameUpdate={(name) => setProductName(name)}
      />
      </>
    );
  }

  if (isProductNotFound) {
    return (
      <>
      <BasicBreadcrumbs categoryTree={categoryTree} />
      <Viernulvier />;
      </>
      ) 
  }
}
