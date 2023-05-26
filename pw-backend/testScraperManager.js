
const ScraperManager = require('./scrapers/scraperManager');
const scraperManager = new ScraperManager();

async function main() {
  try {
    await scraperManager.runDueScrapers(true);
    console.log('Successfully executed runDueScrapers');
  } catch (error) {
    console.error('Error executing runDueScrapers:', error);
  }
}

main();

// DELETE ALL PRODUCTS IN CATEGORY

// const deleteProductsInCategory = async (categoryId) => {
//   const { Category, MetaProduct, Product, Price } = require('./models');

//   // Find all MetaProducts in the category
//   const metaProducts = await MetaProduct.findAll({
//     where: { categoryId },
//   });

//   // For each MetaProduct, find and delete associated Products and Prices
//   for (const metaProduct of metaProducts) {
//     const products = await Product.findAll({
//       where: { metaProductId: metaProduct.id },
//     });

//     for (const product of products) {
//       // Delete associated Prices
//       await Price.destroy({ where: { productId: product.id } });
//     }

//     // Delete the Products
//     await Product.destroy({ where: { metaProductId: metaProduct.id } });
//   }

//   // Delete the MetaProducts
//   await MetaProduct.destroy({ where: { categoryId } });

// };

// // Call the function
// deleteProductsInCategory('114b9201-567c-49b9-90ed-1b22a4e31c98');


// const axios = require("axios");
// const sharp = require("sharp");
// const fs = require("fs");

// async function testWorker() {
//   console.log("Starting test");
//   const imageUrl =
//     "https://media.krefel.be/sys-master/products/9239117955102/1440x1440.11005396_01.webp";
//   const workerUrl = "https://worker_prijswatch.pandabutcher.workers.dev";

//   try {
//     console.log("Fetching image from URL");
//     const imageResponse = await axios.get(imageUrl, {
//       responseType: "arraybuffer",
//     });
//     console.log("Image fetched");

//     console.log("Resizing image using Sharp");
//     const imageBuffer = await sharp(imageResponse.data)
//       .resize(500, 500, {
//         fit: "inside",
//         withoutEnlargement: true,
//       })
//       .webp()
//       .toBuffer();
//     console.log("Image resized");

// const headers = {
//   "Content-Type": "image/webp",
//   "X-Custom-Auth-Key": "azerty", // Replace this with your actual secret value
// };

// console.log("Sending image data to Worker");
// const response = await axios.post(workerUrl, imageBuffer, {
//   responseType: "text",
//   headers: headers,
// });
// console.log("Image processed successfully:", response.data);
//   } catch (error) {
//     console.error("Error processing image:", error.message);
//     console.error("Error details:", error.response?.data);
//   }
// }

// testWorker();



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

// const { updateCategoryStructure } = require('./controllers/categoryController');

// const regenerateCategoryStructure = async () => {
//   try {
//     await updateCategoryStructure();
//     console.log('Category structure updated successfully!');
//   } catch (error) {
//     console.error('Error updating category structure:', error);
//   }
// };

// regenerateCategoryStructure();
