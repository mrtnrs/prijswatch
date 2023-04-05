import { fetchCategories } from '@/api/categoryService'
import categoryData from './categoryStructure.json'

export const categoryStructure = {
  tree: categoryData,
  updateTree: async function () {
    try {
      const response = await fetchCategories();
      console.log('response', response);
      this.tree = response;
    } catch (error) {
      console.error('Error fetching category tree:', error);
    }
  },
};
