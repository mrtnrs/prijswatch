import axios from "axios";

const API_URL = 'http://localhost:3001/api/scrapers';


export const updateScraper = async (scraperId, scraperSettings) => {
  const response = await axios.put(`${API_URL}/scraper`, { scraperId, scraperSettings });
  return response.data;
};

export const deleteScraper = async (scraperId) => {
  const response = await axios.delete(`${API_URL}/scraper/${scraperId}`);
  return response.data;
};

export const testScraper = async (webshopId, scraperSettings) => {
  const response = await axios.post(`${API_URL}/test`, { webshopId, scraperSettings });
  return response.data;
};

export const saveScraper = async (webshopId, scraperSettings) => {
  const response = await axios.post(`${API_URL}/save`, { webshopId, scraperSettings });
  return response.data;
};

