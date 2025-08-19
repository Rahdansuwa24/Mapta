var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')

router.get('/', verifyToken('admin'), async(req, res)=>{
    try{
        const data = await Model_Admin.getDataCalonPeserta()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/(:id)', verifyToken('admin'), async(req, res)=>{
    try{
        let id = req.params.id
        const data = await Model_Admin.getDataCalonPesertaById(id)
        res.status(200).json({message: 'data berhasil diperbarui'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.patch('/update/(:id)', verifyToken('admin'), async(req, res)=>{
    try{
        let id = req.params.id
        let status_penerimaan = req.body
        const data = await Model_Admin.updateStatus(id, status_penerimaan)
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/penerimaan', verifyToken('admin'), async(req, res)=>{
    try{
        const data = await Model_Admin.getDataCalonPesertaDiterima()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/penolakan', verifyToken('admin'), async(req, res)=>{
    try{
        const data = await Model_Admin.getDataCalonPesertaDitolak()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router