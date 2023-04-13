const API_URL = 'http://localhost:3001/api/price';

const fetchPriceData = async (metaProductId) => {
  const response = await fetch(`${API_URL}/${metaProductId}`);

  if (!response.ok) {
    throw new Error('Error fetching price data');
  }

  const data = await response.json();
  return data;
};

export default { fetchPriceData };
