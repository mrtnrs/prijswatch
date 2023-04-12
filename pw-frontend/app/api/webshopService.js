const API_URL = 'http://localhost:3001/api/webshops';
import { getIdToken } from './authService';

export const createWebshop = async (webshopData) => {
  const idToken = await getIdToken();

  if (!idToken) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(webshopData),
    });

    if (!response.ok) {
      throw new Error(`Error creating webshop: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`createWebshop error: ${error.message}`);
  }
};

export const getAllWebshops = async () => {
  try {
    const response = await fetch(`${API_URL}`);

    if (!response.ok) {
      throw new Error(`Error fetching webshops: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`getAllWebshops error: ${error.message}`);
  }
};

export async function updateWebshop(webshopId, webshopData) {
  const idToken = await getIdToken();

  if (!idToken) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`${API_URL}/${webshopId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(webshopData),
    });

    if (!response.ok) {
      throw new Error(`Error updating webshop: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`updateWebshop error: ${error.message}`);
  }
}

export const deleteWebshop = async (id) => {
  const idToken = await getIdToken();

  if (!idToken) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting webshop: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`deleteWebshop error: ${error.message}`);
  }
};
