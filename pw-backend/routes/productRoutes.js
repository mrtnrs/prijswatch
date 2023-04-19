const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateUser = require("../middleware/authenticateUser");



router.get('/:category/meta-product', productController.getAllMetaProductsByCategory);
router.get('/:category/:slug/meta-product', productController.getMetaProductBySlugHandler);

router.get('/by-meta-product-id/:metaProductId', productController.getProductsByMetaProductId);
router.get('/:category/grouped-by-brand', productController.getMetaProductsByCategoryAndBrand);

router.post('/scrape-and-store', productController.createOrUpdateProductHandler);
router.get('/', productController.getAllProductsHandler);

router.get('/needs-review', authenticateUser('admin'), productController.fetchNeedReviewProducts);


router.get('/meta-product/:id', productController.getMetaProductByIdHandler);
router.get('/products-for-meta-product/:metaProductId', productController.getProductsForMetaProductHandler);


module.exports = router;
