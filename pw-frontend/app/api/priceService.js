const API_URL = '/api/price';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

const fetchPriceData = async (metaProductId) => {
  const response = await fetch(`${SERVER_URL}${API_URL}/${metaProductId}`);

  if (!response.ok) {
    throw new Error('Error fetching price data');
  }

  const data = await response.json();
  return data;
};

export default { fetchPriceData };
