const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) 
    : ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000'];

const backendDomain = {
    origin: function (origin, callback) {
        // Izinkan request tanpa origin (seperti Postman atau server-to-server)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: Origin ${origin} is not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = { backendDomain };
