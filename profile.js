import app from "./firebaseconfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
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
            const noname = userData.username || 'Anonymous';
            const age = userData.age || 'Anonymous';
            const city = userData.city || 'Anonymous';
            const gender = userData.gender || 'Anonymous';
            const email = userData.email || 'Anonymous';
            document.getElementById("name").innerText = noname;
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

const edit = document.getElementById("done")
edit.addEventListener('click', () => {
    const username_edit = document.getElementById("username_edit").value
    const age_edit = document.getElementById("age_edit").value
    const city_edit = document.getElementById("city_edit").value
    const email_edit = document.getElementById("email_edit").value
    const gG = document.getElementsByName('GENDER_EDIT');
    var gender_edit = "";
    for (let i = 0; i < gG.length; i++) {
        if (gG[i].checked) {
            gender_edit = gG[i].value;
        }
    }
const profileObj = {
    username: username_edit,
    age: age_edit,
    city: city_edit,
    gender: gender_edit,
    email: email_edit
};
console.log(profileObj);
const reference = ref(db, 'users/' + userId);
console.log(reference);
set(reference, profileObj)
    .then(() => {
        console.log("Successfull");
    })
    .catch((error) => {
        console.error(error);
    });

});

const edit_show = document.getElementById("edit")
edit_show.addEventListener('click', () => {
    document.getElementById("name_edit").value = noname;
    document.getElementById("age_edit").value = age;
    document.getElementById("email_edit").value = email;
    document.getElementById("city_edit").value = city;
})