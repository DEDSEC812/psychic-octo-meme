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

// CREATE POST
window.createPost = async function(){
  const text = document.getElementById("postText").value;
  const imageFile = document.getElementById("postImage").files[0];
  let imageUrl="";
  if(imageFile){
    const imageRef = ref(storage,"images/"+Date.now()+imageFile.name);
    await uploadBytes(imageRef,imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }
  await addDoc(collection(db,"posts"),{
    text,
    imageUrl,
    createdAt:new Date(),
    user:auth.currentUser.email,
    likes:[],
    comments:[]
  });
  document.getElementById("postText").value="";
  loadPosts();
}

// LOAD POSTS
async function loadPosts(){
  const querySnapshot = await getDocs(collection(db,"posts"));
  postsDiv.innerHTML="";
  querySnapshot.forEach(docSnap=>{
    const data = docSnap.data();
    const postId = docSnap.id;
    postsDiv.innerHTML+=`
      <div class="post" id="${postId}">
        <p><strong>${data.user}</strong></p>
        <p>${data.text}</p>
        ${data.imageUrl? `<img src="${data.imageUrl}">`:""}
        <div class="post-actions">
          <button onclick="likePost('${postId}')">❤️ ${data.likes.length}</button>
          <button onclick="showCommentBox('${postId}')">💬 ${data.comments.length}</button>
          <button onclick="sharePost('${postId}')">🔗 Share</button>
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
