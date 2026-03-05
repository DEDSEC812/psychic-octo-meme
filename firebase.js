// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Konfig Firebase pou Infinity Chat
const firebaseConfig = {
  apiKey: "API_KEY_FIREBASE_SOTI_NAN_CONSOLE", // ranplase ak kle ou a
  authDomain: "infinity-chat-a6cae.firebaseapp.com",
  projectId: "infinity-chat-a6cae",
  storageBucket: "infinity-chat-a6cae.appspot.com",
  messagingSenderId: "34564309390",
  appId: "1:34564309390:web:af9688244ab57bb567a4df",
  measurementId: "G-DYL5J8HJ6Y"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Export pou itilize nan lòt fichye
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
