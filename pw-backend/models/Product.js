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
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    webshopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Webshops',
        key: 'id',
      },
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
    Product.belongsTo(models.Webshop, {
      foreignKey: 'webshopId',
      as: 'webshop',
    });
  };

  Product.deleteAllByCategoryId = async function (categoryId) {
    try {
      const result = await this.destroy({ where: { category: categoryId } });
      return result;
    } catch (error) {
      console.error('Error deleting products by category ID:', error);
      throw error;
    }
  };


  return Product;
  
};
