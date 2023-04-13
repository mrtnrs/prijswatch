const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

// Add any routes here
router.get('/:metaProductId', priceController.getProductPricesByMetaProduct);


module.exports = router;