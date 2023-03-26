// In your "scraperRoutes.js" file, import the "ensureAuthenticated" middleware
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

// Use the middleware to protect the route
router.get('/', ensureAuthenticated, scraperController.getScrapers);
