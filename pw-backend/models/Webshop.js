module.exports = (sequelize, DataTypes) => {
  console.log('MODEL WEBSHOP');
  const Webshop = sequelize.define('Webshop', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryCost: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    freeDeliveryThreshold: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fixedDeliveryCost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
  tableName: 'Webshops',
});

  Webshop.associate = (models) => {
    Webshop.hasMany(models.Scraper, {
      foreignKey: 'webshopId',
      as: 'scrapers',
    });
  };

  return Webshop;
};
