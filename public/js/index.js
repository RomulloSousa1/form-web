import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore, setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';


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
const auth = getAuth(app);
const firestore = getFirestore(app);



export function createAndLoginUser() {
  const email = document.getElementById('email').value;
  const num_conselho = document.getElementById('num-conselho');


  if (num_conselho.validity.valid == true) {

    createUserWithEmailAndPassword(auth, email, num_conselho.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          const docRef = await setDoc(doc(firestore, "users", user.uid), {
            'email': email,
            'num-conselho': num_conselho.value,
            'id': user.uid,
            'transcriptions' : [],
          });
          loginUser();
        } catch (e) {
          console.error("Erro ao criar o documento: ", e);
        }
      })
      .catch((error) => {
        console.log(error);
        loginUser();
      });

  }

}

export async function loginUser() {

  const email = document.getElementById('email').value;
  const num_conselho = document.getElementById('num-conselho');


  signInWithEmailAndPassword(auth, email, num_conselho.value)
    .then((userCredential) => {
      const jsonAux = JSON.stringify({
        'email' : userCredential.user.email,
        'id': userCredential.user.uid,
      });
      console.log(jsonAux);
      window.localStorage.setItem('dataUser', jsonAux);
      window.location.href = "pages/listas_formularios.html";
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
