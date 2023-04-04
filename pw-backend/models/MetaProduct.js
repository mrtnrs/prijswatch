// metaProduct.js
module.exports = (sequelize, DataTypes) => {
  const MetaProduct = sequelize.define('MetaProduct', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    needsReview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
  });

  MetaProduct.associate = (models) => {
    // Associations
    MetaProduct.hasMany(models.Product, {
      foreignKey: 'metaProductId',
      as: 'products',
    });
    MetaProduct.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'categoryRef',
    });
  };

  return MetaProduct;
};
