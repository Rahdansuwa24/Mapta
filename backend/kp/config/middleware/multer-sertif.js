const multer = require('multer')
const path = require('path');
const fs = require('fs')

const docDirSertif = path.resolve('public/document-sertif');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, docDirSertif);
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
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

module.exports = {fs, upload, hapusFiles}