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
  const lastParam = joinedParams.split('/').pop();
  const depth = tempPathname.split('/').filter(segment => segment.length > 0).length;
  const foundCategory = depth <= 3 ? findCategoryBySlug(lastParam, categoryStructure) : null;
  const [metaProducts, setMetaProducts] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductNotFound, setIsProductNotFound] = useState(false);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (foundCategory) {
        try {
          const data = await productService.fetchMetaProductsByCategoryAndBrand(foundCategory.id);
          setMetaProducts(data);
        } catch (error) {
          console.error('Error fetching MetaProducts:', error);
        } finally {
          setIsLoading(false);
        }
      }

      if (categoryStructure && categoryStructure.length > 0) {
    const categorySlugs = joinedParams.split('/');
    const newCategoryTree = [];

categorySlugs.forEach((slug, index) => {
  const currentCategory = findCategoryBySlug(slug, categoryStructure);
  if (currentCategory) {
    newCategoryTree.push({
      name: currentCategory.name,
      url: `${constructCategoryUrl(newCategoryTree)}/${currentCategory.slug}`,
    });
  }
});

        setCategoryTree(newCategoryTree);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [foundCategory, joinedParams, categoryStructure]);


function constructCategoryUrl(categoryTree) {
  let url = '';
  for (let i = 0; i < categoryTree.length; i++) {
    url += `/${categoryTree[i].url.split('/').pop()}`;
  }
  return url;
}



  if (!categoryStructure || isLoading) {
    return <div>Loading...</div>;
  }

  if (foundCategory) {
        if (foundCategory.children && foundCategory.children.length > 0) {
      return (
        <div>
          <BasicBreadcrumbs categoryTree={categoryTree} />
          <Typography variant="h1">{lastParam}</Typography>
          <ChildCategories categories={foundCategory.children} catName={lastParam} />
        </div>
      );
    } else {
      return (
        <>
        <div>
          <BasicBreadcrumbs categoryTree={categoryTree}/>
          <Typography variant="h1" sx={{textTransform: 'capitalize', mt: 5}}>{lastParam}</Typography>
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
        </>
      );
    }
  } else if (depth >= 2 && depth <= 4) {
    const pathSegments = tempPathname.split('/').filter(segment => segment.length > 0);
    const categorySlug = pathSegments[pathSegments.length - 2];
    const metaProductSlug = pathSegments[pathSegments.length - 1];
    return (
      <>
        <BasicBreadcrumbs categoryTree={categoryTree} productName={productName} />
        <SingleMetaProduct
          categorySlug={categorySlug}
          metaProductSlug={metaProductSlug}
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
        <Viernulvier />
      </>
    );
  }
}

