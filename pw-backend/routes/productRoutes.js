const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/scrape-and-store', productController.createOrUpdateProductHandler);
router.get('/', productController.getAllProductsHandler);

module.exports = router;
