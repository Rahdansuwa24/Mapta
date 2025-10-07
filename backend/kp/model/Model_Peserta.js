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
    static async updatePesertaMagang(id, data) {
            try {
                const [result] = await db.query(`update peserta_magang set ? where id_jadwal = ?`, [data, id]);
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
    static async getJadwalPeserta(id) {
            try {
                const [result] = await db.query(`select j.tanggal_mulai, j.tanggal_selesai, j.bidang, p.nama from jadwal j left join peserta_magang p on j.id_peserta_magang = p.id_peserta_magang where p.id_users = ?`, [id]);
                return result
            } catch (error) {
                throw(error);
            }
    }
    static async getSertifikatPeserta(id) {
            try {
                const [result] = await db.query(`select sertifikat from peserta_magang where id_users = ?`, [id]);
                return result
            } catch (error) {
                throw(error);
            }
    }
    static async getNilaiPeserta(id) {
            try {
                const [result] = await db.query(`SELECT pe.id_peserta_magang, pe.nama, pe.instansi, pe.foto_diri, pi.bidang,
                GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' THEN p.id_penilaian END SEPARATOR ', ') AS id_penilaian_teknis,
                GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' THEN a.id_aspek END SEPARATOR ', ') AS id_aspek_teknis,
                GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' THEN a.subjek END SEPARATOR ', ') AS aspek_teknis,
                GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' THEN p.penilaian END SEPARATOR ', ') AS nilai_teknis,
                GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' THEN p.id_penilaian END SEPARATOR ', ') AS id_penilaian_non_teknis,
                GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' THEN a.id_aspek END SEPARATOR ', ') AS id_aspek_non_teknis,
                GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' THEN a.subjek END SEPARATOR ', ') AS aspek_non_teknis,
                GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' THEN p.penilaian END SEPARATOR ', ') AS nilai_non_teknis

                FROM peserta_magang AS pe
                LEFT JOIN penilaian AS p ON pe.id_peserta_magang = p.id_peserta_magang
                LEFT JOIN aspek AS a ON p.id_aspek = a.id_aspek
                left join pic pi on pi.id_pic = p.id_pic
                WHERE pe.id_users = ?
                GROUP BY pe.id_peserta_magang, pe.nama, pe.instansi, pe.foto_diri, p.id_pic;
                `, [id]);
                return result
            } catch (error) {
                throw(error);
            }
    }
}

module.exports = Model_Peserta