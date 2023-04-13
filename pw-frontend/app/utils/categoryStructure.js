import Cookie from 'js-cookie';
import { fetchCategoryStructure } from '@/api/categoryService';
const LOCAL_STORAGE_KEY = 'categoryStructure';

async function fetchAndStoreCategoryStructure() {
  console.log('fetchAndStoreCategoryStructure');
  const response = await fetchCategoryStructure();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response));
  // Cookie.set('categoryStructure', JSON.stringify(response));
  console.log('response fetchAndStoreCategoryStructure: ', response);
  return response.tree;
}

export const categoryStructure = {
  tree: [],
  init: async function () {
    console.log('cat struct init');
    try {
      // const storedData = Cookie.get('categoryStructure');
      // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedData));
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (storedData) {
        console.log('cookie gevonden');
        const { version, tree } = JSON.parse(storedData);
        this.tree = tree;

        const latestData = await fetchCategoryStructure();
        if (latestData.version !== version) {
          this.tree = latestData.tree;
          // Cookie.set('categoryStructure', JSON.stringify(latestData));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(latestData));
          console.log('niet laatreste versie');
        }
      } else {
        console.log('dit zou moeten');
        this.tree = await fetchAndStoreCategoryStructure();
      }
    } catch (error) {
      console.error('Error initializing category structure:', error);
    }
  },
  updateTree: async function () {
    try {
      const response = await fetchCategoryStructure();
      this.tree = response.tree;
      // Cookie.set('categoryStructure', JSON.stringify(response));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response));
      return response.tree;
    } catch (error) {
      console.error('Error updating category tree:', error);
    }
  },
};
