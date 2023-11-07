import app from "./firebaseconfig.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
var userId = null;
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "home.html";
    }
    else {
        //nothing to do
    }
});
const signUp = document.querySelector('#signup');
signUp.addEventListener('click', createUser);
var display = document.getElementById('result');
function createUser() {
    const mail = document.getElementById('email');
    const email = mail.value;
    const pWord = document.getElementById('password');
    const password = pWord.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            userId = user.uid;
            console.log(user);
            window.location.href = `home.html`;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            display.innerHTML = "something went wrong";
            console.log(errorCode);
            console.log(errorMessage);
        });
}
const login = document.querySelector('#login');
login.addEventListener('click', userLogin);
function userLogin() {
    const mail = document.getElementById('email');
    const email = mail.value;
    const pWord = document.getElementById('password');
    const password = pWord.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            userId = user.uid;
            console.log(user);
            window.location.href = `home.html`;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            display.innerHTML = "Something went wrong";
            console.log(errorCode);
            console.log(errorMessage);
        });
}