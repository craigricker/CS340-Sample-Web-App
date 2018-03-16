var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_rickercr',
  password        : '9368',
  database        : 'cs340_rickercr'
});
module.exports.pool = pool;
