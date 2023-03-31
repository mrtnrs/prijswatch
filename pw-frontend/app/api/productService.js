const API_URL = 'http://localhost:3001/api/products';

async function fetchMetaProduct(category, slug) {
  const response = await fetch(`${API_URL}/${category}/${slug}/meta-product`);
  const metaProduct = await response.json();
  return metaProduct;
}

export default {
  fetchMetaProduct,
};

