const mysql = require('mysql2/promise');
let db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mapta',
    waitForConnections: true,
})

const testConnection = async()=> {
    try {
        const connection = await db.getConnection();
        console.log('Terhubung dengan MySQL2');
        connection.release(); // jangan lupa release kembali ke pool
    } catch (error) {
        console.error('Error koneksi:', error);
    }
}
testConnection();

module.exports = db