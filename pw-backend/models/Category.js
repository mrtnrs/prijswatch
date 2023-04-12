// Category.js
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
     timestamps: false,
  });

  Category.associate = (models) => {
    // Associations
    Category.hasMany(models.MetaProduct, {
      foreignKey: 'categoryId',
      as: 'metaProducts',
    });

    Category.belongsTo(Category, {
      foreignKey: 'parentId',
      as: 'parentCategory',
    });

    Category.hasMany(Category, {
      foreignKey: 'parentId',
      as: 'subcategories',
    });

    // Added association with Product model
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
    });
  };

  return Category;
};
