const db = require('../config/database')

class Model_Pic{
    static async getJadwal(){
        try{
            const [result] = await db.query(`SELECT CONCAT(jadwal.tanggal_mulai, ' s.d. ', jadwal.tanggal_selesai) AS periode, GROUP_CONCAT(peserta_magang.nama ORDER BY peserta_magang.nama SEPARATOR '\n') AS daftar_nama, GROUP_CONCAT(peserta_magang.instansi ORDER BY peserta_magang.nama SEPARATOR '\n') AS daftar_instansi
            FROM jadwal LEFT JOIN peserta_magang ON jadwal.id_peserta_magang = peserta_magang.id_peserta_magang
            WHERE jadwal.bidang = 'ppk' GROUP BY jadwal.tanggal_mulai, jadwal.tanggal_selesai`)//bagian departemen mungkin nanti bisa dimasukan jwt
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getNilai(){
        try{
            const [result] = await db.query(`SELECT CONCAT(jadwal.tanggal_mulai, ' s.d. ', jadwal.tanggal_selesai) AS periode, GROUP_CONCAT(peserta_magang.nama ORDER BY peserta_magang.nama SEPARATOR '\n') AS daftar_nama, GROUP_CONCAT(peserta_magang.instansi ORDER BY peserta_magang.nama SEPARATOR '\n') AS daftar_instansi
            FROM jadwal LEFT JOIN peserta_magang ON jadwal.id_peserta_magang = peserta_magang.id_peserta_magang
            WHERE jadwal.bidang = 'ppk' GROUP BY jadwal.tanggal_mulai, jadwal.tanggal_selesai`)//bagian departemen mungkin nanti bisa dimasukan jwt
            return result
        }catch(error){
            throw(error)
        }
    }
}

module.exports = Model_Pic