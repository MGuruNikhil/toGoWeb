import app from "../firebaseconfig.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
var userId = null;
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "../";
    }
    else {
        document.getElementById("loading-screen").style.display = "none"
    }
});

var display = document.getElementById('result');
const logIn = document.querySelector('#login');
logIn.addEventListener('click', userLogin);
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
            window.location.href = `../`;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            display.innerHTML = "something went wrong: "+errorMessage;
            console.log(errorCode);
            console.log(errorMessage);
        });
}