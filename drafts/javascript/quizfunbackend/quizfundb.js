var mysql = require("mysql2");

var con = mysql.createConnection({
    host: 'localhost',
    user: 'precious',
    password: 'preciousefe',
    database: 'quizfun'

});

// Create a connection pool to MySQL
const pool = mysql.createPool({
    host: 'localhost', // or your database host
    user: 'precious',      // your MySQL username
    password: 'preciousefe',      // your MySQL password
    database: 'quizfun', // name of your MySQL database
  });

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
    var sql = 'CREATE TABLE users ( id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, scores JSON DEFAULT NULL);';
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log('Table created')
    })
});

module.exports = con;
module.exports = pool.promise(); // Use promise-based queries
