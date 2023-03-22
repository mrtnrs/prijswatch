const { Product } = require('../models');

const createOrUpdateProduct = async (productData) => {
  const existingProduct = await Product.findOne({ where: { url: productData.url } });

  if (existingProduct) {
   // await existingProduct.update(productData);
    return existingProduct;
  } else {
    const newProduct = await Product.create(productData);
    return newProduct;
  }
};

const createOrUpdateProductHandler = async (req, res) => {
  const productData = req.body;
  const product = await createOrUpdateProduct(productData);

  if (product) {
    res.status(200).json({ message: 'Product created or updated.', product });
  } else {
    res.status(500).json({ message: 'An error occurred while creating or updating the product.' });
  }
};

module.exports = {
  createOrUpdateProduct,
  createOrUpdateProductHandler,
  // Other functions
};