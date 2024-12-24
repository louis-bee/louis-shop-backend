const mysql = require('mysql2')

const db = mysql.createPool({
  host: 'localhost',
  user:'root',
  password:'159357',
  database:'shopping'
})

module.exports = db