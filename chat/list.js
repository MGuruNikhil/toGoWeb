import app from "../firebaseconfig.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"
const auth = getAuth(app)
const database = getDatabase(app)
var userId = null
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("logged in");
        userId = user.uid;
        console.log(userId);
        onValue(ref(database, '/users/' + userId), (snapshot) => {
            const userData = snapshot.val()||{};
            console.log(userData)
            const chatMems = userData.chats||'';
            const chatList = document.getElementById("chatList");
            chatList.innerHTML="";
            if(chatMems == ""||chatMems=='empty') {
                chatList.innerHTML="No chats so far...";
            }
            else {
                const mems = chatMems.split(',');
                mems.forEach((memId) => {
                    onValue(ref(database,'/users/'+memId),(snapshot)=>{
                        const memData = snapshot.val();
                        const listItem = document.createElement("div");
                        listItem.classList.add('w-full','cursor-pointer','hover:bg-opacity-50','border-2','rounded-xl','border-[#E5E3E4]','px-2','py-3','text-[2em]','text-[#E5E3E4]','hover:text-[#5BA199]','hover:bg-[#E5E3E4]','listItem');
                        listItem.innerText=memData.username;
                        listItem.setAttribute('uid',memId);
                        chatList.appendChild(listItem);
                    })
                });
            }
        }, {
            onlyOnce: true
        });
    } else {
        window.location.href = `../login`;
    }
});

document.getElementById("chatList").addEventListener('click',function(e){
    if(e.target.classList.contains('listItem')) {
        const theirId = e.target.getAttribute('uid');
        window.location.href = './index.html?guide='+theirId;
    }
})
