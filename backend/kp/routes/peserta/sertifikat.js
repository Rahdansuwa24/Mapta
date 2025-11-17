var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Peserta = require('../../model/Model_Peserta')
const path = require("path")
const {upload, hapusFiles} = require('../../config/middleware/multer-laporan')


router.get('/', verifyToken('siswa'),async(req, res)=>{
    try{
        let id_users = req.user.id
        const data = await Model_Peserta.getSertifikatPeserta(id_users)
        const sertifikat = data[0].sertifikat
        res.status(200).json({sertifikat})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/laporan-magang', verifyToken('siswa'),async(req, res)=>{
    try{
        let id_users = req.user.id
        const data = await Model_Peserta.getSertifikatPeserta(id_users)
        const laporan_magang = data[0].laporan_magang
        res.status(200).json({laporan_magang})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.patch('/unggah-laporan', verifyToken('siswa'),  upload.single("laporan_magang"), async(req, res)=>{
    try{
        let id = req.user.id
        let dokumen_baru = req.file
        if(!dokumen_baru){
            return res.status(400).json({ message: "laporan wajib diunggah terlebih dahulu" });
        }
        const dataLama = await Model_Peserta.getDataLaporanById(id)
        const peserta = Array.isArray(dataLama) ? dataLama[0] : dataLama
        const fileLama = peserta.laporan_magang
        if (fileLama) {
            const docDirLaporan = path.resolve('public/document-laporan');
            const filePath = path.resolve(docDirLaporan, fileLama);
            hapusFiles([{ path: filePath, filename: fileLama }]);
        }
        await Model_Peserta.unggahLaporan(id, {laporan_magang: dokumen_baru.filename})
        res.status(200).json({message: "laporan magang berhasil diunggah"})
    }catch(err){
        hapusFiles(req.file)
        console.error(err);
        res.status(500).json({ status: false, error: err.message });
    }
})

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../public/document-sertif", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send("File tidak ditemukan.");
    }
  });
});

module.exports = router