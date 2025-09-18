var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
const {upload, hapusFiles, file} = require('../../config/middleware/multer-admin')
const path = require('path');

router.get('/', verifyToken('admin'), async(req, res)=>{
    try{
        const data = await Model_Admin.getDataCalonPeserta()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/detail/:id', verifyToken('admin'), async(req, res)=>{
    try{
        let id = req.params.id
        const data = await Model_Admin.getDataCalonPesertaById(id)
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.patch('/update/(:id)', verifyToken('admin'), async(req, res)=>{
    try{
        let id = req.params.id
        let status_penerimaan = req.body
        await Model_Admin.updateStatus(id, status_penerimaan)
        res.status(200).json({message: "data berhasil diperbarui"})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.patch('/update-surat-balasan/(:id)', verifyToken('admin'),  upload.single("surat_balasan"), async(req, res)=>{
    try{
        let id = req.params.id
        let dokumen_baru = req.file
        if(!dokumen_baru){
            return res.status(400).json({ message: "surat balasan wajib diunggah" });
        }
        const dataLama = await Model_Admin.getDataCalonPesertaByIdWithoutStatus(id)
        const peserta = Array.isArray(dataLama) ? dataLama[0] : dataLama
        console.log(peserta)
        const fileLama = peserta.surat_balasan
        console.log(fileLama)
        if (fileLama) {
            const docDirDiterima = path.resolve('public/document-admin/diterima');
            const docDirDitolak = path.resolve('public/document-admin/ditolak');
            const folder =
            peserta.status_penerimaan === "ditolak"
                ? docDirDitolak
                : docDirDiterima;
            const filePath = path.resolve(folder, peserta.surat_balasan);

            hapusFiles([{ path: filePath, filename: peserta.surat_balasan }]);
        }
        await Model_Admin.updateSuratBalasan(id, {surat_balasan: dokumen_baru.filename})
        res.status(200).json({message: "surat balasan berhasil diunggah"})
    }catch(err){
        hapusFiles(req.file)
        console.error(err);
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/penerimaan', verifyToken('admin'), async(req, res)=>{
    try{
        const data = await Model_Admin.getDataCalonPesertaDiterima()
        res.status(200).json({data, message: "data peserta diterima"})
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
router.patch('/update/profile/(:id)', verifyToken('admin'), async(req, res)=>{
    try{
        let id = req.params.id
        let {nama, nomor_identitas, instansi} = req.body
        let data = {
            nama,
            nomor_identitas,
            instansi
        }
        await Model_Admin.updateStatus(id, data)
        res.status(200).json({message: "data berhasil diperbarui"})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router