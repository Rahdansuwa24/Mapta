var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')


router.get('/', verifyToken('admin'),async(req, res)=>{
    try{
        const data = await Model_Admin.getNilai()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.patch('/update/(:id)', verifyToken("admin"),async(req, res)=>{
        try{
            let id = req.params.id
            let {penilaian} = req.body
            if (penilaian === "" || penilaian === undefined) {
                penilaian = null;
            }
            if(penilaian === undefined){
                return res.status(400).json({ message: "Nilai harus diisi" });
            }
            await Model_Admin.updateNilai(id, {penilaian, status_penilaian: 'Final'})
            res.status(200).json({message: 'data berhasil diperbarui'})
        }catch(err){
            console.log(err)
            res.status(500).json({ status: false, error: err.message });
        }
    })
    router.patch('/update-final-non-teknis/(:id)', verifyToken("admin"),async(req, res)=>{
        try{
            let id = req.params.id
            let {nilai, id_peserta_magang, id_aspek} = req.body
            if (nilai === "" || nilai === undefined) {
                nilai = null;
            }
            if(nilai === undefined){
                return res.status(400).json({ message: "Nilai harus diisi" });
            }
            await Model_Admin.updateNilaiFinalNonTeknis(id, {nilai})
            await Model_Admin.setStatusNilai(id_peserta_magang, id_aspek)
            res.status(200).json({message: 'data berhasil diperbarui'})
        }catch(err){
            console.log(err)
            res.status(500).json({ status: false, error: err.message });
        }
    })

router.delete('/delete', verifyToken('admin'),async(req, res)=>{
    try{
        const {id_aspek} = req.body
        if(!id_aspek || id_aspek.length === 0) return res.status(400).json({message: 'tidak ada data yang dipilih'})
        const result = await Model_Admin.deleteAspek(id_aspek)
        res.status(200).json({ message: `${result.affectedRows} Aspek berhasil dihapus` })
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router