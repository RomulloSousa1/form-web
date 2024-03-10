import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getFirestore, collection, setDoc, updateDoc, doc, getDoc, getDocs, addDoc, arrayUnion, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';


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
const userRef = doc(firestore, 'users', dataUser.id);


function verifierForm() {
    const form = window.location.search.split('=')[1];

    if (form == 1) {
        setCardsAudio();
    } else {
        setCardsTranscriptions();
    }
}


async function sendScore(element, update) {
    const transcriptionRef = doc(firestore, 'transcriptions', element.id);
    await updateDoc(transcriptionRef, {
        score:  parseInt(element.parentElement.children[0].value),
    }).then((response) => {
        if (update == false) {
            element.parentElement.children[2].classList.remove('visually-hidden');
            element.classList.add('visually-hidden');
        }
    });
   
}

async function editTranscription(element) {
    const docRef = doc(firestore, 'transcriptions', element.id);
    await updateDoc(docRef, {
        answer: element.parentElement.children[0].value,
    });
}


async function sendTranscription(element) {
    const collectionRef = collection(firestore, "transcriptions");

    await addDoc(collectionRef, {
        id: null,
        audioId: element.id,
        userId: dataUser.id,
        answer: element.parentElement.children[0].value,
        score: null,
    }).then((docRef) => {
        updateDoc(doc(firestore, "transcriptions", docRef.id), {
            id: docRef.id,
        })
        updateDoc(userRef, {
            transcriptions: arrayUnion(doc(firestore, "transcriptions", docRef.id)),
        })
        element.parentElement.children[2].setAttribute('id', docRef.id);
        element.parentElement.children[2].classList.remove('visually-hidden');
        element.classList.add('visually-hidden');
    });
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
            console.log(doc.data());
            transcriptions.push(doc.data());
        })
    })
    return transcriptions;
}

async function setCardsAudio() {
    const audiosList = await getAllAudios();
    const userTranscription = await getAllTranscriptions();

    for (var x = 0; x < audiosList.length; x++) {
        console.log(audiosList[x]);
        var hasTranscription = false;
        console.log(hasTranscription);
        if (userTranscription.length > 0) {
            for (var y = 0; y < userTranscription.length; y++) {
                if (userTranscription[y].audioId == audiosList[x].id) {
                    hasTranscription = true;
                    break;
                }
            }
            if (hasTranscription == true) {
                addCardAudio(audiosList[x].id, audiosList[x].url, userTranscription[y].id, userTranscription[y].answer);
            } else {
                addCardAudio(audiosList[x].id, audiosList[x].url,);
            }
        }
        else {
            addCardAudio(audiosList[x].id, audiosList[x].url,);
        }

    }
}

async function setCardsTranscriptions() {
    const audiosList = await getAllAudios();
    const userTranscription = await getAllTranscriptions();

    addTitleTranscription();

    for (var x = 0; x < userTranscription.length; x++) {
        var hasTranscription = false;
        for (var y = 0; y < audiosList.length; y++) {

            if (audiosList[y].id == userTranscription[x].audioId) {
                hasTranscription = true;
                break;
            }
        }
        if (hasTranscription) {
            addCardTranscription(userTranscription[x].id, userTranscription[x].answer, audiosList[y].template, userTranscription[x].score);
        }
    }

}

function addTitleTranscription() {
    const instruction = document.getElementById('instruction');
    instruction.innerHTML = "<strong>Instruções:</strong><br><br> Dê uma nota de <strong>0 a 100</strong> para a similaridade entre os audios e as transcrições, considerando as trocas e distorções dos fonemas, sendo 0 para todos os fonemas com trocas e/ou distorções e 100 para todos os fonemas corretos.<br> <br>Exemplos:<br><br>bola - bola(100)<br>bola - cola(80)<br>bola - cole(55)<br>bola - cale(20)<br>bola - caso(0)";
    instruction.classList.remove('visually-hidden');
}


function addCardTranscription(idTranscription, answer, template, score) {
    const lista = document.getElementById('lista-cards');
    const loading = document.getElementById('loading');

    const li = document.createElement("li");
    li.classList.add('list-group-item', 'list-group-item-primary', 'rounded', 'my-2');



    const templateAndAnswer = document.createElement("div");
    templateAndAnswer.classList.add('w-100', 'my-2', 'mx-2', 'h6');
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
    saveButton.setAttribute('data-bs-content', 'Salvando Resposta');

    divResponse.appendChild(saveButton);

    const editButton = document.createElement('button');
    editButton.classList.add('input-group-text', 'bg-body-secondary');
    editButton.setAttribute('id', idTranscription);
    editButton.onclick = function () {
        sendScore(this, true);
    }
    editButton.setAttribute('data-bs-toggle', 'popover');
    editButton.setAttribute('data-bs-trigger', 'focus');
    editButton.setAttribute('data-bs-content', 'Editando resposta');

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
    divTitle.innerHTML = 'Transcreva o que <strong>EXATAMENTE</strong> você ouviu no áudio abaixo:';

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
    saveButton.setAttribute('data-bs-content', 'Salvando Resposta');

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
    editButton.setAttribute('data-bs-content', 'Editando Resposta');

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






