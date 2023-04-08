// utils/updateCategoryTree.js
import { categoryStructure as importedCategoryStructure } from '@/utils/categoryStructure';

function findCategoryBySlug(slug, categories) {
  console.log(slug);
  console.log(categories);
  for (const category of categories) {
    if (category.slug === slug) {
      console.log(category.slug);
      console.log(slug);
      return category;
    }
    if (category.children) {
      const foundCategory = findCategoryBySlug(slug, category.children);
      if (foundCategory) {
        return foundCategory;
      }
    }
  }
  return null;
}


export default function updateCategoryTree(categorySlug, setCategoryTree) {
  const categoryStructure = importedCategoryStructure.tree;
  const category = findCategoryBySlug(categorySlug, categoryStructure);
  const newCategoryTree = [];

  let currentCategory = category;
  while (currentCategory) {
    newCategoryTree.unshift({
      name: currentCategory.name,
      url: currentCategory.slug,
    });
    currentCategory = currentCategory.parent;
  }
  setCategoryTree(newCategoryTree);
}
