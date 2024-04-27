import mysql from "mysql";
import { config } from "dotenv";
config();

export const connection = mysql.createConnection({
    port: process.env.BD_PORT,
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_DATABASE
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + connection.threadId);
  });