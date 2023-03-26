// scraperRoutes.js
const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

router.post('/run-scraper', scraperController.runScraper);

router.post("/add", scraperController.addScraper);
router.post("/remove", scraperController.removeScraper);
router.get("/:name", scraperController.getScraper);
router.get("/", scraperController.getAllScrapers);
router.get("/run/:name", scraperController.runScraper);

module.exports = router;
