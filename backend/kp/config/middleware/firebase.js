const admin = require('firebase-admin')
const serviceAccount = require('../mapta-realtime-notification-firebase-adminsdk-fbsvc-644a94a688.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mapta-realtime-notification.firebaseio.com"
})

const db = admin.firestore()

module.exports = db