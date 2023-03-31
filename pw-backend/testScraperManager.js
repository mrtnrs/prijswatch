const { MetaProduct } = require('./models');
const slugify = require('slugify');

const generateSlug = (productName) => {
  return slugify(productName, {
    lower: true,
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
  });
};

const updateSlugs = async () => {
  const metaProducts = await MetaProduct.findAll();

  for (const metaProduct of metaProducts) {
    const slug = generateSlug(metaProduct.name);
    await metaProduct.update({ slug });
  }

  console.log('Slugs updated successfully!');
};

updateSlugs();


// const ScraperManager = require("./scrapers/ScraperManager");

// (async () => {
//   const scraperManager = new ScraperManager();
//   await scraperManager.runDueScrapers();
// })();
