var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
var ejs = require("ejs")
var htmlDocx = require("html-docx-js")
var puppeteer = require("puppeteer")
const path = require("path")
const fs = require("fs")
const Model_User = require('../../model/Model_User');

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
router.get('/cek-sertif', async(req, res)=>{
    res.render("template/sertifikat")
})
router.get('/download-sertifikat/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const rows = await Model_Admin.getDataDasborSertifById(id)
        const peserta = rows[0]
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
        res.setHeader("Content-Disposition", `attachment; filename=sertifikat_${peserta.nama}.pdf`);
        res.end(pdfBuffer);
    }catch(error){
        console.error(error);
        res.status(500).send("Gagal generate Word");
    }
})
// router.get("/download-sertifikat/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const rows = await Model_Admin.getDataDasborSertifById(id);
//     const peserta = rows[0];

//     const aspekArr = peserta.aspek_list ? peserta.aspek_list.split(", ") : [];
//     const subjekArr = peserta.subjek_list ? peserta.subjek_list.split(", ") : [];
//     const nilaiArr = peserta.penilaian_list ? peserta.penilaian_list.split(", ").map(Number) : [];

//     const gabungan = aspekArr.map((aspek, i) => ({
//       aspek,
//       subjek: subjekArr[i],
//       angka: nilaiArr[i],
//       huruf: convertNilaiHuruf(nilaiArr[i])
//     }));

//     const teknis = gabungan.filter(item => item.aspek.toLowerCase().includes("teknis"));
//     const nonTeknis = gabungan.filter(item => item.aspek.toLowerCase().includes("non"));

//     const hitungJumlah = (arr) => arr.reduce((sum, x) => sum + (x.angka || 0), 0);
//     const hitungRata = (arr) => arr.length ? (hitungJumlah(arr) / arr.length).toFixed(2) : 0;

//     const teknisJumlah = hitungJumlah(teknis);
//     const teknisRata = hitungRata(teknis);
//     const teknisHuruf = convertNilaiHuruf(teknisRata);

//     const nonJumlah = hitungJumlah(nonTeknis);
//     const nonRata = hitungRata(nonTeknis);
//     const nonHuruf = convertNilaiHuruf(nonRata);

//     // render sertifikat.ejs ke HTML
//     const html = await ejs.renderFile(
//       path.join(__dirname, "../../views/template/sertifikat.ejs"),
//       {
//         peserta,
//         teknis,
//         nonTeknis,
//         teknisJumlah,
//         teknisRata,
//         teknisHuruf,
//         nonJumlah,
//         nonRata,
//         nonHuruf
//       }
//     );

//     // convert HTML ke Word buffer
//     const blob = htmlDocx.asBlob(html);  
//     const buffer = Buffer.from(await blob.arrayBuffer());  

//     // response ke client
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
//     res.setHeader("Content-Disposition", `attachment; filename=sertifikat_${peserta.nama}.docx`);
//     res.end(buffer);

//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Gagal generate Word");
//   }
// });
router.post('/store', async(req, res)=>{
    try{
        let {aspek, subjek} = req.body
        const data = {
            aspek,
            subjek
        }
        await Model_Admin.storeAspek(data)
        res.status(200).json({message: 'penambahhan subjek berhasil'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.delete('/delete', async(req, res)=>{
    try{
        const {id} = req.body
        if(!id || id.length === 0) return res.status(400).json({message: 'tidak ada data yang dipilih'})
        const result = await Model_Admin.deleteAspek(id)
        res.status(200).json({ message: `${result.affectedRows} Aspek berhasil dihapus` })
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router