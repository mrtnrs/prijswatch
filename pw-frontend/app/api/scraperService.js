const API_URL = 'http://localhost:3001/api/scrapers';


export const testScraper = async (webshopId, scraperSettings) => {
  console.log(scraperSettings);
  const response = await fetch(`${API_URL}/test`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({webshopId, scraperSettings }),
  });

  if(!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }
  return await response.json();
};

export const saveScraper = async (webshopId, scraperSettings) => {
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
};

// update scraper

export const updateScraper = async (scraperId, webshopId, scraperSettings) => {
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
};

// fetch all scrapers

export const getAllScrapers = async () => {
  console.log('GET ALL SCRAPERS');
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error(`Error fetching scrapers: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// delete scraper

export const deleteScraper = async (scraperId) => {
  const response = await fetch(`${API_URL}/delete/${scraperId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete the scraper');
  }
};

// set scraper to run

export const updateScraperActiveState = async (scraperId, active) => {
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
