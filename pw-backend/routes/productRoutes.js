const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');



router.get('/:category/meta-product', productController.getAllMetaProductsByCategory);
router.get('/:category/:slug/meta-product', productController.getMetaProductBySlugHandler);

router.post('/scrape-and-store', productController.createOrUpdateProductHandler);
router.get('/', productController.getAllProductsHandler);



router.get('/meta-product/:id', productController.getMetaProductByIdHandler);
router.get('/products-for-meta-product/:metaProductId', productController.getProductsForMetaProductHandler);


module.exports = router;
