var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Peserta = require('../../model/Model_Peserta')
const path = require("path")


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