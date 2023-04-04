const express = require("express");
const router = express.Router();
const ScraperManager = require("../scrapers/scraperManager");
const scraperManagerInstance = new ScraperManager();

router.get('/', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    console.log(searchTerm);
    const searchResults = await scraperManagerInstance.search(searchTerm);
    console.log(searchResults);
    res.json(searchResults);
  } catch (error) {
    res.status(500).send('Error while searching: ' + error.message);
  }
});


module.exports = router;

