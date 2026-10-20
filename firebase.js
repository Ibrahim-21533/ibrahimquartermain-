// SKY ARCH LAB — shared Firebase initialization.
// Replace every placeholder with values from Firebase Console > Project settings > General > Your apps.
// Never put Firebase Admin SDK/service-account credentials in this frontend file.

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkdwk-oUVgMBY2qhiMGKmJ1wJYBNsVJFg",
  authDomain: "sky-arch-lab.firebaseapp.com",
  databaseURL: "https://sky-arch-lab-default-rtdb.firebaseio.com",
  projectId: "sky-arch-lab",
  storageBucket: "sky-arch-lab.firebasestorage.app",
  messagingSenderId: "865466952230",
  appId: "1:865466952230:web:1fbb5d1ee70881d2bf14e7"
};


const isConfigured = Object.values(firebaseConfig).every(
  value => value && !value.startsWith("YOUR_")
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, isConfigured };
