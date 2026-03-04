import { auth, db, storage } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const authDiv = document.getElementById("auth");
const postSection = document.getElementById("postSection");
const userInfo = document.getElementById("userInfo");

window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully 👑");
  } catch (err) {
    alert(err.message);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Welcome back 👑");
  } catch (err) {
    alert(err.message);
  }
};

// 🔥 Auto session management
onAuthStateChanged(auth, user => {
  if (user) {
    // cacher login
    authDiv.style.display = "none";
    postSection.style.display = "block";

    userInfo.innerHTML = `
      ${user.email}
      <button onclick="logout()" style="margin-left:10px;">Logout</button>
    `;

    loadPosts();
  } else {
    authDiv.style.display = "block";
    postSection.style.display = "none";
    userInfo.innerHTML = "";
  }
});

window.logout = function () {
  signOut(auth);
};

// 🔥 Create Post
window.createPost = async function () {
  const text = document.getElementById("postText").value;
  const imageFile = document.getElementById("postImage").files[0];

  let imageUrl = "";

  if (imageFile) {
    const imageRef = ref(storage, "images/" + Date.now() + imageFile.name);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  await addDoc(collection(db, "posts"), {
    text,
    imageUrl,
    createdAt: new Date(),
    user: auth.currentUser.email
  });

  document.getElementById("postText").value = "";
  alert("Post created 🔥");

  loadPosts();
};

// 🔥 Load Posts
async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    postsDiv.innerHTML += `
      <div class="post">
        <strong>${data.user}</strong>
        <p>${data.text}</p>
        ${data.imageUrl ? `<img src="${data.imageUrl}">` : ""}
      </div>
    `;
  });
      }
