// middleware yang mengatur pengiriman notifikasi
const db = require('../middleware/firebase');
const admin = require('firebase-admin');

async function pushNotifikasi(data) {
  try {
    const notifRef = db.collection('notifikasi')
    const docRef = notifRef.doc();

    const notifData = {
      id: docRef.id,
      ...data,
      tanggal: admin.firestore.Timestamp.now()
    };

    await docRef.set(notifData); 
    console.log('Notifikasi berhasil ditambahkan:', data.title);

    const snapshot = await notifRef.orderBy('tanggal', 'desc').get();
    if (snapshot.size > 6) {
      const oldDocs = snapshot.docs.slice(6);
      for (const doc of oldDocs) {
        await notifRef.doc(doc.id).delete();
        console.log('Notifikasi lama dihapus:', doc.id);
      }
    }
  } catch (error) {
    console.error('Gagal menambahkan notifikasi:', error.message);
  }
}

module.exports = { pushNotifikasi };
