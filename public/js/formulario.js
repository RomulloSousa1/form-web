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


function verifierForm() {
    const form = window.location.search.split('=')[1];

    if (form == 1) {
        getAllAudios();
    } else {
        getAllTranscriptions();
    }
}

async function sendTranscription(element) {
    console.log(element.id);
    console.log(element.parentElement.children[0].value);
    await fetch(apiUrl + '/api/users/' + dataUser.id + '/transcriptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
            "audioId": element.id,
            "answer": element.parentElement.children[0].value,
        }])
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Sem resposta');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getAllAudios() {
    fetch(apiUrl + '/api/audios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Sem resposta');
            }
            return response.json();
        })
        .then(data => {
            data.map((audios) => {
                addCardAudio(audios.id, audios.url);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getAllTranscriptions() {
    auth.onAuthStateChanged((user) => {
        fetch(apiUrl + '/api/users/' + dataUser.id + '/transcriptions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Sem resposta');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })
}

function addCardAudio(idAudio, urlAudio) {
    const lista = document.getElementById('lista-audios');
    const loading = document.getElementById('loading');

    const li = document.createElement("li");
    li.classList.add('list-group-item', 'list-group-item-primary', 'rounded', 'my-2');

    const divTitle = document.createElement("div");
    divTitle.classList.add('fw-bold', 'my-2', 'mx-2');
    divTitle.textContent = 'Transcreva o que você ouviu no áudio abaixo:';

    li.appendChild(divTitle);

    const audio = document.createElement("audio");
    audio.classList.add('w-100');
    audio.setAttribute('controls', '');

    li.appendChild(audio);

    const source = document.createElement("source");
    source.setAttribute('src', urlAudio);
    source.setAttribute('type', 'audio/wav');

    audio.appendChild(source);

    const divResponse = document.createElement("div");
    divResponse.classList.add('input-group', 'my-2');

    li.appendChild(divResponse);

    const input = document.createElement("input");
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Escreva aqui');
    input.setAttribute('required', '');

    divResponse.appendChild(input);

    const saveButton = document.createElement('button');
    saveButton.classList.add('input-group-text', 'bg-body-secondary');
    saveButton.setAttribute('id', idAudio);
    saveButton.onclick = function () {
        sendTranscription(this);
    }
    saveButton.setAttribute('data-bs-toggle', 'popover');
    saveButton.setAttribute('data-bs-trigger', 'focus');
    saveButton.setAttribute('data-bs-content', 'Resposta Salva');

    divResponse.appendChild(saveButton);

    const icon = document.createElement('i');
    icon.classList.add('bi', 'bi-floppy2-fill');

    saveButton.appendChild(icon);

    loading.classList.add('visually-hidden');
    lista.appendChild(li);

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}


verifierForm();

{/* <li class="list-group-item list-group-item-primary rounded my-2">
    <div class="fw-bold my-2 mx-2">Transcreva o que você ouviu no áudio abaixo:</div>
    <audio controls class="w-100">
        <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
            type="audio/mp3" />
    </audio>
    <div class="input-group my-2">
        <input type="text" id="trancription" class="form-control" placeholder="Esqueva aqui" required
            style="width: 80%;">
            <button data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="Resposta Salva"
                class="input-group-text bg-body-secondary"><i class="bi bi-floppy2-fill"></i></button>
    </div>
</li> */}






