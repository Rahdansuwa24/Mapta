var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
var ejs = require("ejs")
var puppeteer = require("puppeteer")
const path = require("path")
const {upload, hapusFiles} = require('../../config/middleware/multer-sertif')
const dayjs = require("dayjs")
const newLocal = "dayjs/locale/id";
require(newLocal)
dayjs.locale("id")


function convertNilaiHuruf(nilai) {
  if (nilai === null || nilai === undefined) return "";
  const n = parseFloat(nilai);

  if (n >= 90) return "A";
  if (n >= 85) return "A-";
  if (n >= 80) return "B+";
  if (n >= 75) return "B";
  if (n >= 70) return "C+";
  if (n >= 65) return "C";
  if (n >= 60) return "D";
  return "E";
}

router.get('/', verifyToken('admin'),async(req, res)=>{
    try{
        const data = await Model_Admin.getDataDasborSertif()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.patch('/finalisasi/:id', verifyToken('admin'),async(req, res)=>{
    try{
        let id = req.params.id
        let status_penerimaan = req.body
        const data = await Model_Admin.updateSertif(id, status_penerimaan)
        res.status(200).json({data})
    }catch(err){
        console.log(err)
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/cek-sertif', async(req, res)=>{
    res.render("template/sertifikat")
})
router.get('/download-sertifikat/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const rows = await Model_Admin.getDownloadSertif(id)
        const peserta = rows[0]

        peserta.tanggal_mulai_magang = dayjs(peserta.tanggal_mulai_magang).format("DD MMMM YYYY")
        peserta.tanggal_selesai_magang = dayjs(peserta.tanggal_selesai_magang).format("DD MMMM YYYY")

        const aspekArr = peserta.aspek_list ? peserta.aspek_list.split(", ") : [];
        const subjekArr = peserta.subjek_list ? peserta.subjek_list.split(", ") : [];
        const nilaiArr = peserta.penilaian_list ? peserta.penilaian_list.split(", ").map(Number) : [];
        const gabungan = aspekArr.map((aspek, i) => ({
            aspek,
            subjek: subjekArr[i],
            angka: nilaiArr[i],
            huruf: convertNilaiHuruf(nilaiArr[i])
        }));
        const teknis = gabungan.filter(item => (item.aspek || '').trim().toLowerCase() === 'teknis');
        const nonTeknis = gabungan.filter(item => (item.aspek || '').trim().toLowerCase() === 'non-teknis');
        const teknisNumbered = teknis.map((item, i) => ({ ...item, no: i + 1 }));
        const nonTeknisNumbered = nonTeknis.map((item, i) => ({ ...item, no: i + 1 }));

        const hitungJumlah = (arr) => arr.reduce((sum, x) => sum + (x.angka || 0), 0);
        const hitungRata = (arr) => arr.length ? (hitungJumlah(arr) / arr.length).toFixed(2) : 0;

        const teknisJumlah = hitungJumlah(teknis);
        const teknisRata = hitungRata(teknis);
        const teknisHuruf = convertNilaiHuruf(teknisRata);

        const nonJumlah = hitungJumlah(nonTeknis);
        const nonRata = hitungRata(nonTeknis);
        const nonHuruf = convertNilaiHuruf(nonRata);

        const html = await ejs.renderFile(
          path.join(__dirname, "../../views/template/sertifikat.ejs"),
          { peserta, teknis:teknisNumbered, nonTeknis:nonTeknisNumbered, teknisJumlah, teknisRata, teknisHuruf, nonJumlah, nonRata, nonHuruf }
        );
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
        await browser.close();
  
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=sertifikat_${peserta.nama}_${peserta.instansi}.pdf`);
        res.end(pdfBuffer);
    }catch(error){
        console.error(error);
        res.status(500).send("Gagal generate PDF");
    }
})
router.patch('/update-sertifikat/(:id)', verifyToken('admin'),  upload.single("sertifikat"), async(req, res)=>{
    try{
        let id = req.params.id
        let dokumen_baru = req.file
        if(!dokumen_baru){
            return res.status(400).json({ message: "sertifikat wajib diunggah" });
        }
        const dataLama = await Model_Admin.getDataDasborSertifById(id)
        const peserta = Array.isArray(dataLama) ? dataLama[0] : dataLama
        console.log(peserta)
        const fileLama = peserta.sertifikat
        console.log(fileLama)
        if (fileLama) {
            const docDirSertif = path.resolve('public/document-sertif');
            const filePath = path.resolve(docDirSertif, fileLama);

            hapusFiles([{ path: filePath, filename: fileLama }]);
        }
        await Model_Admin.updateSertif(id, {sertifikat: dokumen_baru.filename})
        res.status(200).json({message: "surat balasan berhasil diunggah"})
    }catch(err){
        hapusFiles(req.file)
        console.error(err);
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router