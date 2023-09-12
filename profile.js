import  app  from "./firebaseconfig.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('data');
const db = getDatabase(app);
onValue(ref(db, '/users/' + userId), (snapshot) => {
    const userData = snapshot.val() || {};
    const name = userData.username || 'Anonymous';
    const age = userData.age || 'Anonymous';
    const city = userData.city || 'Anonymous';
    const gender = userData.gender || 'Anonymous';
    const email = userData.email || 'Anonymous';
    document.getElementById("name").innerText=name;
    document.getElementById("age").innerText=age;
    document.getElementById("email").innerText=email;
    document.getElementById("gender").innerText=gender;
    document.getElementById("city").innerText=city;
}, {
    onlyOnce: true
});

