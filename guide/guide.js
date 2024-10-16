import app from "../firebaseconfig.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"
const auth = getAuth(app)
const database = getDatabase(app)
var userId = null
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const guide_userId = urlParams.get('uid')
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in")
        userId = user.uid
        render_url()
    } else {
        window.location.href = `https://mgurunikhil.github.io/toGoWeb/login`
    }
});

function render_url(){
    console.log(guide_userId);
    onValue(ref(database, '/users/' + guide_userId), (snapshot) => {
        const userData = snapshot.val() || {};
        console.log(userData)
        const pfp = userData.pfp || 'https://mgurunikhil.github.io/toGoWeb/togo.png'
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
        document.getElementById("loading-screen").style.display = "none"
    }, {
        onlyOnce: true
    })
}

const book = document.getElementById('book');
book.addEventListener('click', booksomeone);
function booksomeone() {
    window.location.href = 'https://mgurunikhil.github.io/toGoWeb/book/index.html?guide=' + guide_userId
}

const chat = document.getElementById('chat');
chat.addEventListener('click', chatsomeone);
function chatsomeone() {

    let myChatMems = null;
    onValue(ref(database, '/users/' + userId), (snapshot) => {
        const myData = snapshot.val() || {};
        console.log(myData)
        myChatMems = myData.chats||"";
    }, {
        onlyOnce: true
    })

    console.log(myChatMems)
    if(myChatMems==''||myChatMems=='empty'||myChatMems==null) {
        myChatMems = guide_userId;
    }
    else {
        myChatMems = myChatMems + ',' + guide_userId;
    }
    console.log(myChatMems)

    update(ref(database,'/users/' + userId), {
        chats: myChatMems,
    })
    .then(() => {
        console.log(myChatMems);
    })
    .catch((error) => {
        console.error('Error updating string:', error);
    });

    onValue(ref(database,'/users/' + userId),(snapshot)=>{
        const myData = snapshot.val()||{};
        console.log(myData)
    },{
        onlyOnce: true
    })

    let theirChatMems = null;
    onValue(ref(database,'/users/' + guide_userId),(snapshot)=>{
        const theirData = snapshot.val()||{};
        console.log(theirData)
        theirChatMems = theirData.chats||'';
    },{
        onlyOnce: true
    })

    console.log(theirChatMems)
    if(theirChatMems==''||theirChatMems=='empty'||theirChatMems==null) {
        theirChatMems = userId;
    }
    else {
        theirChatMems = theirChatMems + ',' + userId;
    }
    console.log(theirChatMems)

    update(ref(database,'/users/' + guide_userId), {
        chats: theirChatMems,
    })
    .then(() => {
        console.log(theirChatMems);
    })
    .catch((error) => {
        console.error('Error updating string:', error);
    });

    onValue(ref(database,'/users/' + guide_userId),(snapshot)=>{
        const theirData = snapshot.val()||{};
        console.log(theirData)
    },{
        onlyOnce: true
    })
    
    window.location.href = 'https://mgurunikhil.github.io/toGoWeb/chat/index.html?guide=' + guide_userId
}

