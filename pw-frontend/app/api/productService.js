const API_URL = 'http://localhost:3001/api/products';

async function fetchMetaProduct(category, slug) {
  try {
  const response = await fetch(`${API_URL}/${category}/${slug}/meta-product`);
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
    const response = await fetch(`${API_URL}/by-meta-product-id/${metaProductId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export default {
  fetchMetaProduct,
  fetchProducts
};

