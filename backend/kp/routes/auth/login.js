var express = require('express');
var router = express.Router();
const Model_Users = require('../../model/Model_User');
// const limiter = require('../../config/middleware/rateLimiter')

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email dan password tidak boleh kosong' });
    }
    try {
        const cekStatus = await Model_Users.getStatusPenerimaan(email)
        if(cekStatus.length > 0){
            const status_penerimaan = cekStatus[0].status_penerimaan
            if(status_penerimaan === "Dipending"){
                return res.status(400).json({message: "Admin Sedang Memproses Pendaftaran Anda"})
            }
            if(status_penerimaan === "Ditolak"){
                return res.status(400).json({message: "Anda Ditolak Magang"})
            }
            if(status_penerimaan === "Non-Aktif"){
                return res.status(400).json({message: "Periode Magang Anda Sudah Selesai"})
            }
        }
        const result = await Model_Users.login(email, password);
        res.status(result.status).json(result); 
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

module.exports = router;
