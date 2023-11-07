import app from "./firebaseconfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
const auth = getAuth(app);
const db = getDatabase(app);
var userId = null;
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in");
        userId = user.uid;
        console.log(userId);
        onValue(ref(db, '/users/' + userId), (snapshot) => {
            const userData = snapshot.val() || {};
            const name = userData.username || 'Anonymous';
            const age = userData.age || 'Anonymous';
            const city = userData.city || 'Anonymous';
            const gender = userData.gender || 'Anonymous';
            const email = userData.email || 'Anonymous';
            document.getElementById("name").innerText = name;
            document.getElementById("age").innerText = age;
            document.getElementById("email").innerText = email;
            document.getElementById("gender").innerText = gender;
            document.getElementById("city").innerText = city;
        }, {
            onlyOnce: true
        });
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