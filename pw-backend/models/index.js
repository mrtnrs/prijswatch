const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models = {
  Webshop: require('./Webshop.js')(sequelize, Sequelize.DataTypes),
  Product: require('./Product.js')(sequelize, Sequelize.DataTypes),
  Price: require('./Price.js')(sequelize, Sequelize.DataTypes),
  Scraper: require('./Scraper.js')(sequelize, Sequelize.DataTypes),
  ScraperError: require('./ScraperError.js')(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

sequelize.sync().then(() => {
  console.log('All tables created successfully.');
}).catch((error) => {
  console.error('Error creating tables:', error);
});


models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = {
  ...models,
  sequelize,
};
