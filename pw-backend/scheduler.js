const cron = require('node-cron');
const scraperController = require('./controllers/scraperController');

// Replace '*/5 * * * *' with your desired schedule
const schedule = '0 0 * * *';

cron.schedule(schedule, async () => {
  console.log('Running scheduled scraper task...');
  try {
    await scraperController.runScraper();
    console.log('Scraper task completed successfully');
  } catch (error) {
    console.error('An error occurred while running the scheduled scraper task:', error);
  }
});
