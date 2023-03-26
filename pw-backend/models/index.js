const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

console.log(config);
console.log(sequelize);

const models = {
  Webshop: require('./Webshop.js')(sequelize, Sequelize.DataTypes),
  Product: require('./Product.js')(sequelize, Sequelize.DataTypes),
  Price: require('./Price.js')(sequelize, Sequelize.DataTypes),
  Scraper: require('./Scraper.js')(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = {
  ...models,
  sequelize,
};
