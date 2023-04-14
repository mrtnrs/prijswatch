require('dotenv').config();

const config = {
    username: process.env.COCKROACHDB_USERNAME,
    password: process.env.COCKROACHDB_PASSWORD,
    database: process.env.COCKROACHDB_DATABASE,
    host: process.env.COCKROACHDB_HOST,
    port: process.env.COCKROACHDB_PORT,
    dialect: 'postgres',
    dialectModule: require('pg'),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
};

module.exports = {
  development: config,
  production: config,
};