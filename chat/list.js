import app from "../firebaseconfig.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
import { getDatabase, ref, set, onValue, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"
const auth = getAuth(app)
const database = getDatabase(app)
var userId = null
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("logged in");
        userId = user.uid;
        console.log(userId);
        onValue(ref(database, '/users/' + userId+'/chats'), (snapshot) => {
            const chatMems = snapshot.val()||"";
            const chatList = document.getElementById("chatList");
            chatList.innerHTML="";
            if(chatMems == "") {
                chatList.innerHTML="No chats so far...";
            }
            else {
                const mems = chatMems.split(',');
                mems.forEach((memId) => {
                    onValue(ref(database,'/users/'+memId+'/username'),(snapshot)=>{
                        const listItem = document.createElement("div");
                        listItem.classList.add('w-full','hover:bg-opacity-50','border-2','rounded-xl','border-[#E5E3E4]','px-2','py-3','text-[2em]','text-[#E5E3E4]','hover:text-[#5BA199]','hover:bg-[#E5E3E4]');
                        listItem.innerText=snapshot.val();
                        chatList.appendChild(listItem);
                    })
                });
            }
        }, {
            onlyOnce: true
        });
    } else {
        window.location.href = `login`;
    }
});