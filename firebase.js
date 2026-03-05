// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// =======================
// Configuration Firebase
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyC91wBXLyPhyhgAAlvTigqi1Y8QKiAlkDs",
  authDomain: "infinity-chat-a6cae.firebaseapp.com",
  projectId: "infinity-chat-a6cae",
  storageBucket: "infinity-chat-a6cae.appspot.com",
  messagingSenderId: "34564309390",
  appId: "1:34564309390:web:c0be111c957e61d267a4df",
  measurementId: "G-WH5XZ9J3P2" // optional
};

// =======================
// Initialisation App Firebase
// =======================
const app = initializeApp(firebaseConfig);

// =======================
// Exports pou itilize nan lòt fichye
// =======================
export const auth = getAuth(app);       // pou login/register
export const db = getFirestore(app);    // pou Firestore (posts, users, comments)
export const storage = getStorage(app); // pou upload foto/video
