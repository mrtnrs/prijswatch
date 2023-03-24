const API_URL = '/api/webshop';

export const createWebshop = async (webshopData) => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webshopData),
  });

  if (!response.ok) {
    throw new Error(`Error creating webshop: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};