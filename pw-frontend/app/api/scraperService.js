const API_URL = 'http://localhost:3001/api/scrapers';

export const testScraper = async (webshopId, scraperSettings) => {
  try {
    const response = await fetch(`${API_URL}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_URL}/update/${scraperId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_URL}/`);

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
    const response = await fetch(`${API_URL}/delete/${scraperId}`, {
      method: 'DELETE',
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
    const response = await fetch(`${API_URL}/update-active-state/${scraperId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_URL}/run-once/${scraperId}`, {
      method: 'POST',
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
