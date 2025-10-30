const cron = require('node-cron')
const dayjs = require('dayjs')
const db = require('../config/database')

async function scheduler() {
    try{
        const sekarang = dayjs()
        const [rowsDiterima] = await db.query(`select id_peserta_magang, nama, tanggal_mulai_magang, tanggal_selesai_magang, status_penerimaan from peserta_magang where status_penerimaan = 'Diterima'`)
        for(const row of rowsDiterima){
            if(dayjs(row.tanggal_selesai_magang).isBefore(sekarang) || dayjs(row.tanggal_selesai_magang).isSame(sekarang)){
                await db.query(`UPDATE peserta_magang SET status_penerimaan = 'Selesai' WHERE id_peserta_magang = ?`, [row.id_peserta_magang])
                console.log(`Peserta ${row.nama} (ID: ${row.id_peserta_magang}) status diubah menjadi selesai.`);
            }
        }
        const [rowsSelesai] = await db.query(`select id_peserta_magang, nama, tanggal_mulai_magang, tanggal_selesai_magang, status_penerimaan from peserta_magang where status_penerimaan = 'Diterima'`)
        for(const row of rowsSelesai){
            const afterDay = dayjs(row.tanggal_selesai_magang).add(1, 'day')
            if(sekarang.isAfter(afterDay)){
                await db.query(`UPDATE peserta_magang SET status_penerimaan = 'Final' WHERE id_peserta_magang = ?`, [row.id_peserta_magang])
                console.log(`Peserta ${row.nama} (ID: ${row.id_peserta_magang}) status diubah menjadi Final.`);
            }
        }
        console.log("Pengecekan 2 Hari Sekali Selesai.");
    }catch(error){
        console.error("Terjadi kesalahan:", error.message);
    }
}

cron.schedule("0 10 */2 * *", scheduler)

module.exports = scheduler