// productMatcher.js
const stringSimilarity = require('string-similarity');

const MIN_SIMILARITY_SCORE = 0.8; // Adjust this value based on your desired matching accuracy

async function findMatchingMetaProduct(product, metaProducts) {
  const productName = product.name.toLowerCase();
  const productBrand = product.brand.toLowerCase();
  const productCategory = product.category.toLowerCase();

  const matchingMetaProducts = metaProducts.filter((metaProduct) => {
    const metaProductName = metaProduct.name.toLowerCase();
    const metaProductBrand = metaProduct.brand.toLowerCase();
    const metaProductCategory = metaProduct.category.toLowerCase();

    // Compare product and metaProduct attributes
    const nameSimilarity = stringSimilarity.compareTwoStrings(productName, metaProductName);
    const brandSimilarity = stringSimilarity.compareTwoStrings(productBrand, metaProductBrand);
    const categorySimilarity = stringSimilarity.compareTwoStrings(productCategory, metaProductCategory);

    return (
      nameSimilarity >= MIN_SIMILARITY_SCORE &&
      brandSimilarity >= MIN_SIMILARITY_SCORE &&
      categorySimilarity >= MIN_SIMILARITY_SCORE
    );
  });

  // Return the best matching MetaProduct or null if no match is found
  return matchingMetaProducts.length > 0 ? matchingMetaProducts[0] : null;
}

module.exports = {
  findMatchingMetaProduct,
};
