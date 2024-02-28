import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getFirestore, collection, addDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'


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

    getAllAudios()
        .then(response => {
            if (!response.ok) {
                throw new Error('Sem resposta');
            }
            return response.json();
        })
        .then(dataAudios => {
            getAllTranscriptions()
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Sem resposta');
                    }
                    return response.json();
                })
                .then(dataTranscriptions => {
                    if (dataTranscriptions.length >= dataAudios.length) {
                        statusTextForm1.textContent = 'Finalizado';
                        trocaClasse(statusTextForm1, 'text-warning', 'text-sucess');
                        for (var transcriptionIndex in dataTranscriptions) {
                            console.log(dataTranscriptions[transcriptionIndex]);
                            if (dataTranscriptions[transcriptionIndex].score != null) {
                                statusTextForm2.textContent = 'Iniciado';
                                trocaClasse(statusTextForm2, 'text-warning', 'text-info');
                                break;

                            }
                        }
                        btnForm1.classList.add('visually-hidden');
                    } else if (dataTranscriptions.length >= 0) {
                        statusTextForm1.textContent = "Iniciado";
                        statusTextForm2.textContent = "Bloqueado";
                        btnForm2.classList.add('visually-hidden');
                        trocaClasse(statusTextForm1, 'text-warning', 'text-info');
                        trocaClasse(statusTextForm2, 'text-warning', 'text-danger');
                    }
                    loading1.classList.add('visually-hidden');
                    loading2.classList.add('visually-hidden');
                    containerForm1.classList.remove('visually-hidden');
                    containerForm2.classList.remove('visually-hidden');
                })
                .catch(error => {
                    console.error('Error:', error);

                });
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

async function getAllAudios() {
    return fetch(apiUrl + '/api/audios');
}

async function getAllTranscriptions() {

    return fetch(apiUrl + '/api/users/' + dataUser.id + '/transcriptions');
}

verifierForm();