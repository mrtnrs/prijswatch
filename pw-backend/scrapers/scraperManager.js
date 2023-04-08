const { Op } = require("sequelize");
const { Product, Scraper, MetaProduct } = require('../models');
const scraperController = require("../controllers/scraperController");
const { sanitizeTitleAndExtractMetadata } = require("../controllers/productMatcher");
const stringSimilarity = require('string-similarity');
const slugify = require('slugify');
const { createMiniSearch, updateSearchIndex } = require('../miniSearch');
const fs = require('fs');
const MiniSearch = require('minisearch');
const path = require('path');

const INDEX_FILE = path.join(__dirname, 'searchIndex.json')

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const generateSlug = (productName) => {
  return slugify(productName, {
    lower: true,
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
  });
};

class ScraperManager {
  constructor() {}

  async loadScrapers() {
    const scrapersData = await Scraper.findAll({
      where: {
        active: true,
      },
    });

    return scrapersData;
  }

  async findLocalMatchingMetaProduct(scrapedProduct, metaProducts) {
  if (metaProducts.length === 0) {
    return null;
  }

    const threshold = 0.8;
    const target = scrapedProduct;
    const candidates = metaProducts.map((metaProduct) => metaProduct.dataValues.name);

    const result = stringSimilarity.findBestMatch(target, candidates);

    if (result.bestMatch.rating >= threshold) {
      return metaProducts[result.bestMatchIndex].dataValues.id;
    } else {
      return null;
    }
  }
  

  async setupMiniSearch() {
      console.log('setupMiniSearch');
  const miniSearchOptions = {
    fields: ['name', 'description'],
    storeFields: ['name', 'imageUrl', 'slug', 'brand', 'category'],
    searchOptions: {
    prefix: true,
    fuzzy: 0.2,
  },
    idField: 'slug',
  };

    try {
    let miniSearchInstance;

      if (fs.existsSync(INDEX_FILE)) {
        const indexData = fs.readFileSync(INDEX_FILE, 'utf8');
        miniSearchInstance = MiniSearch.loadJSON(indexData, miniSearchOptions);
      } else {
        const metaProducts = await MetaProduct.findAll();
        miniSearchInstance = new MiniSearch(miniSearchOptions);
        miniSearchInstance.addAll(metaProducts);
        fs.writeFileSync(INDEX_FILE, JSON.stringify(miniSearchInstance.toJSON()));
      }

      return miniSearchInstance;
    } catch (error) {
      console.error('Error in setupMiniSearch:', error);
    }
  }

  async checkForChangesAndUpdateIndex(miniSearchInstance) {
  const latestMetaProductInIndex = miniSearchInstance.documents.reduce((latest, document) => {
    const createdAt = new Date(document.createdAt);
    return createdAt > latest.createdAt ? document : latest;
  }, { createdAt: new Date(0) });

  const latestMetaProductInDB = await MetaProduct.findOne({
    order: [['createdAt', 'DESC']],
  });

  if (latestMetaProductInDB.createdAt > new Date(latestMetaProductInIndex.createdAt)) {
    // Update the index
    const metaProducts = await MetaProduct.findAll();
    miniSearchInstance = new MiniSearch(miniSearchOptions);
    miniSearchInstance.addAll(metaProducts);
    fs.writeFileSync(INDEX_FILE, JSON.stringify(miniSearchInstance.toJSON()));
  }

  return miniSearchInstance;
}


  async search(query) {
    console.log('managerSearch: ' + query);
    const miniSearchInstance = await this.setupMiniSearch();
    console.log('C');
    console.log(miniSearchInstance.search(query))
    // const autoSuggestions = miniSearchInstance.autoSuggest(query, { fuzzy: 0.2, top: 10 });

    return miniSearchInstance.search(query).slice(0, 10);;
    // return autoSuggestions;
  }


  async matchUnlinkedProducts() {
    const BATCH_SIZE = 50;
    let offset = 0;
    let unlinkedProductsBatch;

    do {
      let unlinkedProducts = await Product.findAll({
        where: { metaProductId: null },
      });

      console.log(`Number of unlinked products: ${unlinkedProducts.length}`);

      unlinkedProductsBatch = await Product.findAll({
        where: { metaProductId: null },
        limit: BATCH_SIZE,
        offset: offset,
      });

      for (const scrapedProduct of unlinkedProductsBatch) {
        try {
          const { sanitizedTitle, metadata } = await sanitizeTitleAndExtractMetadata(scrapedProduct.name, scrapedProduct);

          console.log('sanitizedTitle:', sanitizedTitle);
          console.log('metadata:', metadata);

          const categoryMetaProducts = await MetaProduct.findAll({
           where: { category: scrapedProduct.category },
          });

          console.log('categoryMetaProducts:', categoryMetaProducts);

        // local check
        const localMatch = await this.findLocalMatchingMetaProduct(
          sanitizedTitle,
          categoryMetaProducts
        );

        console.log('localMatch:', localMatch);

        if (localMatch) {
          console.log('Match found; updating metaProductId');
          console.log(localMatch);
          await Product.update(
            {
              metaProductId: localMatch,
              metadata: JSON.stringify(metadata),
            },
            { where: { id: scrapedProduct.id } }
          );
        } else {
          console.log('No Match found; creating new MetaProduct');
          const slug = generateSlug(sanitizedTitle);
          const brand = scrapedProduct.brand || (metadata && metadata.brand) || null;

          const newMetaProduct = await MetaProduct.create({
            name: sanitizedTitle,
            brand: brand,
            category: scrapedProduct.category,
            slug,
          });

          console.log('newMetaProduct:', newMetaProduct);

          await Product.update(
            {
              metaProductId: newMetaProduct.id,
              metadata: JSON.stringify(metadata),
            },
            { where: { id: scrapedProduct.id } }
          );
        }
      } catch (error) {
        console.error(`Error processing product ID: ${scrapedProduct.id}: ${error.message}`);
        await Product.update(
          { needsReview: true },
          { where: { id: scrapedProduct.id } }
        );
      }
    }

      offset += BATCH_SIZE;
    } while (unlinkedProductsBatch.length > 0);
  }



  async runDueScrapers() {
    const scrapers = await this.loadScrapers();

    for (const scraper of scrapers) {
      const { interval, lastRun, id } = scraper;
      const currentTime = new Date();
      const nextRun = new Date(lastRun.getTime() + interval * 60 * 1000);

      if (currentTime >= nextRun) {
        try {
          await scraperController.runScraper({ params: { scraperId: id } }, null, false);
          await Scraper.update(
            { lastRun: currentTime },
            { where: { id: id } }
          );
          console.log(`Scraper ${id} ran successfully.`);
        } catch (error) {
          console.error(`Error running scraper ${id}: ${error.message}`);
        }
      }
    }

    await this.matchUnlinkedProducts();
    await this.setupMiniSearch();
      // Check if it's time to update the MiniSearch index
  const today = new Date();
  const lastUpdateTime = fs.existsSync(INDEX_FILE) ? fs.statSync(INDEX_FILE).mtime : new Date(0);
  const daysSinceLastUpdate = (today - lastUpdateTime) / (1000 * 60 * 60 * 24);
  if (daysSinceLastUpdate >= 7) {
    const miniSearchInstance = await this.setupMiniSearch();
    await checkForChangesAndUpdateIndex(miniSearchInstance);
  }
  }
}

module.exports = ScraperManager;

