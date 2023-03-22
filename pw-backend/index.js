const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const productRoutes = require('./routes/productRoutes');
const webshopRoutes = require('./routes/webshopRoutes');
const priceRoutes = require('./routes/priceRoutes');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


app.use('/api/products', productRoutes);
app.use('/api/webshops', webshopRoutes);
app.use('/api/prices', priceRoutes);