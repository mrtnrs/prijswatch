const API_URL = '/api/products';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;
import { getIdToken } from './authService';

const createHeaders = async () => {
  const idToken = await getIdToken();

  if (!idToken) {
    throw new Error('User is not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  };
};

async function fetchMetaProduct(category, slug) {
  try {
  const response = await fetch(`${SERVER_URL}${API_URL}/${category}/${slug}/meta-product`);
  const metaProduct = await response.json();
  return metaProduct;
  } catch (error) {
    console.log(response);
          throw new Error('Failed to fetch search results');
        }
}

async function fetchProducts(metaProductId) {
  try {
    // Update the fetch URL to use the new route
    const response = await fetch(`${SERVER_URL}${API_URL}/by-meta-product-id/${metaProductId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

async function fetchMetaProductsByCategoryAndBrand(categoryId) {
  try {
    console.log('categorySlug', categoryId);
    const response = await fetch(`${SERVER_URL}${API_URL}/${categoryId}/grouped-by-brand`);
    const data = await response.json();
    console.log('grouped by brand', data);
    return data;
  } catch (error) {
    console.error('Error fetching MetaProducts by category and brand:', error);
    throw new Error('Failed to fetch MetaProducts by category and brand');
  }
}

async function fetchProductsToReview() {
  console.log("fetchProductsToReview");
  try {
    const headers = await createHeaders();
    console.log(headers);
    const response = await fetch(`${SERVER_URL}${API_URL}/needs-review`, {
      headers,
    });

    if (!response.ok) {
      console.log("Error in response:", response.status, response.statusText);
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("datas: ", data);
    return data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching products to review:", error);
  }
}



export default {
  fetchMetaProduct,
  fetchProducts,
  fetchMetaProductsByCategoryAndBrand,
  fetchProductsToReview,
};

