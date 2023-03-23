// replace on deploy
const API_BASE_URL = 'http://localhost:3001/api';

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/products');
    const data = await response.json();
    return data.products; // Make sure you access the "products" property in the response object
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default fetchProducts;
