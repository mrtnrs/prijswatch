// scraperRoutes.js
const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

router.post('/run-scraper', scraperController.runScraper);

// Test scraper
router.post('/test', async (req, res) => {
  try {
    const result = await scraperController.testScraper(req, res);
    console.log("testing...");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save scraper
router.post('/save', async (req, res) => {
  try {
    await scraperController.saveScraper(req, res);
    res.status(200).json({ message: "Scraper saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update scraper
router.put('/update', async (req, res) => {
  try {
    await scraperController.updateScraper(req, res);
    res.status(200).json({ message: "Scraper updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", scraperController.addScraper);
router.post("/remove", scraperController.removeScraper);
router.get("/:name", scraperController.getScraper);
router.get("/", scraperController.getAllScrapers);
router.get("/run/:name", scraperController.runScraper);



module.exports = router;