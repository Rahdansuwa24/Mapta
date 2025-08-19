var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')


router.get('/', async(req, res)=>{
    try{
        const data = await Model_Admin.getJadwal()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.post('/store', async(req, res)=>{
    try{
        let {bidang, id_peserta_magang, tanggal_mulai, tanggal_selesai} = req.body
        const data = {
            bidang,
            id_peserta_magang,
            tanggal_mulai, 
            tanggal_selesai
        }
        await Model_Admin.storeJadwal(data)
        res.status(200).json({message: 'penambahan berhasil'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.get('/(:id)', async(req, res)=>{
    try{
       let id = req.params.id
        let data = await Model_Admin.getJadwalById(id)
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.patch('/update/(:id)', async(req, res)=>{
    try{
        let id = req.params.id
        let {bidang, id_peserta_magang, tanggal_mulai, tanggal_selesai} = req.body
        let data = {
            bidang, id_peserta_magang, tanggal_mulai, tanggal_selesai
        }
        await Model_Admin.updateJadwal(id, data)
        res.status(200).json({message: 'data berhasil diperbarui'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.delete('/delete/(:id)', async(req, res)=>{
    try{
        let id = req.params.id
        await Model_Admin.deleteJadwal(id)
        res.status(200).json({message: 'data berhasil dihapus'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router