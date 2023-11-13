import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import app from "../firebaseconfig.js";
const auth = getAuth(app);
const database = getDatabase(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "../";
    }
    else {
        //nothing to do
    }
});

var display = document.getElementById('result');
const signUp = document.querySelector('#signup');
signUp.addEventListener('click', createUser);

async function createUser() {
    const pfp = document.getElementById("pfp").value || '../togo.jpeg'
    const mail = document.getElementById('email')
    const email = mail.value
    const pWord = document.getElementById('password')
    const password = pWord.value
    const username = document.getElementById("username").value
    const age = document.getElementById("age").value
    const city = document.getElementById("city").value
    const lL = document.getElementsByName('languages')
    var language = []
    for (let i = 0; i < lL.length; i++) {
        if (lL[i].checked) {
            language.push(lL[i].value)
        }
    }
    const gG = document.getElementsByName('GENDER')
    var gender = ""
    for (let i = 0; i < gG.length; i++) {
        if (gG[i].checked) {
            gender = gG[i].value;
        }
    }
    const usertype = document.getElementById('usertype').value
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const userId = user.uid;
            console.log(user);
            const profileObj = {
                pfp: pfp,
                username: username,
                age: age,
                city: city,
                gender: gender,
                language: language,
                usertype: usertype
            };
            console.log(profileObj);
            const reference = ref(database, 'users/' + userId);
            console.log(reference);
            set(reference, profileObj)
                .then(() => {
                    console.log("Successfull");
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            display.innerHTML = "something went wrong: " + errorMessage;
            console.log(errorCode);
            console.log(errorMessage);
        });
}

onValue(ref(database, '/city'), (snapshot) => {
    const citieslist = snapshot.val() || "--select city--";
    const cities = citieslist.cities.split(',');
    const selectElement = document.getElementById('city');

    cities.forEach((index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = index;
        selectElement.appendChild(option);
    })

    selectElement.classList.add('bg-[#f9ac40]', 'rounded-lg', 'focus:ring-[#ff534f]', 'py-1', 'px-2.5');
    selectElement.setAttribute('required', 'true');

}, {
    onlyOnce: true
})

onValue(ref(database, '/language'), (snapshot) => {
    const languageslist = snapshot.val() || "--select city--"
    const languages = languageslist.languages.split(',')
    const selectElement = document.getElementById('languages')
    
    languages.forEach((index) => {
        const selectElementdiv = document.createElement('div')
        const language = document.createElement('input')
        language.type = "checkbox"
        language.value = index
        language.name = 'languages'
        const language_name = document.createElement('label')
        language_name.textContent = index
        language_name.htmlFor = language
        language_name.classList.add("mx-2")
        selectElementdiv.appendChild(language)
        selectElementdiv.appendChild(language_name)
        selectElement.appendChild(selectElementdiv)
    })

    selectElement.setAttribute('required', 'true');

}, {
    onlyOnce: true
})
