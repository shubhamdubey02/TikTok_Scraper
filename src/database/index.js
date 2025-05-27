const mysql = require('mysql2');
require('dotenv').config();

const connectDB = () => {
  const cred = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  };
  console.log(cred)
  const connection = mysql.createConnection(cred);

  connection.connect(err => {
    if (err) {
      console.error('MySQL connection failed:', err.message);
    } else {
      console.log('Data connected to MySQL database');
    }
  });

  return connection;
};

module.exports = connectDB;
