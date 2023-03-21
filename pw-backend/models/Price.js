const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');
const Webshop = require('./Webshop');

const Price = sequelize.define('Price', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Price.belongsTo(Product, { foreignKey: 'productId' });
Price.belongsTo(Webshop, { foreignKey: 'webshopId' });
Product.hasMany(Price, { foreignKey: 'productId' });
Webshop.hasMany(Price, { foreignKey: 'webshopId' });

module.exports = Price;