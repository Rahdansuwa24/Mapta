// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAyUo3Gs7aaR9Fa52leRBPp1r8ioQdook",
  authDomain: "mapta-realtime-notification.firebaseapp.com",
  projectId: "mapta-realtime-notification",
  storageBucket: "mapta-realtime-notification.firebasestorage.app",
  messagingSenderId: "1044003645083",
  appId: "1:1044003645083:web:73ec28184360b156de483e",
  measurementId: "G-8XKRGXQ4EE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)

