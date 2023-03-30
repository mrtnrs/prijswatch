module.exports = (sequelize, DataTypes) => {
  const ScraperError = sequelize.define('ScraperError', {
    scraperId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Scrapers',
        key: 'id',
      },
    },
    productData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'ScraperErrors',
    });

  ScraperError.associate = (models) => {
    ScraperError.belongsTo(models.Scraper, {
      foreignKey: 'scraperId',
      onDelete: 'CASCADE',
    });
  };
  
  return ScraperError;
};