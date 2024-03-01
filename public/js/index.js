import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getFirestore, collection, addDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const urlBase = "https://appraxi-evaluation-form.onrender.com";

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

async function getUserByEmail(email) {
  console.log(urlBase + '/api/users/' + email);
  return fetch(urlBase + '/api/users/' + email);
}


async function registeUserAPI(email) {

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    })
  };

  return fetch(urlBase + '/api/register', options);
}




export function createAndLoginUser() {
  const email = document.getElementById('email').value;
  const num_conselho = document.getElementById('num-conselho');
  if (num_conselho.validity.valid == true) {
    registeUserAPI(email).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
      .then(newUserData => {
        createUserWithEmailAndPassword(auth, email, num_conselho.value)
          .then(async (userCredential) => {
            const user = userCredential.user;
            try {
              const docRef = await addDoc(collection(firestore, "users"), {
                'email': email,
                'num-conselho': num_conselho.value,
                'id': user.uid,
              });
              loginUser();
              console.log("Documento criado com sucesso com o id: ", docRef.id);
            } catch (e) {
              console.error("Erro ao criar o documento: ", e);
            }
          })
          .catch((error) => {
            console.log(error);
            loginUser();
          });
      })
      .catch(error => {
        if (error.message == '409') {
          loginUser();
        } else {
          alert("Erro ao acessar o servidor. Volte em alguns minutos e tente novamente");
        }
      });
  }

}

export async function loginUser() {

  const email = document.getElementById('email').value;
  const num_conselho = document.getElementById('num-conselho');
  const feedback = document.getElementById('feedback');

  getUserByEmail(email).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
    .then(newUserData => {
      signInWithEmailAndPassword(auth, email, num_conselho.value)
        .then((userCredential) => {
          const jsonAux = JSON.stringify(newUserData);
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

    })
    .catch(error => {
      alert("Erro ao acessar o servidor. Volte em alguns minutos e tente novamente");
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
