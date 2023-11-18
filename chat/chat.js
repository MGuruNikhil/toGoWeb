import app from "../firebaseconfig.js"
import { getAuth, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"
const auth = getAuth(app)
const database = getDatabase(app)
var userId = null
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in")
        userId = user.uid
        console.log(userId)
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        var guide_userId = urlParams.get('guide')
        onValue(ref(database, '/users/' + guide_userId), (snapshot) => {
            const userData = snapshot.val() || {}
            const noname = userData.username || 'chat person name'
            const pfp = userData.pfp || '../togo.png'
            document.getElementById("chat-name").innerText = noname;
            document.getElementById("pfp").src = pfp

        }, {
            onlyOnce: true
        });
    } else {
        window.location.href = `../login`;
    }
});

const profile = document.getElementById("profile")
profile.addEventListener('click', () => {

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    var guide_userId = urlParams.get('guide')

    window.location.href = "../guide/index.html?uid=" + guide_userId

})

const send = document.getElementById("send")
send.addEventListener('click', () => {
    room = document.getElementById("chat-room")
    msg = document.getElementById("msg_input").value
    urmsg = document.createElement("div")
    urmsg.innerText(msg)
    room.appendChild(urmsg)
    document.getElementById("msg_input").value = ""
})
