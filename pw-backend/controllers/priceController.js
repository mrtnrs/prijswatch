const { Product, Price } = require('../models');

exports.getProductPricesByMetaProduct = async (req, res) => {
  const metaProductId = req.params.metaProductId;

  try {
    const products = await Product.findAll({
      where: { metaProductId },
      include: [
        {
          model: Price,
          as: 'prices',
        },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching price data:', error);
    res.status(500).json({ message: 'Error fetching price data' });
  }
};
