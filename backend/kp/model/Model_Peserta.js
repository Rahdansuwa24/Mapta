const db = require('../config/database')

class Model_Peserta{
    static async registerUser(data) {
            try {
                const [result] = await db.query(
                    'INSERT INTO peserta_magang (nama, nomor_identitas, foto_diri, instansi, tanggal_mulai_magang, tanggal_selesai_magang, kategori, dokumen_pendukung, jenjang, id_users, id_kelompok) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [data.nama, data.nomor_identitas, data.foto_diri, data.instansi, data.tanggal_mulai_magang, data.tanggal_selesai_magang, data.kategori, data.dokumen_pendukung, data.jenjang, data.id_users, data.id_kelompok]);
                    return result
            } catch (error) {
                throw(error);
            }
    }
    static async registerTabelKelompok(data) {
            try {
                const [result] = await db.query('insert into kelompok set ?', [data]);
                return result
            } catch (error) {
                throw(error);
            }
    }
    static async countPeserta() {
            try {
                const [result] = await db.query(`select count(id_peserta_magang) as total from peserta_magang`);
                return result[0].total
            } catch (error) {
                throw(error);
            }
    }
}

module.exports = Model_Peserta