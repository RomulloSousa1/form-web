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


async function sendScore(element, update) {
    await fetch(apiUrl + '/api/users/' + dataUser.id + '/transcriptions/' + element.id, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
            "score": element.parentElement.children[0].value,
        })
    })
        .then(response => {
            if (!response.ok) {

                throw new Error("Sem Resposta");
            }
            return response.json();
        })
        .then(data => {
            if (update == false) {
                element.parentElement.children[2].setAttribute('data-bs-content', 'Resposta Editada');
                element.parentElement.children[2].classList.remove('visually-hidden');
                element.classList.add('visually-hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function editTranscription(element) {
    await fetch(apiUrl + '/api/users/' + dataUser.id + '/transcriptions/' + element.id, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "answer": element.parentElement.children[0].value,
        })
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


async function sendTranscription(element) {
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
            element.parentElement.children[2].setAttribute('id', data);
            element.parentElement.children[2].classList.remove('visually-hidden');
            element.classList.add('visually-hidden');
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
            fetch(apiUrl + '/api/users/' + dataUser.id + '/transcriptions')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Sem resposta');
                    }
                    return response.json();
                })
                .then(dataTranscription => {
                    for (var x = 0; x < data.length; x++) {
                        console.log(data[x]);
                        var hasTranscription = false;
                        console.log(hasTranscription);
                        if (dataTranscription.length > 0) {
                            for (var y = 0; y < dataTranscription.length; y++) {
                                if (dataTranscription[y].audio.id == data[x].id) {
                                    hasTranscription = true;
                                    break;
                                }
                            }
                            if (hasTranscription == true) {
                                addCardAudio(data[x].id, data[x].url, dataTranscription[y].id, dataTranscription[y].answer);
                            } else {
                                addCardAudio(data[x].id, data[x].url,);
                            }
                        }
                        else {
                            addCardAudio(data[x].id, data[x].url,);
                        }

                    }
                })
                .catch(error => {
                    console.error('Error:', error);

                });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getAllTranscriptions() {

    fetch(apiUrl + '/api/users/' + dataUser.id + '/transcriptions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Sem resposta');
            }
            return response.json();
        })
        .then(data => {
            data.map((transcriptions) => {
                addCardTranscription(transcriptions.id, transcriptions.answer, transcriptions.audio.template, transcriptions.score);
            })
        })
        .catch(error => {
            console.error('Error:', error);

        });
}

function addCardTranscription(idTranscription, answer, template, score) {
    const lista = document.getElementById('lista-cards');
    const loading = document.getElementById('loading');

    const li = document.createElement("li");
    li.classList.add('list-group-item', 'list-group-item-primary', 'rounded', 'my-2');

    const divTitle = document.createElement("div");
    divTitle.classList.add('fw-bold', 'my-2', 'mx-2');
    divTitle.textContent = 'Dê uma pontuação (Entre 0 a 100) correspondente à similaridade das respostas:';

    li.appendChild(divTitle);

    const templateAndAnswer = document.createElement("div");
    templateAndAnswer.classList.add('w-100', 'my-2', 'mx-2');
    templateAndAnswer.innerHTML = "Gabarito para este áudio: " + template.bold() + ". Sua resposta para esse áudio: " + answer.bold();

    li.appendChild(templateAndAnswer);

    const divResponse = document.createElement("div");
    divResponse.classList.add('input-group', 'my-2');

    li.appendChild(divResponse);

    const input = document.createElement("input");
    input.classList.add('form-control');
    input.setAttribute('type', 'number');
    input.setAttribute('placeholder', 'Escreva aqui');
    if (score != null) {
        input.value = score;
    }
    input.setAttribute('required', '');

    divResponse.appendChild(input);

    const saveButton = document.createElement('button');
    saveButton.classList.add('input-group-text', 'bg-body-secondary');
    saveButton.setAttribute('id', idTranscription);
    saveButton.onclick = function () {
        sendScore(this, false);
    }
    saveButton.setAttribute('data-bs-toggle', 'popover');
    saveButton.setAttribute('data-bs-trigger', 'focus');
    saveButton.setAttribute('data-bs-content', 'Resposta Salva');

    divResponse.appendChild(saveButton);

    const editButton = document.createElement('button');
    editButton.classList.add('input-group-text', 'bg-body-secondary');
    editButton.setAttribute('id', idTranscription);
    editButton.onclick = function () {
        sendScore(this, true);
    }
    editButton.setAttribute('data-bs-toggle', 'popover');
    editButton.setAttribute('data-bs-trigger', 'focus');
    editButton.setAttribute('data-bs-content', 'Resposta Editada');

    divResponse.appendChild(editButton);

    const iconAdd = document.createElement('i');
    iconAdd.classList.add('bi', 'bi-floppy2-fill');

    saveButton.appendChild(iconAdd);

    const iconEdit = document.createElement('i');
    iconEdit.classList.add('bi', 'bi-pencil-fill');

    editButton.appendChild(iconEdit);

    if (score != null) {
        saveButton.classList.add('visually-hidden');
    } else {
        editButton.classList.add('visually-hidden');
    }

    loading.classList.add('visually-hidden');
    lista.appendChild(li);

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

}

function addCardAudio(idAudio, urlAudio, idTranscription, template) {
    const lista = document.getElementById('lista-cards');
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
    divResponse.setAttribute('id', 'div-response');

    li.appendChild(divResponse);

    const input = document.createElement("input");
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Escreva aqui');
    input.setAttribute('required', '');
    if (template != null) {
        input.value = template;
    }

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

    const iconAdd = document.createElement('i');
    iconAdd.classList.add('bi', 'bi-floppy2-fill');

    saveButton.appendChild(iconAdd);


    const editButton = document.createElement('button');
    editButton.classList.add('input-group-text', 'bg-body-secondary');
    editButton.onclick = function () {
        editTranscription(this);
    }
    editButton.setAttribute('data-bs-toggle', 'popover');
    editButton.setAttribute('data-bs-trigger', 'focus');
    editButton.setAttribute('data-bs-content', 'Resposta Editada');

    divResponse.appendChild(editButton);


    const iconEdit = document.createElement('i');
    iconEdit.classList.add('bi', 'bi-pencil-fill');

    editButton.appendChild(iconEdit);

    if (idTranscription != null) {
        editButton.setAttribute('id', idTranscription);
        saveButton.classList.add('visually-hidden');
    } else {
        editButton.classList.add('visually-hidden');
    }

    loading.classList.add('visually-hidden');
    lista.appendChild(li);
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

}

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

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






