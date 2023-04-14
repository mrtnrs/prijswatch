const MiniSearch = require('minisearch');
const { MetaProduct } = require('./models');

async function fetchMetaProducts() {
  const metaProducts = await MetaProduct.findAll({
    attributes: ['name', 'description', 'imageUrl', 'slug', 'brand', 'category'],
  });
  const metaProductsJSON = metaProducts.map((mp) => mp.toJSON());
  console.log(metaProductsJSON);
  return metaProducts.map((mp) => mp.toJSON());
}

function createMiniSearch(metaProducts) {
  const miniSearchInstance = new MiniSearch({
    fields: ['name', 'description'],
    storeFields: ['name', 'imageUrl', 'slug', 'brand', 'category'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
    },
    idField: 'slug', // Add this line to use the "slug" field as the identifier
  });

  miniSearchInstance.addAll(metaProducts);
  return miniSearchInstance;
}

async function updateSearchIndex(miniSearchInstance) {
  const metaProducts = await fetchMetaProducts();
  miniSearchInstance.removeAll();
  miniSearchInstance.addAll(metaProducts);
}

module.exports = { fetchMetaProducts, createMiniSearch, updateSearchIndex };
