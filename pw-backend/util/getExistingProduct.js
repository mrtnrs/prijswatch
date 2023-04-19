const { Product } = require('../models');

async function getExistingProduct(productUrl, categoryId) {
  try {
    const existingProduct = await Product.findOne({
      where: {
        url: productUrl,
        categoryId: categoryId
      }
    });

    return existingProduct || null;
  } catch (error) {
    console.error('Error fetching existing product:', error);
    return null;
  }
}

module.exports = getExistingProduct;