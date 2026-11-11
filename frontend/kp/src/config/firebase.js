import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDAyUo3Gs7aaR9Fa52leRBPp1r8ioQdook",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "mapta-realtime-notification.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "mapta-realtime-notification",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "mapta-realtime-notification.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1044003645083",
  appId: env.VITE_FIREBASE_APP_ID || "1:1044003645083:web:73ec28184360b156de483e",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-8XKRGXQ4EE"
};

// Inisialisasi Firebase secara aman jika konfigurasi tersedia
let app = null;
let db = null;
let analytics = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);

    if (typeof window !== "undefined") {
      isSupported().then((supported) => {
        if (supported && firebaseConfig.measurementId) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {
        // Analytics opsional
      });
    }
  } else {
    console.warn("Konfigurasi Firebase belum diisi di berkas .env");
  }
} catch (error) {
  console.error("Gagal menginisialisasi Firebase:", error.message);
}

export { db, analytics };
export default app;
