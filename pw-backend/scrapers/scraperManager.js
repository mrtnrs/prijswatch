const { Op } = require("sequelize");
const { Product, Scraper, MetaProduct, Category } = require('../models');
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
    constructor() {
    this.miniSearchOptions = {
      fields: ['name', 'description'],
      storeFields: ['name', 'imageUrl', 'slug', 'brand', 'category'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
      },
      idField: 'slug',
    };
  }

static async loadScrapers() {
  try {
    const scrapers = await Scraper.findAll({
      where: { active: true }, // Only return active scrapers
    });
    return scrapers;
  } catch (error) {
    console.error(`Error loading scrapers: ${error.message}`);
    return [];
  }
}


  static async findLocalMatchingMetaProduct(scrapedProduct, metaProducts) {
    console.log('Finding Local Match');
    if (metaProducts.length === 0) {
      console.log('FLM: metaProducts.length is null');
      return null;
    }

    const threshold = 0.82;
    const target = scrapedProduct.toLowerCase();
    const candidates = metaProducts.map((metaProduct) => metaProduct.dataValues.name.toLowerCase());

    const result = stringSimilarity.findBestMatch(target, candidates);
      // Log the rating, original value, and matched value
  console.log('Similarity ratings:', result.ratings);
  console.log('Original value:', target);
  console.log('Matched value:', candidates[result.bestMatchIndex]);
  console.log('Best match rating:', result.bestMatch.rating);

    if (result.bestMatch.rating >= threshold) {
      return metaProducts[result.bestMatchIndex].dataValues.id;
    } else {
      return null;
    }
  }
  

  static async setupMiniSearch() {
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

      console.log('setupMiniSearch: miniSearchInstance:', miniSearchInstance);
      return miniSearchInstance;
    } catch (error) {
      console.error('Error in setupMiniSearch:', error);
    }
  }

 static async checkForChangesAndUpdateIndex(miniSearchInstance) {
    console.log('miniSearchInstance.documents');
  // const latestMetaProductInIndex = Array.from(miniSearchInstance._storedFields.values()).reduce((latest, document) => {
  //   const createdAt = new Date(document.createdAt);
  //   return createdAt > latest.createdAt ? document : latest;
  // }, { createdAt: new Date(0) });

   const latestMetaProductInIndex = Array.from(miniSearchInstance._storedFields.values()).reduce((latest, document) => {
    return document.slug > latest.slug ? document : latest;
  }, { slug: '' });

    const latestMetaProductInDB = await MetaProduct.findOne({
      order: [['createdAt', 'DESC']],
    });

   if (!latestMetaProductInDB || latestMetaProductInDB.slug !== latestMetaProductInIndex.slug) {
    // Update the index
      const metaProducts = await MetaProduct.findAll();
          const miniSearchOptions = {
      fields: ['name', 'description', 'brand', 'category'],
      storeFields: ['name', 'imageUrl', 'slug', 'brand', 'category'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
      },
      idField: 'slug',
    };
      miniSearchInstance = new MiniSearch(miniSearchOptions);
      miniSearchInstance.addAll(metaProducts);
      fs.writeFileSync(INDEX_FILE, JSON.stringify(miniSearchInstance.toJSON()));
    }

    return miniSearchInstance;
  }


async search(query) {
  console.log('search entered')
  const miniSearchInstance = await ScraperManager.setupMiniSearch();
  console.log('miniSearchInstance', miniSearchInstance);

  // Search for product names
  const productNameResults = miniSearchInstance.search(query, { fields: ['name'] }).slice(0, 10);

  // If product names are found, return the results
  if (productNameResults.length > 0) {
    return productNameResults;
  }

  // If no product names found, search for brand names
  const brandNameResults = miniSearchInstance.search(query, { fields: ['brand'] }).slice(0, 10);
  console.log('NOTHING FOUND');
  // If brand names are found, return the results
  if (brandNameResults.length > 0) {
    return brandNameResults;
  }
  console.log('NO BRANDNAME FOUND');
  // If no brand names found, search for categories
  const categoryResults = miniSearchInstance.search(query, { fields: ['category'] }).slice(0, 10);

  return categoryResults;
}



  static async matchUnlinkedProducts() {
    const BATCH_SIZE = 50;
    let offset = 0;
    let unlinkedProductsBatch;

    do {
      let unlinkedProducts = await Product.findAll({
        where: { metaProductId: null },
      });

      unlinkedProductsBatch = await Product.findAll({
        where: { metaProductId: null },
        limit: BATCH_SIZE,
        offset: offset,
      });

      for (const scrapedProduct of unlinkedProductsBatch) {
        try {
          const { sanitizedTitle, metadata } = await sanitizeTitleAndExtractMetadata(scrapedProduct.name, scrapedProduct, Product);

          if (!sanitizedTitle) {
            console.log('no sanitised title; skip');
            continue;
          }

          const categoryMetaProducts = await MetaProduct.findAll({
           where: { categoryId: scrapedProduct.categoryId },
         });
          console.log('ScraperManager:');
          console.log(sanitizedTitle);
        // local check
          const localMatch = await ScraperManager.findLocalMatchingMetaProduct(
            sanitizedTitle,
            categoryMetaProducts
            );

          if (localMatch) {
            await Product.update(
            {
              metaProductId: localMatch,
              metadata: JSON.stringify(metadata),
            },
            { where: { id: scrapedProduct.id } }
            );

            const existingMetaProduct = await MetaProduct.findByPk(localMatch);
            if (!existingMetaProduct.imageUrl && scrapedProduct.imageUrl) {
              await MetaProduct.update(
                { imageUrl: scrapedProduct.imageUrl },
                { where: { id: existingMetaProduct.id } }
                );
            }

          } else {
            const slug = generateSlug(sanitizedTitle);
            const brand = scrapedProduct.brand || (metadata && metadata.brand) || null;

            const category = await Category.findOne({
              where: { id: scrapedProduct.categoryId },
            });

            if (!category) {
              console.error(`Category not found for product ID: ${scrapedProduct.id}`);
              await Product.update({ needsReview: true }, { where: { id: scrapedProduct.id } });
              continue; // Skip the current iteration and move on to the next product
            }


            const newMetaProduct = await MetaProduct.create({
              name: sanitizedTitle,
              brand: brand,
              category: scrapedProduct.category,
              categoryId: category.id, // This will store the categoryId (UUID)
              slug,
              imageUrl: scrapedProduct.imageUrl,
            });

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
           console.error(error); // Log the error details
          await Product.update(
            { needsReview: true },
            { where: { id: scrapedProduct.id } }
            );
        }
      }

      offset += BATCH_SIZE;
    } while (unlinkedProductsBatch.length > 0);
  }



  static intervalToMinutes(interval) {
  if (interval.endsWith('h')) {
    const hours = parseInt(interval.slice(0, -1), 10);
    return hours * 60;
  } else if (interval.endsWith('m')) {
    return parseInt(interval.slice(0, -1), 10);
  } else {
    console.error('Invalid interval format:', interval);
    return 0;
  }
}



  async runDueScrapers(req, res) {
    const scrapers = await ScraperManager.loadScrapers();
    for (const scraper of scrapers) {
      const { interval, lastRun, id } = scraper;
      const intervalInMinutes = ScraperManager.intervalToMinutes(interval);
      const currentTime = new Date();
      const nextRun = new Date(lastRun.getTime() + intervalInMinutes * 60 * 1000);
      console.log('calculating if needs to run');
      if (currentTime >= nextRun) {
        try {
          console.log('running scraper');
          await scraperController.runScraper({ params: { id } }, null, false);
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

    await ScraperManager.matchUnlinkedProducts();
      // Check if it's time to update the MiniSearch index
    const today = new Date();
    const lastUpdateTime = fs.existsSync(INDEX_FILE) ? fs.statSync(INDEX_FILE).mtime : new Date(0);
    const daysSinceLastUpdate = (today - lastUpdateTime) / (1000 * 60 * 60 * 24);
    if (daysSinceLastUpdate >= 7) {
      const miniSearchInstance = await ScraperManager.setupMiniSearch();
      await ScraperManager.checkForChangesAndUpdateIndex(miniSearchInstance);
    }
    res.status(200).json({ message: "Scraper saved successfully" });
  }


}

module.exports = ScraperManager;

