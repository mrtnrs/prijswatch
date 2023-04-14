const API_URL = '/api/products';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

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

async function fetchMetaProductsByCategoryAndBrand(categorySlug) {
  try {
    const response = await fetch(`${SERVER_URL}${API_URL}/${categorySlug}/grouped-by-brand`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching MetaProducts by category and brand:', error);
    throw new Error('Failed to fetch MetaProducts by category and brand');
  }
}

export default {
  fetchMetaProduct,
  fetchProducts,
  fetchMetaProductsByCategoryAndBrand,
};

