import { auth, db, storage } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
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

window.register = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Account created"))
    .catch(err => alert(err.message));
};

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Logged in"))
    .catch(err => alert(err.message));
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("postSection").style.display = "block";
    loadPosts();
  }
});

window.createPost = async function () {
  const text = document.getElementById("postText").value;
  const imageFile = document.getElementById("postImage").files[0];

  let imageUrl = "";

  if (imageFile) {
    const imageRef = ref(storage, "images/" + imageFile.name);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  await addDoc(collection(db, "posts"), {
    text,
    imageUrl,
    createdAt: new Date()
  });

  alert("Post created");
  loadPosts();
};

async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    postsDiv.innerHTML += `
      <div class="post">
        <p>${data.text}</p>
        ${data.imageUrl ? `<img src="${data.imageUrl}" width="100%">` : ""}
      </div>
    `;
  });
}
