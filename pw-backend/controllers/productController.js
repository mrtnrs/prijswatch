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

const getAllProducts = async () => {
  const products = await Product.findAll();
  return products;
};

const getAllProductsHandler = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the products.', error });
  }
};


module.exports = {
  createOrUpdateProduct,
  createOrUpdateProductHandler,
  getAllProductsHandler,
  // Other functions
};