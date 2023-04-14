const API_URL = '/api/webshops';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;
import { getIdToken } from './authService';

export const createWebshop = async (webshopData) => {
  const idToken = await getIdToken();

  if (!idToken) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`${SERVER_URL}${API_URL}`, {
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
    const response = await fetch(`${SERVER_URL}${API_URL}`);

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
    const response = await fetch(`${SERVER_URL}${API_URL}/${webshopId}`, {
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
    const response = await fetch(`${SERVER_URL}${API_URL}/${id}`, {
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
