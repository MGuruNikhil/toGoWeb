import app from "../firebaseconfig.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
import { getDatabase, ref, set, onValue, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"
const auth = getAuth(app)
const database = getDatabase(app)
var userId = null
var guide_userId = null
var roomId = null
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in")
        userId = user.uid
        console.log(userId)
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        guide_userId = urlParams.get('guide')
        roomId = (userId<guide_userId)?(userId+"-"+guide_userId):(guide_userId+"-"+userId)
        onValue(ref(database, '/users/' + guide_userId), (snapshot) => {
            const userData = snapshot.val() || {}
            const noname = userData.username || 'chat person name'
            const pfp = userData.pfp || '../togo.png'
            document.getElementById("chat-name").innerText = noname;
            document.getElementById("pfp").src = pfp
        }, {
            onlyOnce: true
        });
        onValue(ref(database,'chat/'+roomId),(snapshot)=>{
            const chatRoom = document.getElementById("chat-room");
            chatRoom.innerHTML="";
            const data = snapshot.val();
            Object.keys(data).forEach((key) => {
                const childData = data[key];
                const from = childData.from;
                const to = childData.to;
                const msg = childData.msg;
                const newMsg = document.createElement('div');
                newMsg.classList.add("bg-opacity-50","rounded-xl","bg-[#E5E3E4]","px-2","py-3","text-[1em]");
                if(from==userId) {
                    newMsg.classList.add("place-self-end");
                }
                else {
                    newMsg.classList.add("place-self-start");
                }
                newMsg.innerHTML=msg;
                chatRoom.appendChild(newMsg)
            });
        });
    } else {
        window.location.href = `../login`;
    }
});

const profile = document.getElementById("profile")
profile.addEventListener('click', () => {

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    guide_userId = urlParams.get('guide')

    window.location.href = "../guide/index.html?uid=" + guide_userId

})

const send = document.getElementById("send")
send.addEventListener('click', () => {
    console.log(roomId)
    let time = serverTimestamp()
    const msg = document.getElementById("msg_input").value
    const newMessageKey = push(ref(database , 'chat/'+roomId))
    set(newMessageKey, {
        from: userId,
        to: guide_userId,
        msg: msg,
        time: time
    });
    document.getElementById("msg_input").value = ""
})