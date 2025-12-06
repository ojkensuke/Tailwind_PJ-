
      import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
      import {
        getDatabase,
        ref,
        push,
        set,
        onChildAdded,
      } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";



  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB8r7ex5rY4O0vBXgL0tY0VAEE9usxEicE",
    authDomain: "tokumeihitokoto-23f1d.firebaseapp.com",
    projectId: "tokumeihitokoto-23f1d",
    storageBucket: "tokumeihitokoto-23f1d.firebasestorage.app",
    messagingSenderId: "555326505724",
    appId: "1:555326505724:web:99c7165e64afcde4340d79"
  };


      // Firebase 初期化
      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);
      const dbRef = ref(db, "chat");

      // -------------------------
      // ① メッセージ送信処理
      // -------------------------
      const sendBtn = document.getElementById("send");
      const text = document.getElementById("text");

      sendBtn.addEventListener("click", function () {
        if (text.value === "") return;

        const msg = {
          text: text.value,
          time: new Date().toISOString()
        };

        const newPostRef = push(dbRef);
        set(newPostRef, msg);

        text.value = "";
      });

      // Enterキーでも送信
      text.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          sendBtn.click();
        }
      });

      // -------------------------
      // ② メッセージ受信処理
      // -------------------------
      const output = document.getElementById("output");

      onChildAdded(dbRef, function (data) {
        const v = data.val();
        const div = document.createElement("div");
        div.className = "msg";
        div.textContent = v.text;

        output.appendChild(div);

        // 常に最新にスクロール
        output.scrollTop = output.scrollHeight;
      });
    