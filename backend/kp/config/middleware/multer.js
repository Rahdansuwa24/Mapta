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
    const allowedTypes = ['image/jpeg', 'image/jpg','image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Format file tidak diperbolehkan! Hanya gambar (JPEG, PNG, JPG, WEBP, DOC, PDF'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 1MB
    fileFilter: fileFilter
});

module.exports = {fs, upload}