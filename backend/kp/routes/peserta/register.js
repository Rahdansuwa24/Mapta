var express = require('express');
var router = express.Router();
const Model_Peserta = require('../../model/Model_Peserta');
const Model_Admin = require('../../model/Model_Admin');
const Model_User = require('../../model/Model_User');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const  limiter = require("../../config/middleware/rateLimiter")
const {pushNotifikasi} = require('../../config/middleware/pushNotifikasi')
const {upload, hapusFiles, file} = require('../../config/middleware/multer')

//router untuk pendaftaran peserta magang
router.post('/register', upload.any(), async (req, res) => {
    try {
        const { kategori } = req.body;
        console.log(kategori)
        const user_level = 'siswa';
        const validatePass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        const now = new Date();
        const tanggal_daftar = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        if (kategori === 'kelompok') {
                const parsingUser = [];
                if (!req.body.users || !Array.isArray(req.body.users) || req.body.users.length === 0) {
                    hapusFiles(req.files);
                    return res.status(400).json({ message: 'Data anggota kelompok kosong' });
                }
                for (let i = 0; i < req.body.users.length; i++) {
                    const user = req.body.users[i];
                    if (!user.email || !user.password || !user.nama || !user.instansi ||
                        !user.nomor_identitas || !user.tanggal_mulai_magang ||
                        !user.tanggal_selesai_magang || !user.jenjang || !user.no_whatsapp || !user.jabatan) {
                        hapusFiles(req.files);
                        return res.status(400).json({ message: `Pastikan semua data anggota ${i + 1} sudah diisi` });
                    }

                    if (!validatePass.test(user.password)) {
                        hapusFiles(req.files);
                        return res.status(400).json({ message: `Password anggota ${parseInt(i) + 1} harus mengandung minimal 1 huruf besar, 1 angka, dan panjang minimal 8 karakter` });
                    }

                    const fotoUser = req.files.find(f => f.fieldname === `foto_diri_${i}`);
                    const dokumenUser = req.files.filter(f => f.fieldname === `dokumen_pendukung_${i}`);

                    if (!fotoUser) {
                        hapusFiles(req.files);
                        return res.status(400).json({ message: `Foto diri untuk anggota ${parseInt(i) + 1} wajib diunggah` });
                    }

                    if (dokumenUser.length === 0) {
                        hapusFiles(req.files);
                        return res.status(400).json({ message: `Dokumen pendukung untuk anggota ${parseInt(i) + 1} wajib diunggah` });
                    }

                    const existingUser = await Model_User.getEmail(user.email);
                    if (existingUser && existingUser.length > 0) {
                        hapusFiles(req.files);
                        return res.status(400).json({ message: `Email ${user.email} sudah digunakan, ganti email lain` });
                    }

                    parsingUser.push({
                        ...user,
                        foto_diri: fotoUser.filename,
                        dokumen_pendukung: dokumenUser.map(f => f.filename)
                    });
                } 
                const totalSiswa = await Model_Peserta.countPeserta();
                const kuotaDinamis = await Model_Admin.maksimalPeserta()
                const kuota = kuotaDinamis[0].total
                const sisaKuota = kuota - totalSiswa;
                const jumlahAnggota = parsingUser.length
                if (sisaKuota < jumlahAnggota) {
                    hapusFiles(req.files);
                    return res.status(400).json({message: `Kuota tersisa ${sisaKuota} peserta saja. Kurangi jumlah anggota kelompok.`});
                }
                const kelompok = await Model_Peserta.registerTabelKelompok({tanggal_daftar});
                const idKelompok = kelompok.insertId;
                const insertedUserNames = [];
                for (const user of parsingUser) {
                    const akunPeserta = await Model_User.registerAkun(user.email, user.password, user_level);
                    const idAkun = akunPeserta.insertId;
                    const pesertaData = {
                        nama: user.nama,
                        nomor_identitas: user.nomor_identitas,
                        foto_diri: user.foto_diri,
                        instansi: user.instansi,
                        tanggal_mulai_magang: user.tanggal_mulai_magang,
                        tanggal_selesai_magang: user.tanggal_selesai_magang,
                        kategori: 'kelompok',
                        dokumen_pendukung: JSON.stringify(user.dokumen_pendukung),
                        jenjang: user.jenjang,
                        no_whatsapp: user.no_whatsapp,
                        jabatan: user.jabatan,
                        id_users: idAkun,
                        id_kelompok: idKelompok
                    };
                    await Model_Peserta.registerUser(pesertaData);
                    insertedUserNames.push(user.nama);
                }
                const namaInstansi = parsingUser[0].instansi;
                await pushNotifikasi({
                    title: 'Pendaftaran Kelompok Baru',
                    pesan: `${insertedUserNames.join(', ')} dari ${namaInstansi}.`,
                    tanggal: tanggal_daftar,
                    kategori: 'kelompok'
                })
                return res.status(201).json({ message: 'Registrasi kelompok berhasil', data: insertedUserNames });
        }
        
        // Handle pendaftaran individu
        const { nama, nomor_identitas, instansi, tanggal_mulai_magang, tanggal_selesai_magang, jenjang, email, password, no_whatsapp, jabatan } = req.body;
        
        const fotoIndividu = req.files.find(f => f.fieldname === 'foto_diri');
        const dokumenPendukungIndividu = req.files.filter(f => f.fieldname === 'dokumen_pendukung');
        if (!fotoIndividu) {
            hapusFiles(req.files);
            return res.status(400).json({ message: "Foto diri wajib diunggah" });
        }
        if (dokumenPendukungIndividu.length === 0) {
            hapusFiles(req.files);
            return res.status(400).json({ message: "Dokumen pendukung wajib diunggah" });
        }
        if (!email || !password || !nama || !nomor_identitas || !instansi || !tanggal_mulai_magang || !tanggal_selesai_magang || !jenjang || !no_whatsapp || !jabatan) {
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

        const totalSiswa = await Model_Peserta.countPeserta();
        const kuotaDinamis = await Model_Admin.maksimalPeserta()
        const kuota = kuotaDinamis[0].total
        const sisaKuota = kuota - totalSiswa;
        if (sisaKuota < 1) {
            hapusFiles(req.files);
            return res.status(400).json({
                status: false,
                message: `Kuota tersisa ${sisaKuota} peserta saja. Tidak bisa mendaftar.`
            });
        }
        
        const akunPeserta = await Model_User.registerAkun(email, password, user_level);
        const idAkun = akunPeserta.insertId;

        const pesertaData = {
            nama,
            nomor_identitas,
            foto_diri: fotoIndividu.filename,
            instansi,
            tanggal_mulai_magang,
            tanggal_selesai_magang,
            kategori: 'individu',
            dokumen_pendukung: JSON.stringify(dokumenPendukungIndividu.map(f => f.filename)),
            jenjang,
            no_whatsapp,
            jabatan,
            id_users: idAkun,
        };

        await Model_Peserta.registerUser(pesertaData);
        await pushNotifikasi({
            title: 'Pendaftaran Individu Baru',
            pesan: `${nama} dari ${instansi}`,
            tanggal: tanggal_daftar,
            kategori: 'individu'
        })
        return res.status(201).json({ message: 'Registrasi individu berhasil' });

    } catch (err) {
        hapusFiles(req.files);
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
    }
});

router.post('/register-dinas', upload.any(), async (req, res) => {
    try {
        const validatePass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        const user_level = 'siswa';
        const now = new Date();
        const tanggal_daftar = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const { nama, nomor_identitas, instansi, tanggal_mulai_magang, tanggal_selesai_magang, jenjang, email, password } = req.body;
        
        const fotoIndividu = req.files.find(f => f.fieldname === 'foto_diri');
        const dokumenPendukungIndividu = req.files.filter(f => f.fieldname === 'dokumen_pendukung');
        if (!fotoIndividu) {
            hapusFiles(req.files);
            return res.status(400).json({ message: "Foto diri wajib diunggah" });
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

        const totalSiswa = await Model_Peserta.countPeserta();
        const kuotaDinamis = await Model_Admin.maksimalPeserta()
        const kuota = kuotaDinamis[0].total
        const sisaKuota = kuota - totalSiswa;
        if (sisaKuota < 1) {
            hapusFiles(req.files);
            return res.status(400).json({
                status: false,
                message: `Kuota tersisa ${sisaKuota} peserta saja. Tidak bisa mendaftar.`
            });
        }
        
        const akunPeserta = await Model_User.registerAkun(email, password, user_level);
        const idAkun = akunPeserta.insertId;

        const pesertaData = {
            nama,
            nomor_identitas,
            foto_diri: fotoIndividu.filename,
            instansi,
            tanggal_mulai_magang,
            tanggal_selesai_magang,
            kategori: 'individu',
            dokumen_pendukung: JSON.stringify(dokumenPendukungIndividu.map(f => f.filename)),
            jenjang,
            id_users: idAkun,
        };

        await Model_Peserta.registerUser(pesertaData);
        await pushNotifikasi({
            title: 'Pendaftaran Dinas Baru',
            pesan: `${nama} dari ${instansi}`,
            tanggal: tanggal_daftar,
            kategori: 'individu'
        })
        return res.status(201).json({ message: 'Registrasi dinas berhasil' });

    } catch (err) {
        hapusFiles(req.files);
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
    }
});

//router getlAll data
router.get('/', async (req, res) => {
    try {
        const data = await Model_User.getAllWithUsers();
        res.json(data);
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
});

router.get('/kuota', async (req, res) => {
    try {
        const totalSiswa = await Model_Peserta.countPeserta();
        const kuotaDinamis = await Model_Admin.maksimalPeserta()
        const kuota = kuotaDinamis[0].total
        let sisaKuota = kuota - totalSiswa;
        if(sisaKuota <= 0) sisaKuota = 0
        return res.status(200).json({ sisaKuota });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Gagal mengambil kuota', error: err.message });
    }
});

router.patch('/update-password', limiter,async(req, res)=>{
    try{
        let {email} = req.body
        let setEmail = await Model_User.getEmailForResetPasssword(email)
        if(setEmail.length===0){
            return res.status(400).json({message: 'Akun anda tidak terdaftar atau belum disetujui oleh admin, silahkan registrasi atau hubungi admin'})
        }
        const newPassword = crypto.randomBytes(5).toString('base64');
        await Model_User.resetPassword(newPassword, email)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
        const mailOptions = {
            from: `"MAPTA Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Password — MAPTA',
            text: `Halo,\n\nPassword baru Anda adalah: ${newPassword}\n\nSilakan login dengan password anda yang baru.\n\nSalam,\nTim MAPTA`,
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({message: 'Password Berhasil Diperbarui, Silahkan Cek Email Anda'})
    }catch(error){
        console.error(error)
        if (error.status === 429) {
            return res.status(429).json({ message: error.message });
        }
        return res.status(500).json({message: 'terjadi kesalahan pada server'})
    }
})


module.exports = router;
