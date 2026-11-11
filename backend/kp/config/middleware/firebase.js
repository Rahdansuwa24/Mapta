const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let db = null;

try {
    let serviceAccount = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        try {
            serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
        } catch (e) {
            console.error("Gagal parse FIREBASE_SERVICE_ACCOUNT_BASE64:", e.message);
        }
    } else {
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
            ? path.resolve(__dirname, '../../', process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
            : path.resolve(__dirname, '../mapta-realtime-notification-firebase-adminsdk-fbsvc-644a94a688.json');

        if (fs.existsSync(serviceAccountPath)) {
            serviceAccount = require(serviceAccountPath);
        }
    }

    if (serviceAccount) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://mapta-realtime-notification.firebaseio.com"
            });
        }
        db = admin.firestore();
        console.log("Firebase Admin SDK terhubung.");
    } else {
        console.warn("Peringatan: Kredensial Firebase Service Account tidak ditemukan (file JSON atau FIREBASE_SERVICE_ACCOUNT_BASE64).");
    }
} catch (error) {
    console.error("Gagal inisialisasi Firebase Admin SDK:", error.message);
}

module.exports = db;
