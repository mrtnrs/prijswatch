const API_URL = '/api/scrapers';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;
import { getIdToken } from './authService';

const createHeaders = async () => {
  const idToken = await getIdToken();

  if (!idToken) {
    throw new Error('User is not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  };
};

export const testScraper = async (webshopId, scraperSettings) => {
  try {
    const headers = await createHeaders();
    const response = await fetch(`${SERVER_URL}${API_URL}/test`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ webshopId, scraperSettings }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`testScraper error: ${error.message}`);
  }
};

export const saveScraper = async (webshopId, scraperSettings) => {
  try {
    const headers = await createHeaders();
    const response = await fetch(`${SERVER_URL}${API_URL}/save`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ webshopId, scraperSettings }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`saveScraper error: ${error.message}`);
  }
};

export const updateScraper = async (scraperId, webshopId, scraperSettings) => {
  try {
    const headers = await createHeaders();
    const response = await fetch(`${SERVER_URL}${API_URL}/update/${scraperId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ webshopId, scraperSettings }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`updateScraper error: ${error.message}`);
  }
};

export const getAllScrapers = async () => {
  try {
    const headers = await createHeaders();
    const response = await fetch(`${SERVER_URL}${API_URL}/`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching scrapers: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`getAllScrapers error: ${error.message}`);
  }
};

export const deleteScraper = async (scraperId) => {
  try {
    const headers = await createHeaders();
    const response = await fetch(`${SERVER_URL}${API_URL}/delete/${scraperId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete the scraper');
    }
  } catch (error) {
    throw new Error(`deleteScraper error: ${error.message}`);
  }
};

export const updateScraperActiveState = async (scraperId, active) => {
  try {
    const headers = await createHeaders();
    const response = await fetch(`${SERVER_URL}${API_URL}/update-active-state/${scraperId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      throw new Error('Failed to update scraper active state');
    }

    return response.json();
  } catch (error) {
    throw new Error(`updateScraperActiveState error: ${error.message}`);
  }
};

export const runOnce = async (scraperId) => {
  try {
    const headers = await createHeaders();
    const response = await fetch(`${SERVER_URL}${API_URL}/run-once/${scraperId}`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error running scraper: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error running scraper: ${error.message}`);
  }
};
