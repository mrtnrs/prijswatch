const API_URL = 'http://localhost:3001/api/webshops';

export const createWebshop = async (webshopData) => {
  console.log('creeeer');
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

export const getAllWebshops = async () => {
  const response = await fetch(`${API_URL}`);

  if (!response.ok) {
    throw new Error(`Error fetching webshops: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export async function updateWebshop(webshopId, webshopData) {
  try {
    const response = await fetch(`${API_URL}/${webshopId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webshopData),
    });

    if (!response.ok) {
      throw new Error(`Error updating webshop: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating webshop:', error);
    throw error;
  }
}

export const deleteWebshop = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting webshop: ${response.statusText}`);
  }
};

