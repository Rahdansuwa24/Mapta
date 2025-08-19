var express = require('express');
var router = express.Router();
const Model_Peserta = require('../../model/Model_Peserta');
const Model_User = require('../../model/Model_User');
const {upload, hapusFiles} = require('../../config/middleware/multer')

//router untuk pendaftaran peserta magang
router.post('/register', upload.fields([
    { name: 'foto_diri', maxCount: 1 },
    { name: 'dokumen_pendukung', maxCount: 4 }
]), async (req, res) => {
    try {
        const { kategori, users, nama, nomor_identitas, instansi, tanggal_mulai_magang, tanggal_selesai_magang, jenjang, email, password } = req.body;
        const user_level = 'siswa';
        const validatePass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        // Validasi file upload
        if (!req.files || !req.files['foto_diri'] || req.files['foto_diri'].length === 0) {
            hapusFiles(req.files);
            return res.status(400).json({ status: false, message: "Foto diri wajib diunggah" });
        }
        if (!req.files['dokumen_pendukung'] || req.files['dokumen_pendukung'].length === 0) {
            hapusFiles(req.files);
            return res.status(400).json({ status: false, message: "Dokumen pendukung wajib diunggah" });
        }

        const fotoFile = req.files['foto_diri'][0];
        if (!fotoFile.mimetype.startsWith('image/')) {
            hapusFiles(req.files);
            return res.status(400).json({ status: false, message: "Foto diri harus berupa file gambar" });
        }
        for (const doc of req.files['dokumen_pendukung']) {
            if (!doc.mimetype.startsWith('application/')) {
                hapusFiles(req.files);
                return res.status(400).json({ status: false, message: "Dokumen pendukung harus PDF atau DOC/DOCX" });
            }
        }

        if (Array.isArray(users) && users.length > 0) {
            for (const user of users) {
                if (!user.email || !user.password || !user.nama || !user.nomor_identitas || !user.instansi || !user.tanggal_mulai_magang || !user.tanggal_selesai_magang || !user.jenjang) {
                    hapusFiles(req.files);
                    return res.status(400).json({ message: 'Pastikan semua data anggota sudah diisi' });
                }
                if (!validatePass.test(user.password)) {
                    hapusFiles(req.files);
                    return res.status(400).json({
                        status: false,
                        message: 'Password harus mengandung minimal 1 huruf besar, 1 angka, dan panjang minimal 8 karakter'
                    });
                }
                const existingUser = await Model_User.getEmail(user.email);
                if (existingUser && existingUser.length > 0) {
                    hapusFiles(req.files);
                    return res.status(400).json({ message: `Email ${user.email} sudah digunakan, ganti email lain` });
                }
            }

            const insertedUsers = [];
            try {
                for (const user of users) {
                    const akunPeserta = await Model_User.registerAkun(user.email, user.password, user_level);
                    const idAkun = akunPeserta.insertId;

                    const pesertaData = {
                        nama: user.nama,
                        nomor_identitas: user.nomor_identitas,
                        foto_diri: req.files['foto_diri'][0].filename,
                        instansi: user.instansi,
                        tanggal_mulai_magang: user.tanggal_mulai_magang,
                        tanggal_selesai_magang: user.tanggal_selesai_magang,
                        kategori: kategori || 'kelompok',
                        dokumen_pendukung: JSON.stringify(req.files['dokumen_pendukung'].map(file => file.filename)),
                        jenjang: user.jenjang,
                        id_users: idAkun
                    };
                    await Model_Peserta.registerUser(pesertaData);
                    insertedUsers.push(user.nama);
                }
                return res.status(201).json({ message: 'Registrasi kelompok berhasil', data: insertedUsers });
            } catch (dbError) {
                hapusFiles(req.files);
                return res.status(500).json({ message: 'Gagal registrasi kelompok', error: dbError.message });
            }
        }

        if (!email || !password || !nama || !nomor_identitas || !instansi || !tanggal_mulai_magang || !tanggal_selesai_magang || !jenjang) {
            hapusFiles(req.files);
            return res.status(400).json({ message: 'Pastikan semua data sudah diisi' });
        }
        if (!validatePass.test(password)) {
            hapusFiles(req.files);
            return res.status(400).json({
                status: false,
                message: 'Password harus mengandung minimal 1 huruf besar, 1 angka, dan panjang minimal 8 karakter'
            });
        }

        const existingUserIndividu = await Model_User.getEmail(email);
        if (existingUserIndividu && existingUserIndividu.length > 0) {
            hapusFiles(req.files);
            return res.status(400).json({ message: "Gunakan email lain, email sudah ada yang sama" });
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
        hapusFiles(req.files);
        return res.status(500).json({ message: 'Terjadi kesalahan', error: err.stack });
    }
});


//router getlAll data
router.get('/', async (req, res) => {
    try {
        const data = await Model_User.getAllWithUsers();
        console.log(data)
        res.json({ status: true, data });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
});


module.exports = router;
