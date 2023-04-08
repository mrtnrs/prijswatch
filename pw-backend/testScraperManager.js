// const { Category } = require('./models');
// const slugify = require('slugify');

// const generateSlug = (categoryName) => {
//   return slugify(categoryName, {
//     lower: true,
//     replacement: '-',
//     remove: /[*+~.()'"!:@]/g,
//   });
// };

// const updateCategorySlugs = async () => {
//   const categories = await Category.findAll();

//   for (const category of categories) {
//     const categorySlug = generateSlug(category.name);
//     await category.update({ slug: categorySlug });
//   }

//   console.log('Category slugs updated successfully!');
// };

// updateCategorySlugs();


// const ScraperManager = require("./scrapers/ScraperManager");

// (async () => {
//   const scraperManager = new ScraperManager();
//   await scraperManager.runDueScrapers();
// })();

const { updateCategoryStructure } = require('./controllers/categoryController');

const regenerateCategoryStructure = async () => {
  try {
    await updateCategoryStructure();
    console.log('Category structure updated successfully!');
  } catch (error) {
    console.error('Error updating category structure:', error);
  }
};

regenerateCategoryStructure();
