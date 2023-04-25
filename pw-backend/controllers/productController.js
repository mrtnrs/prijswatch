const { Product, MetaProduct, Price, Webshop, sequelize, Sequelize } = require('../models');
const { Op } = require('sequelize');


exports.createOrUpdateProduct = async (productData) => {
  const existingProduct = await Product.findOne({ where: { url: productData.url } });

  if (existingProduct) {
    await existingProduct.update(productData);
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
  try {
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

// productController.js

exports.fetchNeedReviewProducts = async (req, res) => {
  console.log('fetchNeedReview');
  try {
    const needReviewProducts = await Product.findAll({
      where: {
        needsreview: true,
      },
      include: [
        {
          model: Webshop,
          as: 'webshop',
        },
      ],
    });

    // Format the products without including the latest price
    const formattedProducts = needReviewProducts.map((product) => {
      return {
        ...product.toJSON(),
      };
    });
    console.log('ABC: ', formattedProducts);
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products that need review:', error);
    res.status(500).json({ message: 'Error fetching products that need review' });
  }
};



// Get products by MetaProduct

exports.getProductsByMetaProductId = async (req, res) => {
  console.log('getProductsByMeta');
  try {
    const metaProductId = req.params.metaProductId;
const products = await Product.findAll({
    where: { metaProductId },
    include: [
      {
        model: Webshop,
        as: 'webshop',
      },
      {
        model: Price,
        as: 'prices',
        limit: 1,
        order: [['createdAt', 'DESC']],
      },
    ],
  });

    // Format the products with the latest price
    const formattedProducts = products.map((product) => {
      const latestPrice = product.prices[0];
      return {
        ...product.toJSON(),
        latestPrice: latestPrice ? latestPrice.value : null,
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products by metaProductId:', error);
    res.status(500).json({ message: 'Error fetching products by metaProductId' });
  }
};


exports.getMetaProductsByCategoryAndBrand = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const query = `
      SELECT
        "brand",
        array_agg("id") AS "metaProductIds",
        array_agg("name") AS "names",
        array_agg("imageUrl") AS "imageUrls",
        array_agg("slug") AS "slugs"
      FROM
        "MetaProducts"
      WHERE
        "categoryId" = :categoryId
      GROUP BY
        "brand"
      ORDER BY
        "brand" ASC;
    `;

    const metaProducts = await sequelize.query(query, {
      replacements: { categoryId: categoryId },
      type: Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(metaProducts);
  } catch (error) {
    console.error('Error fetching MetaProducts grouped by brand:', error);
    res.status(500).json({
      message: 'Error fetching MetaProducts grouped by brand',
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};


