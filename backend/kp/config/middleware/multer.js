const multer = require('multer')
const path = require('path');
const fs = require('fs')

const imageDir = path.resolve('public/images');
const docDir = path.resolve('public/document');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'foto_diri') {
            cb(null, imageDir);
        } else if (file.fieldname === 'dokumen_pendukung') {
            cb(null, docDir);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.fieldname === 'foto_diri'){
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedImageTypes.includes(file.mimetype)) {
            return cb(new Error('Foto diri harus berupa gambar (JPEG, PNG, WEBP)!'), false);
        }
    }
    else if(file.fieldname === 'dokumen_pendukung'){
        const allowedTypes = [
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Format file tidak diperbolehkan! Hanya gambar (JPEG, PNG, JPG, WEBP, DOC, PDF'), false);
        }
    }

    cb(null, true);
};

function hapusFiles(files) {
    if (!files) return;
    for (const field in files) {
        files[field].forEach(file => {
            const dir = file.fieldname === 'foto_diri' ? imageDir : docDir;
            const filepath = path.join(dir, file.filename);
            fs.unlink(filepath, err => {
                if (err) console.error('Gagal hapus file:', file.filename);
                else console.log('File dihapus:', file.filename);
            });
        });
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 1MB
    fileFilter: fileFilter
});

module.exports = {fs, upload, hapusFiles}