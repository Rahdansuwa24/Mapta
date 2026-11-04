const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mapta',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log(`Terhubung dengan MySQL2 [Database: ${process.env.DB_NAME || 'mapta'}]`);
        connection.release(); 
    } catch (error) {
        console.error('Error koneksi database:', error.message);
    }
};

testConnection();

module.exports = db;
