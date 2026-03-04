import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC91wBXLyPhyhgAAlvTigqi1Y8QKiAlkDs",
  authDomain: "infinity-chat-a6cae.firebaseapp.com",
  projectId: "infinity-chat-a6cae",
  storageBucket: "infinity-chat-a6cae.firebasestorage.app",
  messagingSenderId: "34564309390",
  appId: "1:34564309390:web:c0be111c957e61d267a4df",
  measurementId: "G-WH5XZ9J3P2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
