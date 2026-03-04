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
  getDocs,
  doc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const authDiv = document.getElementById("auth");
const homePage = document.getElementById("homePage");
const messagesPage = document.getElementById("messagesPage");
const storiesList = document.getElementById("storiesList");
const postsDiv = document.getElementById("posts");

// REGISTER
window.register = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try{
    await createUserWithEmailAndPassword(auth,email,password);
    alert("Compte créé 🔥");
  }catch(err){alert(err.message);}
}

// LOGIN
window.login = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try{
    await signInWithEmailAndPassword(auth,email,password);
    alert("Bienvenue 🔥");
  }catch(err){alert(err.message);}
}

// LOGOUT
window.logout = function(){
  signOut(auth);
}

// SESSION AUTO
onAuthStateChanged(auth,user=>{
  if(user){
    authDiv.style.display="none";
    homePage.style.display="block";
    messagesPage.style.display="none";
    loadPosts();
  }else{
    authDiv.style.display="block";
    homePage.style.display="none";
    messagesPage.style.display="none";
  }
});

// CREATE POST (image ou vidéo)
window.createPost = async function(){
  const text = document.getElementById("postText").value;
  const file = document.getElementById("postImage").files[0];
  let fileUrl = "";
  let fileType = "";

  if(file){
    const fileRef = ref(storage, "uploads/" + Date.now() + "_" + file.name);
    const snapshot = await uploadBytes(fileRef, file); // on attend l’upload
    fileUrl = await getDownloadURL(snapshot.ref); // on prend le lien exact

    if(file.type.startsWith("image")) fileType = "image";
    else if(file.type.startsWith("video")) fileType = "video";
  }

  await addDoc(collection(db,"posts"),{
    text,
    fileUrl,
    fileType,
    createdAt: new Date(),
    user: auth.currentUser.email,
    likes:[],
    comments:[]
  });

  // reset form
  document.getElementById("postText").value="";
  document.getElementById("postImage").value="";

  // recharge posts immédiatement
  loadPosts();
      }

// LOAD POSTS
async function loadPosts(){
  const querySnapshot = await getDocs(collection(db,"posts"));
  postsDiv.innerHTML="";
  querySnapshot.forEach(docSnap=>{
    const data = docSnap.data();
    const postId = docSnap.id;

    let mediaHTML = "";
    if(data.fileUrl){
      if(data.fileType==="image"){
        mediaHTML = `<img src="${data.fileUrl}" style="cursor:pointer;" onclick="openMedia('${data.fileUrl}','image')">`;
      }else if(data.fileType==="video"){
        mediaHTML = `<video controls style="cursor:pointer; width:100%; border-radius:8px;" onclick="openMedia('${data.fileUrl}','video')"><source src="${data.fileUrl}" type="video/mp4"></video>`;
      }
    }

    postsDiv.innerHTML+=`
      <div class="post" id="${postId}">
        <p><strong>${data.user}</strong></p>
        <p>${data.text}</p>
        ${mediaHTML}
        <div class="post-actions">
          <button onclick="likePost('${postId}')">❤️ ${data.likes.length}</button>
          <button onclick="showCommentBox('${postId}')">💬 ${data.comments.length}</button>
          <button onclick="sharePost('${postId}')">🔗 Share</button>
          ${data.fileUrl? `<button onclick="downloadFile('${data.fileUrl}')">⬇️ Télécharger</button>` : ""}
        </div>
        <div id="commentBox-${postId}" style="display:none; margin-top:5px;">
          <input type="text" id="commentInput-${postId}" placeholder="Commenter">
          <button onclick="addComment('${postId}')">Send</button>
        </div>
        <div id="commentsList-${postId}">
          ${data.comments.map(c=>`<p><strong>${c.user}</strong>: ${c.text}</p>`).join('')}
        </div>
      </div>
    `;
  });
}

// Ouvrir media en grand
window.openMedia = function(url,type){
  const modal = document.createElement("div");
  modal.style.position="fixed";
  modal.style.top="0";
  modal.style.left="0";
  modal.style.width="100%";
  modal.style.height="100%";
  modal.style.background="rgba(0,0,0,0.9)";
  modal.style.display="flex";
  modal.style.justifyContent="center";
  modal.style.alignItems="center";
  modal.style.zIndex="9999";
  modal.style.cursor="pointer";
  modal.onclick = ()=> document.body.removeChild(modal);

  if(type==="image"){
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth="90%";
    img.style.maxHeight="90%";
    modal.appendChild(img);
  } else if(type==="video"){
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    video.style.maxWidth="90%";
    video.style.maxHeight="90%";
    modal.appendChild(video);
  }

  document.body.appendChild(modal);
               }

// DOWNLOAD FILE
window.downloadFile = function(fileUrl){
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = fileUrl.split("/").pop();
  a.click();
  }

// LIKE POST
window.likePost = async function(postId){
  const postRef = doc(db,"posts",postId);
  await updateDoc(postRef,{
    likes: arrayUnion(auth.currentUser.email)
  });
  loadPosts();
}

// COMMENT
window.showCommentBox = function(postId){
  const box = document.getElementById(`commentBox-${postId}`);
  box.style.display = box.style.display==="none"?"block":"none";
}

window.addComment = async function(postId){
  const input = document.getElementById(`commentInput-${postId}`);
  const commentText = input.value;
  if(commentText==="") return;
  const postRef = doc(db,"posts",postId);
  await updateDoc(postRef,{
    comments: arrayUnion({user:auth.currentUser.email, text:commentText})
  });
  input.value="";
  loadPosts();
}

// SHARE
window.sharePost = function(postId){
  const postUrl = window.location.href + `#${postId}`;
  navigator.clipboard.writeText(postUrl);
  alert("Lien du post copié 🔥");
}

// STORIES
window.addStory = function(){
  const storyCard = document.createElement("div");
  storyCard.classList.add("story-card");
  storyCard.innerText="Nouvelle Story";
  storiesList.appendChild(storyCard);
}

// NAVIGATION
window.showHome = function(){
  homePage.style.display="block";
  messagesPage.style.display="none";
}

window.showMessages = function(){
  homePage.style.display="none";
  messagesPage.style.display="block";
                        }
      
