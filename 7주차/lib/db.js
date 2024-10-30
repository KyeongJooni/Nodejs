var mysql = require('mysql');

// MySQL 연결 설정
var db = mysql.createConnection({
  host: 'localhost',
  user: 'nodejs',
  password: 'nodejs',
  database: 'webdb2024'
});

db.connect();  // MySQL 연결
module.exports = db;  // 모듈로 내보내기
