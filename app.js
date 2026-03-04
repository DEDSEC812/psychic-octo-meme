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
  doc,
  updateDoc,
  arrayUnion,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// DOM Elements
const authDiv = document.getElementById("auth");
const homePage = document.getElementById("homePage");
const postsDiv = document.getElementById("posts");
const storiesList = document.getElementById("storiesList");

// ======================= AUTH =======================

// Register
window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Compte créé 🔥");
  } catch (err) {
    alert(err.message);
  }
};

// Login
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Bienvenue 🔥");
  } catch (err) {
    alert(err.message);
  }
};

// Logout
window.logout = function () {
  signOut(auth);
};

// Auto-session
onAuthStateChanged(auth, (user) => {
  if (user) {
    authDiv.style.display = "none";
    homePage.style.display = "block";
    loadPostsRealtime();
  } else {
    authDiv.style.display = "block";
    homePage.style.display = "none";
  }
});

// ======================= POSTS =======================

// Upload file and create post
window.createPost = async function () {
  const text = document.getElementById("postText").value;
  const file = document.getElementById("postImage").files[0];
  let fileUrl = "";
  let fileType = "";

  if (file) {
    try {
      const fileRef = ref(storage, "uploads/" + Date.now() + "_" + file.name);
      const snapshot = await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(snapshot.ref);

      if (file.type.startsWith("image")) fileType = "image";
      else if (file.type.startsWith("video")) fileType = "video";
    } catch (err) {
      alert("Upload échoué: " + err.message);
      return;
    }
  }

  try {
    await addDoc(collection(db, "posts"), {
      text,
      fileUrl,
      fileType,
      createdAt: new Date(),
      user: auth.currentUser.email,
      likes: [],
      comments: [],
    });
    document.getElementById("postText").value = "";
    document.getElementById("postImage").value = "";
  } catch (err) {
    alert("Post échoué: " + err.message);
  }
};

// ======================= REALTIME POSTS =======================

function loadPostsRealtime() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    postsDiv.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const postId = docSnap.id;

      let mediaHTML = "";
      if (data.fileUrl) {
        if (data.fileType === "image") {
          mediaHTML = `<img src="${data.fileUrl}" style="cursor:pointer;" onclick="openMedia('${data.fileUrl}','image')">`;
        } else if (data.fileType === "video") {
          mediaHTML = `<video controls style="cursor:pointer; width:100%; border-radius:8px;" onclick="openMedia('${data.fileUrl}','video')">
                        <source src="${data.fileUrl}" type="video/mp4">
                       </video>`;
        }
      }

      postsDiv.innerHTML += `
        <div class="post" id="${postId}">
          <p><strong>${data.user}</strong></p>
          <p>${data.text}</p>
          ${mediaHTML}
          <div class="post-actions">
            <button onclick="likePost('${postId}')">❤️ ${data.likes.length}</button>
            <button onclick="showCommentBox('${postId}')">💬 ${data.comments.length}</button>
            <button onclick="sharePost('${postId}')">🔗 Share</button>
            ${data.fileUrl ? `<button onclick="downloadFile('${data.fileUrl}')">⬇️ Télécharger</button>` : ""}
          </div>
          <div id="commentBox-${postId}" style="display:none; margin-top:5px;">
            <input type="text" id="commentInput-${postId}" placeholder="Commenter">
            <button onclick="addComment('${postId}')">Send</button>
          </div>
          <div id="commentsList-${postId}">
            ${data.comments.map(c => `<p><strong>${c.user}</strong>: ${c.text}</p>`).join('')}
          </div>
        </div>
      `;
    });
  });
}

// ======================= POST INTERACTIONS =======================

// Like
window.likePost = async function (postId) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { likes: arrayUnion(auth.currentUser.email) });
};

// Comment
window.showCommentBox = function (postId) {
  const box = document.getElementById(`commentBox-${postId}`);
  box.style.display = box.style.display === "none" ? "block" : "none";
};

window.addComment = async function (postId) {
  const input = document.getElementById(`commentInput-${postId}`);
  const commentText = input.value;
  if (commentText === "") return;
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { comments: arrayUnion({ user: auth.currentUser.email, text: commentText }) });
  input.value = "";
};

// Share
window.sharePost = function (postId) {
  const postUrl = window.location.href + `#${postId}`;
  navigator.clipboard.writeText(postUrl);
  alert("Lien du post copié 🔥");
};

// Download
window.downloadFile = function (fileUrl) {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileUrl.split("/").pop();
  a.click();
};

// ======================= STORIES =======================
window.addStory = function () {
  const storyCard = document.createElement("div");
  storyCard.classList.add("story-card");
  storyCard.innerText = "Nouvelle Story";
  storiesList.appendChild(storyCard);
};

// ======================= MODAL MEDIA =======================
window.openMedia = function (url, type) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0,0,0,0.9)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "9999";
  modal.style.cursor = "pointer";
  modal.onclick = () => document.body.removeChild(modal);

  if (type === "image") {
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    modal.appendChild(img);
  } else if (type === "video") {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    video.style.maxWidth = "90%";
    video.style.maxHeight = "90%";
    modal.appendChild(video);
  }

  document.body.appendChild(modal);
};
