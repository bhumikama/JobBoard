require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CLIENT || "postgres", // Default to postgres if not provided
    dialectOptions: {
      ssl: process.env.DB_USE_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    logging: console.log, // Enable query logging (optional, you can remove this)
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_DATABASE_NAME}_test`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CLIENT || "postgres",
    dialectOptions: {
      ssl: process.env.DB_USE_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CLIENT || "postgres",
    dialectOptions: {
      ssl: process.env.DB_USE_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    logging: false,
  }
};
