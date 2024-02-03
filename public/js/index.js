import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3UikeJi4bahWkWJRQmPoMrxujpTgMWWQ",
  authDomain: "formulario-web-c999c.firebaseapp.com",
  projectId: "formulario-web-c999c",
  storageBucket: "formulario-web-c999c.appspot.com",
  messagingSenderId: "611070412605",
  appId: "1:611070412605:web:846768e556b98e096c6754",
  measurementId: "G-BTYGPLV600"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user);
    if (window.location.pathname == '/home.html') {
      console.log(window.location.pathname);
      window.location.href = "../pages/home.html";
    }
  } else {
    console.log('Not Logged');
  }
});


export function createAndLoginUser() {
  const email = document.getElementById('email').value;
  const num_conselho = document.getElementById('num-conselho').value;


  createUserWithEmailAndPassword(auth, email, num_conselho)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      loginUser();

    })
    .catch((error) => {
      loginUser();
    });
}

export function loginUser() {

  const email = document.getElementById('email').value;
  const num_conselho = document.getElementById('num-conselho');
  const feedback = document.getElementById('feedback');



  signInWithEmailAndPassword(auth, email, num_conselho.value)
    .then((userCredential) => {

      const user = userCredential.user;
      console.log(user);
      window.location.href = "../pages/home.html";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      alert("Número do conselho errado ou já está vinculado a outro e-mail vinculado a outro e-mail.");  
    });
}

export function signOutUser() {
  signOut(auth).then(() => {
    window.location.href = "../index.html";
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);
    alert(errorMessage);
  });
}
