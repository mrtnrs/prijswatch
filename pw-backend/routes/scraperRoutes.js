// scraperRoutes.js
const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

console.log('1. Before attaching runScraper to the route...');
router.post('/run-scraper', scraperController.runScraper);
console.log('2. After attaching runScraper to the route...');

module.exports = router;
