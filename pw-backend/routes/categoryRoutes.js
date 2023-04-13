const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateUser = require("../middleware/authenticateUser");

const routeLogger = (req, res, next) => {
  console.log('Route /categoryStructure accessed');
  next();
};


router.get('/', categoryController.getFullCategoryTree);
router.post('/',authenticateUser('admin'), categoryController.createCategory);
router.delete('/:categoryId',authenticateUser('admin'), categoryController.deleteCategory);
router.get('/categoryStructure', routeLogger, categoryController.getCategoryStructure);


module.exports = router;