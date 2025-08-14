var express = require('express');
var router = express.Router();
const Model_Peserta = require('../../model/Model_Peserta');
const Model_User = require('../../model/Model_User');

router.post('/', async (req, res) => {
    const user_level = 'siswa'
    const { nama, nomor_identitas, foto_diri, instansi, tanggal_mulai_magang, tanggal_selesai_magang, kategori, dokumen_pendukung, jenjang, email, password } = req.body;
    console.log(req.body)

    if (!email || !password || !nama || ! nomor_identitas || !foto_diri || !instansi || !tanggal_mulai_magang || !tanggal_selesai_magang || !kategori || !dokumen_pendukung || !jenjang) {
    return res.status(400).json({ message: 'Pastikan semua data sudah diisi' });
    }

    try {
        const akunPeserta = await Model_User.registerAkun(email, password, user_level)
        const idAkun = akunPeserta.insertId
        console.log(idAkun)
        const pesertaData = {
            nama,
            nomor_identitas,
            foto_diri,
            instansi,
            tanggal_mulai_magang,
            tanggal_selesai_magang,
            kategori,
            dokumen_pendukung,
            jenjang,
            id_users: idAkun
        };
        await Model_Peserta.registerUser(pesertaData);
        res.status(201).json({ message: 'Registrasi berhasil' });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: err });
    }
});

module.exports = router;
