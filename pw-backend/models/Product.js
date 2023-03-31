// Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metaProductId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'MetaProducts',
        key: 'id',
      },
    },
    needsreview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Product.associate = (models) => {
    // Associations
    Product.belongsTo(models.MetaProduct, {
      foreignKey: 'metaProductId',
      as: 'metaProduct',
    });
    Product.hasMany(models.Price, {
      foreignKey: 'productId',
      as: 'prices',
    });
  };

  return Product;
};
