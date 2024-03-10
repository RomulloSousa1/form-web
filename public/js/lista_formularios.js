import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, getDocs, getDoc, doc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js'


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
const firestore = getFirestore(app);

const apiUrl = "https://appraxi-evaluation-form.onrender.com";
var jsonAux = window.localStorage.getItem('dataUser');
var dataUser = JSON.parse(jsonAux);


function trocaClasse(elemento, antiga, nova) {
    elemento.classList.remove(antiga);
    elemento.classList.add(nova);
}

async function verifierForm() {

    var statusTextForm1 = document.getElementById('status-text-form-1');
    var statusTextForm2 = document.getElementById('status-text-form-2');
    var btnForm1 = document.getElementById('btn-form-1');
    var btnForm2 = document.getElementById('btn-form-2');
    var loading1 = document.getElementById('loading-1');
    var loading2 = document.getElementById('loading-2');
    var containerForm1 = document.getElementById('container-form-1');
    var containerForm2 = document.getElementById('container-form-2');


    const audiosList = await getAllAudios();
    const userTranscription = await getAllTranscriptions();


    if (userTranscription.length >= audiosList.length) {
        statusTextForm1.textContent = 'Finalizado';
        trocaClasse(statusTextForm1, 'text-warning', 'text-sucess');
        var hasNull = false;
        var hasScore = false;

        for (var transcriptionIndex in userTranscription) {
            if (userTranscription[transcriptionIndex].score != null) {
                hasScore = true;
            } else if (userTranscription[transcriptionIndex].score == null) {
                hasNull = true;
            }
        }
        if (hasScore == true && hasNull == true) {
            statusTextForm2.textContent = 'Iniciado';
            trocaClasse(statusTextForm2, 'text-warning', 'text-info');
        } else if (hasScore == true && hasNull == false) {
            statusTextForm2.textContent = 'Finalizado';
            btnForm2.classList.add('visually-hidden');
            trocaClasse(statusTextForm2, 'text-warning', 'text-sucess');
        }
        // statusTextForm2.textContent = 'Iniciado';
        // trocaClasse(statusTextForm2, 'text-warning', 'text-info');
        btnForm1.classList.add('visually-hidden');
    } else if (userTranscription.length > 0) {
        statusTextForm1.textContent = "Iniciado";
        statusTextForm2.textContent = "Bloqueado";
        btnForm2.classList.add('visually-hidden');
        trocaClasse(statusTextForm1, 'text-warning', 'text-info');
        trocaClasse(statusTextForm2, 'text-warning', 'text-danger');
    } else {
        statusTextForm2.textContent = "Bloqueado";
        btnForm2.classList.add('visually-hidden');
        trocaClasse(statusTextForm2, 'text-warning', 'text-danger');
    }
    loading1.classList.add('visually-hidden');
    loading2.classList.add('visually-hidden');
    containerForm1.classList.remove('visually-hidden');
    containerForm2.classList.remove('visually-hidden');

}

async function getAllAudios() {
    const audiosRef = collection(firestore, 'audios');
    var audios = [];
    await getDocs(audiosRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            audios.push(doc.data());
        })
    });
    return audios;
}

async function getAllTranscriptions() {
    const transcriptionsRef = collection(firestore, 'transcriptions');
    var transcriptions = [];
    await getDocs(query(transcriptionsRef, where('userId', '==', dataUser.id), orderBy("audioId"))).then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            transcriptions.push(doc.data());
        })
    })
    return transcriptions;
}

verifierForm();