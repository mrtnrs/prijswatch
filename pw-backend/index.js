const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;
const { sequelize } = require('./models');

// SENTRY
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: "https://f4fc2fa6c6e54e1bb14aab645bc843d4@o4504884627177472.ingest.sentry.io/4504884628750336",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.errorHandler());

// Import routes
const productRoutes = require('./routes/productRoutes');
const webshopRoutes = require('./routes/webshopRoutes');
const priceRoutes = require('./routes/priceRoutes');
const scraperRoutes = require('./routes/scraperRoutes');

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Use routes
app.use('/api/products', productRoutes);
app.use('/api/webshops', webshopRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/scrapers', scraperRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

