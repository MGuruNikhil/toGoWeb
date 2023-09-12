import  app  from "./firebaseconfig.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
const database = getDatabase(app);
const auth = getAuth(app);
var user = null;
var userId = null;
const signupBtn = document.querySelector("#signup");
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
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
            user = userCredential.user;
            userId = user.uid;
            console.log(user);
            const profileObj = {
                username: username,
                age: age,
                city: city,
                gender: gender,
                email: email
            };
            const reference = ref(database, 'users/' + userId);
            set(reference, profileObj)
                .then(() => {
                    console.log("Successfull");
                    // Profile data saved successfully
                    window.location.href = `home.html?data=${encodeURIComponent(userId)}`;
                })
                .catch((error) => {
                    console.error(error);
                });
            // alert("You are successfully signed in , your uid is " + userId);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // display.innerHTML = "Something went wrong";
            alert("Something went wrong");
            console.log(errorCode);
            console.log(errorMessage);
        });
});
const loginBtn = document.querySelector("#login");
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const mail = document.getElementById("loginEmail");
    const email = mail.value;
    const pWord = document.getElementById("loginPass");
    const password = pWord.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            user = userCredential.user;
            userId = user.uid;
            console.log(user);
            // alert("You are successfully logged in , your uid is " + userId);
            window.location.href = `home.html?data=${encodeURIComponent(userId)}`;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Something went wrong");
            console.log(errorCode);
            console.log(errorMessage);
        });
});
export {userId};