var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
const Model_User = require('../../model/Model_User');


router.get('/', async(req, res)=>{
    try{
        const data = await Model_Admin.getAspek()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/cek-sertif', async(req, res)=>{
    res.render("template/sertifikat")
})

router.post('/store', async(req, res)=>{
    try{
        let {aspek, subjek} = req.body
        const data = {
            aspek,
            subjek
        }
        await Model_Admin.storeAspek(data)
        res.status(200).json({message: 'penambahhan subjek berhasil'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.delete('/delete', async(req, res)=>{
    try{
        const {id} = req.body
        if(!id || id.length === 0) return res.status(400).json({message: 'tidak ada data yang dipilih'})
        const result = await Model_Admin.deleteAspek(id)
        res.status(200).json({ message: `${result.affectedRows} Aspek berhasil dihapus` })
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router