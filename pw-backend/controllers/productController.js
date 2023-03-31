const { Product, MetaProduct } = require('../models');
const { Op } = require('sequelize');


exports.createOrUpdateProduct = async (productData) => {
  const existingProduct = await Product.findOne({ where: { url: productData.url } });

  if (existingProduct) {
   // await existingProduct.update(productData);
    return existingProduct;
  } else {
    const newProduct = await Product.create(productData);
    return newProduct;
  }
};

exports.createOrUpdateProductHandler = async (req, res) => {
  const productData = req.body;
  const product = await createOrUpdateProduct(productData);

  if (product) {
    res.status(200).json({ message: 'Product created or updated.', product });
  } else {
    res.status(500).json({ message: 'An error occurred while creating or updating the product.' });
  }
};

exports.getAllProducts = async () => {
  const products = await Product.findAll();
  return products;
};

exports.getAllProductsHandler = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the products.', error });
  }
};

exports.getMetaProductByIdHandler = async (req, res) => {
  console.log('checky');
  try {
    console.log('no checki');
    const id = req.params.id;
    const metaProduct = await MetaProduct.findByPk(id);

    if (metaProduct) {
      res.status(200).json(metaProduct);
    } else {
      res.status(404).json({ message: 'MetaProduct not found.' });
    }
  } catch (error) {
    console.error('Error fetching MetaProduct:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the MetaProduct.', error });
  }
};


const getProductsForMetaProduct = async (metaProductId) => {
    console.log('productconroller 2');
  const products = await Product.findAll({ where: { metaProductId } });
  return products;
};

exports.getProductsForMetaProductHandler = async (req, res) => {
  try {
    const products = await getProductsForMetaProduct(req.params.metaProductId);
    console.log(products);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while fetching products for MetaProduct.', error });
  }
};

exports.getMetaProductBySlug = async (category, slug) => {
  const metaProduct = await MetaProduct.findOne({
    where: {
      category: { [Op.iLike]: category },
      slug: slug
    }
  });
  return metaProduct;
};

exports.getMetaProductBySlugHandler = async (req, res) => {
  try {
    const { category, slug } = req.params;
    const metaProduct = await exports.getMetaProductBySlug(category, slug);
    res.status(200).json(metaProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while fetching the MetaProduct.', error });
  }
};

// Get all MetaProducts

// productController.js

exports.getAllMetaProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const metaProducts = await MetaProduct.findAll({
      where: {
        category: { [Op.iLike]: category },
      },
    });
    res.status(200).json(metaProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching MetaProducts', error });
  }
};


