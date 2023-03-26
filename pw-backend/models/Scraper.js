module.exports = (sequelize, DataTypes) => {
  const Scraper = sequelize.define('Scraper', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  // Add associations if needed

  return Scraper;
};
