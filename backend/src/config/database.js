const path = require('path');
const mysql = require('mysql2');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

const testConnection = async () => {
    try {
        await promisePool.query('SELECT 1 + 1 AS result');
        console.log('Cloud database connected successfully');
        console.log(`Connected to: ${process.env.DB_HOST}`);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.error('Check your backend/.env file for correct credentials');
        return false;
    }
};

module.exports = { pool: promisePool, testConnection };
