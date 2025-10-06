var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
var Model_PIC = require('../../model/Model_Pic')
const Model_User = require('../../model/Model_User');


router.get('/', verifyToken("pic"),async(req, res)=>{
    try{
        const id_users = req.user.id
        let dataId = await Model_PIC.getIdPIC(id_users)
        let id_pic = dataId[0].id_pic
        const dataPenilaian = await Model_PIC.getNilai(id_pic)
        res.status(200).json({dataPenilaian})
    }catch(err){
        console.log(err)
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/peserta', verifyToken('pic'),async(req, res)=>{
    try{
        const id_users = req.user.id
        const dataPic = await Model_PIC.getDataCalonPesertaDiterima(id_users)
        res.status(200).json({dataPic})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/aspek', verifyToken('pic'),async(req, res)=>{
    try{
        const id_users = req.user.id
        const dataAspek = await Model_PIC.aspek(id_users)
        res.status(200).json({dataAspek})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/periode-kosong', async(req, res)=>{
    try{
        const data = await Model_Admin.getPeriode()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.post('/store', verifyToken("pic"),async(req, res)=>{
    try{
        let {penilaian, id_aspek, id_peserta_magang} = req.body
        let id_users = req.user.id
        let dataId = await Model_PIC.getIdPIC(id_users)
        let id_pic = dataId[0].id_pic

        let data = {penilaian, id_aspek, id_peserta_magang, id_pic}
        await Model_PIC.storeNilai(data)
        res.status(200).json({message: 'penambahan berhasil'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.patch('/update/(:id)', verifyToken("pic"),async(req, res)=>{
    try{
        let id = req.params.id
        let {penilaian} = req.body
        // if(penilaian === undefined){
        //     return res.status(400).json({ message: "Nilai harus diisi" });
        // }
        await Model_PIC.updateNilai(id, {penilaian: penilaian ?? null})
        res.status(200).json({message: 'data berhasil diperbarui'})
    }catch(err){
        console.log(err)
        res.status(500).json({ status: false, error: err.message });
    }
})
router.delete('/delete/(:id)', verifyToken("pic"),async(req, res)=>{
    try{
        let id = req.params.id
        await Model_PIC.deleteNilai(id)
        res.status(200).json({message: 'data berhasil dihapus'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router