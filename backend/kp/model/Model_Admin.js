const db = require('../config/database')

class Model_Admin{

    static async getDataCalonPeserta(){
        try{
            const [result] = await db.query(`SELECT distinct u.*, p.* FROM users u LEFT JOIN peserta_magang p ON u.id_users = p.id_users where p.status_penerimaan = 'dipending' ORDER BY p.instansi, p.kategori`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async maksimalPeserta(){
        try{
            const [result] = await db.query(`select total from total`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updateMaksimalPeserta(data){
        try{
            const [result] = await db.query(`update total set ? where id_total = 1`, [data])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataCalonPesertaDiterima(){
        try{
            const [result] = await db.query(`SELECT distinct u.*, p.*, k.id_kelompok FROM users u LEFT JOIN peserta_magang p ON u.id_users = p.id_users
            left join kelompok k on k.id_kelompok = p.id_kelompok where p.status_penerimaan = 'diterima' ORDER BY p.instansi, p.kategori, p.id_kelompok`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataCalonPesertaDitolak(){
        try{
            const [result] = await db.query(`SELECT distinct u.*, p.*, k.id_kelompok FROM users u LEFT JOIN peserta_magang p ON u.id_users = p.id_users
            left join kelompok k on k.id_kelompok = p.id_kelompok where p.status_penerimaan = 'ditolak' ORDER BY p.instansi, p.kategori, p.id_kelompok`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async deleteDataCalonPesertaDitolak(id){
        try{
            const [result] = await db.query(`delete from users where id_users = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataCalonPesertaById(id){
        try{
            const [result] = await db.query(`SELECT distinct u.*, p.* FROM users u LEFT JOIN peserta_magang p ON u.id_users = p.id_users where p.status_penerimaan = 'dipending' and p.id_peserta_magang  =  ? ORDER BY p.instansi, p.kategori`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataCalonPesertaByIdWithoutStatus(id){
        try{
            const [result] = await db.query(`SELECT distinct u.*, p.* FROM users u LEFT JOIN peserta_magang p ON u.id_users = p.id_users where p.id_peserta_magang = ? ORDER BY p.instansi, p.kategori`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataCalonPesertaDiterimaById(id){
        try{
            const [result] = await db.query(`SELECT distinct u.*, p.* FROM users u LEFT JOIN peserta_magang p ON u.id_users = p.id_users where p.status_penerimaan = 'diterima' and p.id_peserta_magang  =  ? ORDER BY p.instansi, p.kategori`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataCalonPesertaDitolakById(id){
        try{
            const [result] = await db.query(`SELECT distinct u.*, p.* FROM users u LEFT JOIN peserta_magang p ON u.id_users = p.id_users where p.status_penerimaan = 'ditolak' and p.id_users  =  ? ORDER BY p.instansi, p.kategori`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updateStatus(id, status_penerimaan){
        try{
            const [result] = await db.query(`update peserta_magang set ? where id_peserta_magang = ?`, [status_penerimaan, id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updateSuratBalasan(id, surat_balasan){
        try{
            const [result] = await db.query(`update peserta_magang set ? where id_peserta_magang = ?`, [surat_balasan, id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getJadwal(){
        try{
            const [result] = await db.query(`SELECT p.id_peserta_magang, p.nama, p.instansi, p.tanggal_mulai_magang, p.tanggal_selesai_magang, j.* FROM peserta_magang p LEFT JOIN jadwal j ON p.id_peserta_magang = j.id_peserta_magang where j.id_jadwal is not null ORDER BY p.instansi, p.kategori`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getPeriode(){
        try{
            const [result] = await db.query(`SELECT MIN(tanggal_mulai_magang) AS tanggal_mulai_keseluruhan, MAX(tanggal_selesai_magang) AS tanggal_selesai_keseluruhan FROM peserta_magang;`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataPesertaDiterimaJadwal(){
        try{
            const [result] = await db.query(`select id_peserta_magang, instansi, nama, tanggal_mulai_magang, tanggal_selesai_magang from peserta_magang where status_penerimaan = 'diterima' order by instansi`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getJadwalById(id){
        try{
            const [result] = await db.query(`SELECT p.id_peserta_magang, p.nama, p.instansi, p.tanggal_mulai_magang, p.tanggal_selesai_magang, j.* FROM peserta_magang p LEFT JOIN jadwal j ON p.id_peserta_magang = j.id_peserta_magang where j.id_jadwal = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async storeJadwal(data){
        try{
            const [result] = await db.query(`insert into jadwal set ?`, [data])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updateJadwal(id, data){
        try{
            const [result] = await db.query(`update jadwal set ? where id_jadwal = ?`, [data, id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async deleteJadwal(id){
        try{
            const [result] = await db.query(`delete from jadwal where id_jadwal = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getPIC(){
        try{
            const [result] = await db.query(`SELECT p.bidang, p.id_pic, u.id_users, u.email, u.user_level from pic p left join users u on p.id_users = u.id_users`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getPICById(id){
        try{
            const [result] = await db.query(`select * from pic where id_pic = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getIdUsersForPIC(id){
        try{
            const [result] = await db.query(`select  pic.*, users.email, users.password from pic left join users on pic.id_users = users.id_users where pic.id_pic = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async storePIC(data){
        try{
            const [result] = await db.query(`insert into pic set ?`, [data])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updatePIC(id, data){
        try{
            const [result] = await db.query(`update pic set ? where id_pic = ?`, [data, id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async deletePIC(id){
        try{
            const [result] = await db.query(`delete from users where id_users = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getAspek(){
        try{
            const [result] = await db.query(`select * from aspek`)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getAspekById(id){
        try{
            const [result] = await db.query(`select * from aspek where id_aspek = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }

static async storeAspek(data){
        try{
            const [result] = await db.query(`insert into aspek set ?`, [data])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updateAspek(id, data){
        try{
            const [result] = await db.query(`update aspek set ? where id_aspek = ?`, [data, id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async deleteAspek(ids){
        try{
            const placeHolder = ids.map(()=>'?').join(',')
            const [result] = await db.query(`delete from aspek where id_aspek in (${placeHolder})`, ids)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getNilai(){
        try{
            const [result] = await db.query(`SELECT pe.id_peserta_magang, pe.nama, pe.instansi, pe.foto_diri,

            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' 
                      THEN p.id_penilaian END SEPARATOR ', ') AS id_penilaian_teknis,
            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis'
                            THEN a.id_aspek END SEPARATOR ', ') AS id_aspek_teknis,
            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis' 
                            THEN a.subjek END SEPARATOR ', ') AS aspek_teknis,
            GROUP_CONCAT(CASE WHEN a.aspek = 'teknis'
                            THEN p.penilaian END SEPARATOR ', ') AS nilai_teknis,

            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis'
                            THEN p.id_penilaian END SEPARATOR ', ') AS id_penilaian_non_teknis, 
            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis'
                            THEN a.subjek END SEPARATOR ', ') AS aspek_non_teknis,
            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis'
                            THEN p.penilaian END SEPARATOR ', ') AS nilai_non_teknis, 
            GROUP_CONCAT(CASE WHEN a.aspek = 'non-teknis'
                            THEN a.id_aspek END SEPARATOR ', ') AS id_aspek_non_teknis
            FROM peserta_magang AS pe
            LEFT JOIN penilaian AS p ON pe.id_peserta_magang = p.id_peserta_magang
            LEFT JOIN aspek AS a ON p.id_aspek = a.id_aspek
            GROUP BY pe.id_peserta_magang, pe.nama, pe.instansi, pe.foto_diri
            HAVING COUNT(p.id_penilaian) > 0;
            `)
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
    static async deleteNilai(id, penilaian){
        try{
            const [result] = await db.query('update penilaian set ? where id_penilaian = ?', [penilaian, id])
            return result
        }catch(err){
            throw err
        }
    }
    static async getDataDasborSertif(){
        try{
            const [result] = await db.query(`SELECT p.id_peserta_magang, p.nama, p.nomor_identitas, p.foto_diri, p.instansi, p.tanggal_mulai_magang, p.tanggal_selesai_magang, p.status_penerimaan, p.sertifikat,
            GROUP_CONCAT(CASE WHEN pe.penilaian IS NOT NULL THEN a.aspek END ORDER BY a.aspek SEPARATOR ', ') AS aspek_list,
            GROUP_CONCAT(CASE WHEN pe.penilaian IS NOT NULL THEN a.subjek END ORDER BY a.aspek SEPARATOR ', ') AS subjek_list,
            GROUP_CONCAT(CASE WHEN pe.penilaian IS NOT NULL THEN pe.penilaian END ORDER BY a.aspek SEPARATOR ', ') AS penilaian_list
            FROM peserta_magang p
            LEFT JOIN penilaian pe 
            ON p.id_peserta_magang = pe.id_peserta_magang
            LEFT JOIN aspek a 
            ON a.id_aspek = pe.id_aspek
            WHERE p.status_penerimaan = 'selesai'
            GROUP BY p.id_peserta_magang, p.nama, p.nomor_identitas, p.foto_diri, p.instansi, p.tanggal_mulai_magang, p.tanggal_selesai_magang, p.status_penerimaan;
            `)
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDownloadSertif(id){
        try{
            const [result] = await db.query(`SELECT p.id_peserta_magang, p.nama, p.nomor_identitas, p.foto_diri, p.instansi, p.tanggal_mulai_magang, p.tanggal_selesai_magang, p.status_penerimaan, p.sertifikat,
            GROUP_CONCAT(CASE WHEN pe.penilaian IS NOT NULL THEN a.aspek END ORDER BY a.aspek SEPARATOR ', ') AS aspek_list,
            GROUP_CONCAT(CASE WHEN pe.penilaian IS NOT NULL THEN a.subjek END ORDER BY a.aspek SEPARATOR ', ') AS subjek_list,
            GROUP_CONCAT(CASE WHEN pe.penilaian IS NOT NULL THEN pe.penilaian END ORDER BY a.aspek SEPARATOR ', ') AS penilaian_list
            FROM peserta_magang p
            LEFT JOIN penilaian pe 
            ON p.id_peserta_magang = pe.id_peserta_magang
            LEFT JOIN aspek a 
            ON a.id_aspek = pe.id_aspek
            WHERE p.status_penerimaan = 'selesai' and p.id_peserta_magang = ?
            GROUP BY p.id_peserta_magang, p.nama, p.nomor_identitas, p.foto_diri, p.instansi, p.tanggal_mulai_magang, p.tanggal_selesai_magang, p.status_penerimaan;
            `, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async getDataDasborSertifById(id){
        try{
            const [result] = await db.query(`select sertifikat from peserta_magang where id_peserta_magang = ?`, [id])
            return result
        }catch(error){
            throw(error)
        }
    }
    static async updateSertif(id, sertifikat){
        try{
            const [result] = await db.query(`update peserta_magang set ? where id_peserta_magang = ?`, [sertifikat, id])
            return result
        }catch(error){
            throw(error)
        }
    }

}
module.exports = Model_Admin