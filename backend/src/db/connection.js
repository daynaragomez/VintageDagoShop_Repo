const mysql = require('mysql2/promise');

const dbHost = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10);
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'vintagedago';
const dbUser = process.env.DB_USER || process.env.MYSQL_USER || 'vintagedago_user';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';

const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: dbPassword,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
