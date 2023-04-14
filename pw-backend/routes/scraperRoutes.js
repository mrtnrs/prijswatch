// scraperRoutes.js
const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');
const ScraperManager = require("../scrapers/scraperManager");
const scraperManager = new ScraperManager();
const authenticateUser = require("../middleware/authenticateUser");


router.get('/', authenticateUser('admin'), scraperController.getAllScrapers);
router.put('/update/:scraperId', authenticateUser('admin'), scraperController.updateScraper);
router.delete('/delete/:id', authenticateUser('admin'), scraperController.deleteScraper);
router.patch('/update-active-state/:scraperId', authenticateUser('admin'), scraperController.updateActiveState);


// Test scraper
router.post('/test', authenticateUser('admin'), async (req, res) => {
  try {
    const result = await scraperController.testScraper(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save scraper
router.post('/save', authenticateUser('admin'), async (req, res) => {
  try {
    await scraperController.saveScraper(req, res);
    res.status(200).json({ message: "Scraper saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// run scraper once

router.post('/run-once/:id', authenticateUser('admin'), async (req, res) => {
  try {
    const scraperId = req.params.id;
    console.log(scraperId);
    // Pass the request and response objects to runScraper
    await scraperController.runScraper(req, res);
    // Call matchUnlinkedProducts after running the scraper
    await scraperManager.matchUnlinkedProducts();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});



router.post("/remove", authenticateUser('admin'), scraperController.removeScraper);
router.get("/:name", authenticateUser('admin'), scraperController.getScraper);
router.get("/run/:name", authenticateUser('admin'), scraperController.runScraper);



module.exports = router;

