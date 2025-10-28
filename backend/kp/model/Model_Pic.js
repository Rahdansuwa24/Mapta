const db = require('../config/database')

class Model_Pic{
    static async getJadwal(id){
        try{
            const [result] = await db.query(`select j.tanggal_mulai, j.tanggal_selesai, j.bidang, p.nama, p.instansi, p.nomor_identitas, p.id_peserta_magang, p.id_kelompok, p.foto_diri from jadwal j left join peserta_magang p on j.id_peserta_magang = p.id_peserta_magang where j.bidang = (select bidang from pic where id_users = ?) order by j.tanggal_mulai`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getNilai(id){
        try{
            const [result] = await db.query(`SELECT pe.id_peserta_magang, pe.nama, pe.instansi, pe.foto_diri,
            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' AND p.id_pic = ? THEN COALESCE (p.id_penilaian, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS id_penilaian_teknis,

            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' AND p.id_pic = ? THEN COALESCE (p.id_aspek, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS id_aspek_teknis,

            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' AND p.id_pic = ? THEN COALESCE(a.subjek, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS aspek_teknis,

            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' AND p.id_pic = ? THEN COALESCE(p.penilaian, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS nilai_teknis,
                
            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' AND p.id_pic = ? THEN COALESCE(p.id_penilaian, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS id_penilaian_non_teknis,

            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' AND p.id_pic = ? THEN COALESCE(a.id_aspek, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS id_aspek_non_teknis,

            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' AND p.id_pic = ? THEN COALESCE(a.subjek, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS aspek_non_teknis,

            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis' AND p.id_pic = ? THEN COALESCE(p.penilaian, 'null') END ORDER BY a.id_aspek ASC SEPARATOR ', ') AS nilai_non_teknis

            FROM peserta_magang AS pe
            LEFT JOIN penilaian AS p ON pe.id_peserta_magang = p.id_peserta_magang
            LEFT JOIN aspek AS a ON p.id_aspek = a.id_aspek
            WHERE EXISTS (SELECT 1 FROM penilaian p_sub WHERE p_sub.id_peserta_magang = pe.id_peserta_magang AND p_sub.id_pic = ?
            )GROUP BY pe.id_peserta_magang, pe.nama, pe.instansi, pe.foto_diri;
            `,[id, id, id, id, id, id, id, id, id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async storeNilai(data){
        try{
            const [result] = await db.query(`insert into penilaian set ?`,[data])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataCalonPesertaDiterima(id_users){
        try{
            const [result] = await db.query(`select p.instansi, p.nama, p.foto_diri, p.id_peserta_magang, j.id_jadwal from peserta_magang p left join jadwal j on p.id_peserta_magang = j.id_peserta_magang where j.bidang = (select bidang from pic where id_users = ?)`, [id_users])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async aspek(id_users){
        try{
            const [result] = await db.query(`select aspek, bidang, id_aspek, subjek from aspek where bidang = (select bidang from pic where id_users = ?) or bidang = 'GLOBAL' ORDER BY id_aspek ASC`, [id_users])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updateNilai(id, penilaian){
        try{
            const [result] = await db.query('update penilaian set ? where id_penilaian = ?', [penilaian, id])
            return result
        }catch(err){
            throw err
        }
    }
    static async deleteNilai(id){
        try{
            const [result] = await db.query('delete from penilaian where id_penilaian = ?', [id])
            return result
        }catch(err){
            throw err
        }
    }
    static async getIdPIC(id){
        try{
            const [result] = await db.query('select id_pic from pic where id_users = ?', [id])
            return result
        }catch(err){
            throw err
        }
    }
}

module.exports = Model_Pic