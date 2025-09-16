const db = require('../config/database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Model_User{
    static async login(email, password){
        try {
            const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

            if (results.length === 0) {
                return { status: 401, message: 'Email tidak ditemukan' };
            }

            const user = results[0];

            const cocok = await bcrypt.compare(password, user.password);
            if (!cocok) {
                return { status: 401, message: 'Password salah' };
            }
            const token = jwt.sign(
                {
                    id: user.id_users,
                    email: user.email,
                    user_level: user.user_level
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return { status: 200, token};

        }catch (err) {
            return { status: 500, message: 'Server error', error: err.message };
        }
    }

    static async registerAkun(email, password, user_level) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.query('insert into users(email, password, user_level) values (?, ?, ?)', [email, hashedPassword, user_level]);
            return result
        }catch (error) {
                throw(error);
            }
    }

    static async updateAkunPIC(id, email, password){
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.query(`update users set email = ?, password = ? where id_users = ?`, [email, hashedPassword, id])
            return result
        }catch(error){
            throw(error)
        }
    }

    static async getAllWithUsers() {
    const query = `SELECT u.id_users, u.email, u.user_level, p.id_peserta_magang, p.nama, p.nomor_identitas, p.instansi, p.foto_diri, p.dokumen_pendukung, p.tanggal_mulai_magang, p.tanggal_selesai_magang,p.jenjang, p.kategori FROM users AS u LEFT JOIN peserta_magang AS p ON u.id_users = p.id_users`;
        try {
            const [results] = await db.query(query);

            // Parse dokumen_pendukung jika ada
            const parsedResults = results.map(row => {
                if (row.dokumen_pendukung) {
                    try {
                        row.dokumen_pendukung = JSON.parse(row.dokumen_pendukung);
                    } catch (e) {
                        row.dokumen_pendukung = [];
                    }
                }
                return row;
            });

            return parsedResults;
        } catch (err) {
            throw err; // lempar error ke route
        }
    }

    static async getEmail(email){
        try{
            const [result] = await db.query('select * from users where email = ?', [email])
            return result
        }catch(err){
            throw err
        }
    }

}

module.exports = Model_User;