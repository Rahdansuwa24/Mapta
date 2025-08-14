var express = require('express');
var router = express.Router();
const Model_Peserta = require('../../model/Model_Peserta');
const Model_User = require('../../model/Model_User');
const {fs, upload} = require('../../config/middleware/multer')

//router untuk pendaftaran peserta magang
router.post('/register', upload.fields([{name: 'foto_diri', maxCount: 1}, {name: 'dokumen_pendukung', maxCount: 4}]),async (req, res) => {
    try {
        const { kategori, users, nama, nomor_identitas, instansi, tanggal_mulai_magang, tanggal_selesai_magang, jenjang, email, password, foto_diri, dokumen_pendukung } = req.body;
        const user_level = 'siswa';
        console.log("File:", req.files);

        //logika untuk multiple upload
        if (!req.files || !req.files['foto_diri'] || req.files['foto_diri'].length === 0) {
        return res.status(400).json({ status: false, message: "Foto diri wajib diunggah" });
        }//cek jika menggunakan fields, bukan req.file tapi req.files

        if (!req.files['dokumen_pendukung'] || req.files['dokumen_pendukung'].length === 0) {
        return res.status(400).json({ status: false, message: "Dokumen pendukung wajib diunggah" });
        }
        if (Array.isArray(users) && users.length > 0) {
            const insertedUsers = [];
            for (const user of users) {
                if (!user.email || !user.password || !user.nama || !user.nomor_identitas || !req.files['foto_diri'] || !user.instansi || !user.tanggal_mulai_magang || !user.tanggal_selesai_magang || !req.files['dokumen_pendukung'] || !user.jenjang) {
                    return res.status(400).json({ message: 'Pastikan semua data sudah diisi' });
                }
                const akunPeserta = await Model_User.registerAkun(user.email, user.password, user_level);
                const idAkun = akunPeserta.insertId;

                const pesertaData = {
                    nama: user.nama,
                    nomor_identitas: user.nomor_identitas,
                    foto_diri: req.files['foto_diri'][0].filename, //cara jika menggunakan fields
                    instansi: user.instansi,
                    tanggal_mulai_magang: user.tanggal_mulai_magang,
                    tanggal_selesai_magang: user.tanggal_selesai_magang,
                    kategori: kategori || 'kelompok',
                    dokumen_pendukung: JSON.stringify(req.files['dokumen_pendukung'].map(file => file.filename)), //cara jika menggunakan fields
                    jenjang: user.jenjang,
                    id_users: idAkun
                };
                await Model_Peserta.registerUser(pesertaData);
                insertedUsers.push(user.nama);
            }
            return res.status(201).json({ message: 'Registrasi kelompok berhasil', data: insertedUsers });
        }

        // logika untuk upload single 
        if (!email || !password || !nama || !nomor_identitas || !req.files['foto_diri'] || !instansi || !tanggal_mulai_magang || !tanggal_selesai_magang || !req.files['dokumen_pendukung'] || !jenjang) {
            return res.status(400).json({ message: 'Pastikan semua data sudah diisi' });
        }

        const akunPeserta = await Model_User.registerAkun(email, password, user_level);
        const idAkun = akunPeserta.insertId;

        const pesertaData = {
            nama,
            nomor_identitas,
            foto_diri: req.files['foto_diri'][0].filename,
            instansi,
            tanggal_mulai_magang,
            tanggal_selesai_magang,
            kategori: kategori || 'individu',
            dokumen_pendukung: JSON.stringify(req.files['dokumen_pendukung'].map(file => file.filename)),
            jenjang,
            id_users: idAkun
        };
        await Model_Peserta.registerUser(pesertaData);

        return res.status(201).json({ message: 'Registrasi individu berhasil' });

    } catch (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan', error: err.stack });
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await Model_User.getAllWithUsers();
        res.json({ status: true, data });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
});


module.exports = router;
