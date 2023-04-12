const express = require("express");
const router = express.Router();
const webshopController = require("../controllers/webshopController");
const authenticateUser = require("../middleware/authenticateUser");

// Other existing routes ...

router.post('/', authenticateUser('admin'), (req, res, next) => {
  next();
}, webshopController.createWebshop);
router.get('/', webshopController.getAllWebshops);
router.put('/:id', authenticateUser('admin'),  webshopController.updateWebshop);
router.delete('/:id', authenticateUser('admin'), webshopController.deleteWebshop);


module.exports = router;