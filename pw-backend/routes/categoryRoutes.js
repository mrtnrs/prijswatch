const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getFullCategoryTree);
router.post('/', categoryController.createCategory);
router.delete('/:categoryId', categoryController.deleteCategory);



module.exports = router;