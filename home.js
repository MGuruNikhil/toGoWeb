import  app  from "./firebaseconfig.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('data');
const auth = getAuth(app);
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in");
    } else {
        window.location.href=`signin.html`;
    }
});
export { userId };