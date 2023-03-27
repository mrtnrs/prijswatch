const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;
const { sequelize } = require('./models');
const db = require('./models');
const cors = require('cors');

// const passport = require('passport');
// const session = require('express-session');
// const passportConfig = require('./passportConfig');

// SENTRY
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.errorHandler());

// Enable CORS for all routes
app.use(cors());


// Import routes
const productRoutes = require('./routes/productRoutes');
const webshopRoutes = require('./routes/webshopRoutes');
const priceRoutes = require('./routes/priceRoutes');
const scraperRoutes = require('./routes/scraperRoutes');
const authRoutes = require('./routes/authRoutes');

const scheduler = require('./scheduler');



// Connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    sequelize.sync(); // Add this line after establishing the connection
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

db.sequelize.sync();
 

app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Use routes
app.use('/api/products', productRoutes);
app.use('/api/webshops', webshopRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/scrapers', scraperRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});