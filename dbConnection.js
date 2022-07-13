const mysql = require('mysql');
require('dotenv').config()

// SET UP ENV VARIABLES
// DB_HOST = localhost
// DB_PORT = 3306
// DB_USER = admin 
// DB_PASSWORD = admin
// DB_NAME = cbe_stocks
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = connection;