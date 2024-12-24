// db.js
const mysql = require('mysql2/promise'); // 使用 Promise 版本的 mysql2

const db2 = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '159357',
  database: 'shopping'
});

module.exports = db2; // 导出 db 对象