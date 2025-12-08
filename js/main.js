import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyB8r7ex5rY4O0vBXgL0tY0VAEE9usxEicE",
  authDomain: "tokumeihitokoto-23f1d.firebaseapp.com",
  projectId: "tokumeihitokoto-23f1d",
  storageBucket: "tokumeihitokoto-23f1d.firebasestorage.app",
  messagingSenderId: "555326505724",
  appId: "1:555326505724:web:99c7165e64afcde4340d79"
};

// 初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "chat");
const auth = getAuth();
const provider = new GoogleAuthProvider();

let uid = null;


// -----------------------------
// ① Googleログイン
// -----------------------------
document.getElementById("login").onclick = () => {
  signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    document.getElementById("user").textContent = `ログイン: ${user.displayName}`;
  } else {
    uid = null;
    document.getElementById("user").textContent = "未ログイン";
  }
});


// -----------------------------
// ② メッセージ送信
// -----------------------------
const sendBtn = document.getElementById("send");
const text = document.getElementById("text");

sendBtn.addEventListener("click", () => {
  if (text.value === "" || !uid) return alert("ログインしてください");

  const msg = {
    text: text.value,
    time: new Date().toISOString(),
    uid: uid // ← 誰の投稿か識別
  };

  const newPostRef = push(dbRef);
  set(newPostRef, msg);

  text.value = "";
});

// Enterキー送信
text.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});


// -----------------------------
// ③ メッセージ受信＋削除・編集
// -----------------------------
const output = document.getElementById("output");

onChildAdded(dbRef, (data) => {
  const v = data.val();
  const key = data.key;

  const div = document.createElement("div");
  div.className = "msg";

  const textSpan = document.createElement("span");
  textSpan.textContent = v.text;

  div.appendChild(textSpan);


  // 自分の投稿だけボタン表示
  if (v.uid === uid) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.style.marginLeft = "5px";

    // 編集処理
    editBtn.onclick = () => {
      const newText = prompt("修正内容を入力", v.text);
      if (newText) {
        update(ref(db, "chat/" + key), { text: newText });
        textSpan.textContent = newText;
      }
    };

    // 削除処理
    delBtn.onclick = () => {
      remove(ref(db, "chat/" + key));
      div.remove();
    };

    div.appendChild(editBtn);
    div.appendChild(delBtn);
  }

  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
});
