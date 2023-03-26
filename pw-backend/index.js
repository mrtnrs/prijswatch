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

// app.use(session({ secret: process.env.PASSPORT_SECRET, resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// passportConfig(passport);

// Alternatively, you can set specific CORS options
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
//   credentials: true, // Allow cookies to be sent
//   optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// }));


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

