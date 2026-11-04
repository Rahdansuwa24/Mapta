const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let db = null;

try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
        ? path.resolve(__dirname, '../../', process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
        : path.resolve(__dirname, '../mapta-realtime-notification-firebase-adminsdk-fbsvc-644a94a688.json');

    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://mapta-realtime-notification.firebaseio.com"
            });
        }
        db = admin.firestore();
        console.log("Firebase Admin SDK terhubung.");
    } else {
        console.warn("Peringatan: File Service Account Firebase tidak ditemukan di:", serviceAccountPath);
    }
} catch (error) {
    console.error("Gagal inisialisasi Firebase Admin SDK:", error.message);
}

module.exports = db;
