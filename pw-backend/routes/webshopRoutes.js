const express = require("express");
const router = express.Router();
const webshopController = require("../controllers/webshopController");

// Other existing routes ...

router.post('/', (req, res, next) => {
  next();
}, webshopController.createWebshop);
router.get('/', webshopController.getAllWebshops);
router.put('/:id', webshopController.updateWebshop);
router.delete('/:id', webshopController.deleteWebshop);


module.exports = router;
