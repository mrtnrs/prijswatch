import axios from "axios";

const API_URL = "/api/webshop";

export const createScraper = async (webshopId, scraperSettings) => {
  const response = await axios.post(`${API_URL}/scraper`, { webshopId, scraperSettings });
  return response.data;
};

export const updateScraper = async (scraperId, scraperSettings) => {
  const response = await axios.put(`${API_URL}/scraper`, { scraperId, scraperSettings });
  return response.data;
};

export const deleteScraper = async (scraperId) => {
  const response = await axios.delete(`${API_URL}/scraper/${scraperId}`);
  return response.data;
};
