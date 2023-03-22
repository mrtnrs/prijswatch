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
  Product: require('./product.js')(sequelize, Sequelize.DataTypes),
  Price: require('./price.js')(sequelize, Sequelize.DataTypes),
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
