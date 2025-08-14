const db = require('../config/database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Model_User{
    static async login(email, password){
        return new Promise((resolve, reject)=>{
            db.query('select * from users where email = ?', [email], async(err, results)=>{
                if(err) return reject({status: 500, message: 'server error', error: err})
                if(results.length === 0) return reject({ status: 401, message: 'Email tidak ditemukan' });

                const user = results[0]
                const cocok = await bcrypt.compare(password, user.password)
                if(!cocok) return reject({ status: 401, message: 'Password salah' });

                const token = jwt.sign(
                    {
                        id: user.id_users,
                        email: user.email
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: '1h'}
                )
                resolve({token})
            })
        })
    }

    static async registerAkun(email, password, user_level) {
        return new Promise(async (resolve, reject) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                db.query(
                    'INSERT INTO users (email, password, user_level) VALUES (?, ?, ?)',
                    [email, hashedPassword, user_level],
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

   static getAllWithUsers() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    u.id_users, u.email, u.user_level,
                    p.id_peserta_magang, p.nama, p.nomor_identitas, p.instansi, 
                    p.foto_diri, p.dokumen_pendukung, 
                    p.tanggal_mulai_magang, p.tanggal_selesai_magang, 
                    p.jenjang, p.kategori
                FROM users AS u
                LEFT JOIN peserta_magang AS p ON u.id_users = p.id_users
            `;

            db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }

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

                resolve(parsedResults);
            });
        });
    }
}

module.exports = Model_User;