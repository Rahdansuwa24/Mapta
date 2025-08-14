const db = require('../config/database')

class Model_Peserta{
    static async registerUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                db.query(
                    'INSERT INTO peserta_magang (nama, nomor_identitas, foto_diri, instansi, tanggal_mulai_magang, tanggal_selesai_magang, kategori, dokumen_pendukung, jenjang, id_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [data.nama, data.nomor_identitas, data.foto_diri, data.instansi, data.tanggal_mulai_magang, data.tanggal_selesai_magang, data.kategori, data.dokumen_pendukung, data.jenjang, data.id_users],
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
}

module.exports = Model_Peserta