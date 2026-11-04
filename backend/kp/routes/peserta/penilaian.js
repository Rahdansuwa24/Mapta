var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Peserta = require('../../model/Model_Peserta')


router.get('/', verifyToken('siswa'),async(req, res)=>{
    try{
        let id_users = req.user.id
        const data = await Model_Peserta.getNilaiPeserta(id_users)
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router