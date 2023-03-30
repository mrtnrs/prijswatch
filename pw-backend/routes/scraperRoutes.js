// scraperRoutes.js
const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');


router.get('/', scraperController.getAllScrapers);
router.put('/update/:scraperId', scraperController.updateScraper);
router.delete('/delete/:id', scraperController.deleteScraper);
router.patch('/update-active-state/:scraperId', scraperController.updateActiveState);


// Test scraper
router.post('/test', async (req, res) => {
  console.log('test succes');
  console.log('received data:', req.body);
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

// run scraper once

router.post('/run-once/:id', async (req, res) => {
  try {
    const scraperId = req.params.id;
    console.log(scraperId);
    // Pass the request and response objects to runScraper
    await scraperController.runScraper(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});



router.post("/remove", scraperController.removeScraper);
router.get("/:name", scraperController.getScraper);
router.get("/run/:name", scraperController.runScraper);



module.exports = router;