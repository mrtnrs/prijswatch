module.exports = (sequelize, DataTypes) => {
  const Scraper = sequelize.define('Scraper', {
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
      type: DataTypes.STRING,
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
    lastRun: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastRunStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['success', 'failure']],
      },
    },
    totalProducts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    changedProducts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    tableName: 'Scrapers',
  });

  Scraper.associate = (models) => {
    Scraper.belongsTo(models.Webshop, {
      foreignKey: 'webshopId',
      onDelete: 'CASCADE',
    });
  };

  return Scraper;
};
