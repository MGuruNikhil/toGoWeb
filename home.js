import app from "./firebaseconfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
const auth = getAuth(app);
var userId = null;
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in");
        userId = user.uid;
        console.log(userId);
    } else {
        window.location.href = `login.html`;
    }
});

const logOut = document.getElementById("logout");
logOut.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.log(error);
    });
});