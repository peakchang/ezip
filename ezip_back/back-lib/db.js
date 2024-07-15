import mysql, { } from "mysql2"
import dotenv from "dotenv"
dotenv.config();


export const sql_con = mysql.createConnection({
    host: process.env.HOST || '127.0.0.1',
    user: 'root',
    password: process.env.DBPWD,
    database: process.env.SHEMA,
    charset: 'utf8mb4'
})

// CREATE DATABASE findsales default CHARACTER SET UTF8;

/*

CREATE DATABASE ezip default CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS land(
    ld_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ld_name VARCHAR(255),
    ld_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    ld_location VARCHAR(100) NOT NULL,
    ld_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


*/