const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const isProduction = process.env.NODE_ENV === 'production';

// Di production: HANYA baca dari .env (CORS_ORIGIN)
// Di development: Gunakan daftar .env dan izinkan fallback port lokal
const configuredOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) 
    : [];

const localDevOrigins = ['http://localhost:5000', 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];

const allowedOrigins = isProduction 
    ? configuredOrigins 
    : [...new Set([...configuredOrigins, ...localDevOrigins])];

const backendDomain = {
    origin: function (origin, callback) {
        // Izinkan request tanpa origin (seperti Postman, Cron internal, atau server-to-server)
        if (!origin) return callback(null, true);

        // Cek apakah origin ada di daftar allowedOrigins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Toleransi domain yang cocok dengan variabel DOMAIN (apapun protokol dan port-nya)
        const domain = process.env.DOMAIN;
        if (domain) {
            try {
                const originUrl = new URL(origin);
                if (originUrl.hostname === domain || originUrl.hostname.endsWith(`.${domain}`)) {
                    return callback(null, true);
                }
            } catch (_) {}
        }

        // Khusus di development: Toleransi port localhost apapun
        if (!isProduction && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }

        // Ditolak jika tidak memenuhi syarat
        console.warn(`[CORS Blocked] Origin ditolak: ${origin} (Mode: ${process.env.NODE_ENV || 'development'})`);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
};

module.exports = { backendDomain };
