// utils.js
import slugify from 'slugify';

 export function getCategoryPath(categorySlug, categoryStructure) {
  // Sanitize the categorySlug
    const sanitizedCategorySlug = slugify(categorySlug, { lower: true, strict: true });

    for (const category of categoryStructure) {
    // Sanitize the category slug
      const sanitizedCategorySlugInStructure = slugify(category.slug, { lower: true, strict: true });

      if (sanitizedCategorySlugInStructure === sanitizedCategorySlug) {
        return [category.slug];
      }
      if (category.children) {
        const path = getCategoryPath(sanitizedCategorySlug, category.children);
        if (path) {
          return [category.slug, ...path];
        }
      }
    }
    return null;
  }

export function getProductUrl(product, categoryStructure) {
  const catPath = getCategoryPath(product.category, categoryStructure);
  const productSlug = slugify(product.name, { lower: true, strict: true });
  return catPath ? `/${catPath.join('/')}/${productSlug}` : `/${productSlug}`;
}
