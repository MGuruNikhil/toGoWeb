import app from "../firebaseconfig.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
const auth = getAuth(app);
const database = getDatabase(app);
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in");
        render_url()
    } else {
        window.location.href = `../login`;
    }
});

function render_url(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var guide_userId = urlParams.get('uid');
    console.log(guide_userId);
    onValue(ref(database, '/users/' + guide_userId), (snapshot) => {
        const userData = snapshot.val() || {};
        const pfp = userData.pfp || '../togo.png'
        const noname = userData.username || 'Anonymous';
        const age = userData.age || 'Anonymous';
        const city = userData.city || 'Anonymous';
        const gender = userData.gender || 'Anonymous';
        const language = userData.language || 'Anonymous'
        const usertype = userData.usertype || 'Anonymous';            
        document.getElementById("pfp").src = pfp;
        document.getElementById("name").innerText = noname;
        document.getElementById("age").innerText = age;
        document.getElementById("gender").innerText = gender;
        document.getElementById("city").innerText = city;
        document.getElementById("language").innerText = language
        document.getElementById("usertype").innerText = usertype;
    }, {
        onlyOnce: true
    })
}

const book = document.getElementById('book');
book.addEventListener('click', booksomeone);
function booksomeone() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var guide_userId = urlParams.get('uid');
    window.location.href = '../book/index.html?guide=' + guide_userId
}

const chat = document.getElementById('chat');
chat.addEventListener('click', chatsomeone);
function chatsomeone() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var guide_userId = urlParams.get('uid');
    window.location.href = '../chat/index.html?guide=' + guide_userId
}

