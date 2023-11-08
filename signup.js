import app from "./firebaseconfig.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
const auth = getAuth(app);
const database = getDatabase(app);
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         window.location.href = "home.html";
//     }
//     else {
//         //nothing to do
//     }
// });

var display = document.getElementById('result');
const signUp = document.querySelector('#signup');
signUp.addEventListener('click', createUser);

function createUser() {
    const mail = document.getElementById('email');
    const email = mail.value;
    const pWord = document.getElementById('password');
    const password = pWord.value;
    const username = document.getElementById("username").value;
    const age = document.getElementById("age").value;
    const city = document.getElementById("city").value;
    const gG = document.getElementsByName('GENDER');
    var gender = "";
    for (let i = 0; i < gG.length; i++) {
        if (gG[i].checked) {
            gender = gG[i].value;
        }
    }
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const userId = user.uid;
            console.log(user);
            const profileObj = {
                username: username,
                age: age,
                city: city,
                gender: gender,
                email: email
            };
            console.log(profileObj);
            const reference = ref(database, 'users/' + userId);
            console.log(reference);
            set(reference, profileObj)
                .then(() => {
                    console.log("Successfull");
                    window.location.href = "home.html";
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            display.innerHTML = "something went wrong";
            console.log(errorCode);
            console.log(errorMessage);
        });
}
