const multer = require('multer')
const path = require('path');
const fs = require('fs')

const imageDir = path.resolve('public/images');
const docDir = path.resolve('public/document');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname.startsWith('foto_diri')) {
            cb(null, imageDir);
        } else if (file.fieldname.startsWith('dokumen_pendukung')) {
            cb(null, docDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.fieldname.startsWith('foto_diri')){
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedImageTypes.includes(file.mimetype)) {
            return cb(new Error('Foto diri harus berupa gambar (JPEG, PNG, JPG)!'), false);
        }
    }
    else if(file.fieldname.startsWith('dokumen_pendukung')){
        const allowedTypes = [
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Format file untuk dokumen_pendukung tidak diperbolehkan! Hanya (DOC, PDF)'), false);
        }
    }

    cb(null, true);
};

function hapusFiles(files) {
    if (!Array.isArray(files) || files.length === 0) {
        return;
    }
    files.forEach(file => {
        const filepath = path.join(file.path);
        fs.unlink(filepath, err => {
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