const multer = require('multer')
const path = require('path');
const fs = require('fs')
var Model_Admin = require('../../model/Model_Admin')

const docDirDiterima = path.resolve('public/document-admin/diterima');
const docDirDitolak = path.resolve('public/document-admin/ditolak');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try{

            const id = req.params.id
            const data = await Model_Admin.getDataCalonPesertaByIdWithoutStatus(id);
            const peserta = Array.isArray(data) ? data[0] : data;
            if (!peserta) {
                return cb(new Error("Peserta tidak ditemukan"), null);
            }
            console.log(peserta.status_penerimaan)
            const folder =
            peserta.status_penerimaan === "ditolak"
              ? path.resolve(docDirDitolak)
              : path.resolve(docDirDiterima);
            cb(null, folder);
        }catch(error){
            cb(err, null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
     if(file.fieldname.startsWith('surat_balasan')){
        const allowedTypes = [
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Format file untuk surat balasan tidak diperbolehkan! Hanya (DOC, PDF)'), false);
        }
    }

    cb(null, true);
};

function hapusFiles(files) {
    if (!files) return;
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach(file => {
        fs.unlink(file.path, err => {
            if (err) {
                console.error('Gagal hapus file:', file.filename, err);
            } else {
                console.log('File dihapus:', file.filename);
            }
        });
    });
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: fileFilter
});

module.exports = {fs, upload, hapusFiles}