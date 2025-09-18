var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
const Model_User = require('../../model/Model_User');


router.get('/', verifyToken('admin'),async(req, res)=>{
    try{
        const data = await Model_Admin.getAspek()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.post('/store', verifyToken('admin'),async(req, res)=>{
    try{
        let {aspek, subjek, bidang} = req.body
        const data = {
            aspek,
            subjek,
            bidang
        }
        await Model_Admin.storeAspek(data)
        res.status(200).json({message: 'penambahhan subjek berhasil'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.patch('/update/(:id)', verifyToken('admin'),async(req, res)=>{
    try{
        let id = req.params.id
        let {bidang, id_peserta_magang, tanggal_mulai, tanggal_selesai} = req.body
        let data = {
            bidang, id_peserta_magang, tanggal_mulai, tanggal_selesai
        }
        await Model_Admin.updateAspek(id, data)
        res.status(200).json({message: 'data berhasil diperbarui'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.delete('/delete', verifyToken('admin'),async(req, res)=>{
    try{
        console.log("BODY DELETE:", req.body)
        const {id_aspek} = req.body
        if(!id_aspek || id_aspek.length === 0) return res.status(400).json({message: 'tidak ada data yang dipilih'})
        const result = await Model_Admin.deleteAspek(id_aspek)
        res.status(200).json({ message: `${result.affectedRows} Aspek berhasil dihapus` })
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router