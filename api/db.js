const mysql = require('mysql2/promise');

// Tạo pool connection cho database
const db = mysql.createPool({
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'UsxIKquwHoICujbKadeBPqxJyYgDLNNJ',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

module.exports = db;