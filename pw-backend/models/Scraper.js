module.exports = (sequelize, DataTypes) => {
  const Scraper = sequelize.define('Scraper', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['api', 'puppeteer']],
      },
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    webshopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Webshops',
        key: 'id',
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Scraper.associate = (models) => {
    Scraper.belongsTo(models.Webshop, {
      foreignKey: 'webshopId',
      onDelete: 'CASCADE',
    });
  };

  return Scraper;
};
