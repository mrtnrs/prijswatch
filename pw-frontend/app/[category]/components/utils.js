export default function findCategoryBySlug(slug, categories) {
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
