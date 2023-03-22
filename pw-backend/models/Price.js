const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    static associate(models) {
      Price.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }

  Price.init(
    {
      value: DataTypes.DOUBLE,
      currency: DataTypes.STRING,
      formattedValue: DataTypes.STRING,
      productId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Price',
    }
  );

  return Price;
};
