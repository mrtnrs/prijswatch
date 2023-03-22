const { sequelize } = require('./models');

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
