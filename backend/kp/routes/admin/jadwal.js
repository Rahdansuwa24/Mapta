var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')


router.get('/', verifyToken('admin'),async(req, res)=>{
    try{
        const data = await Model_Admin.getJadwal()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/peserta', verifyToken('admin'),async(req, res)=>{
    try{
        const data = await Model_Admin.getDataCalonPesertaDiterima()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/getPeriode', verifyToken('admin'),async(req, res)=>{
    try{
        const data = await Model_Admin.getPeriode()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.post('/store', verifyToken('admin'),async(req, res)=>{
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
        console.error(err)
        res.status(500).json({ status: false, error: err.message });
    }
})

router.get('/jadwal/(:id)', async(req, res)=>{
    try{
       let id = req.params.id
        let data = await Model_Admin.getJadwalById(id)
        res.status(200).json({data})
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
        await Model_Admin.updateJadwal(id, data)
        res.status(200).json({message: 'data berhasil diperbarui'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.delete('/delete/(:id)', verifyToken('admin'),async(req, res)=>{
    try{
        let id = req.params.id
        await Model_Admin.deleteJadwal(id)
        res.status(200).json({message: 'data berhasil dihapus'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router