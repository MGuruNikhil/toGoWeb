import app from "./firebaseconfig.js"
import { getAuth, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"
const auth = getAuth(app)
const database = getDatabase(app)
var userId = null
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in")
        userId = user.uid
        console.log(userId)
        onValue(ref(database, '/users/' + userId), (snapshot) => {
            const userData = snapshot.val() || {}
            const pfp = userData.pfp || 'togo.png'
            const noname = userData.username || 'Anonymous'
            const age = userData.age || 'Anonymous'
            const city = userData.city || 'Anonymous'
            const language = userData.language || 'Anonymous'
            const gender = userData.gender || 'Anonymous'
            const usertype = userData.usertype || 'Anonymous'
            document.getElementById("pfp").src = pfp
            document.getElementById("name").innerText = noname
            document.getElementById("age").innerText = age
            document.getElementById("gender").innerText = gender
            document.getElementById("city").innerText = city
            document.getElementById("language").innerText = language
            document.getElementById("usertype").innerText = usertype
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
    const pfp_edit = document.getElementById("pfp_edit").value
    const username_edit = document.getElementById("username_edit").value
    const age_edit = document.getElementById("age_edit").value
    const city_edit = document.getElementById("city_edit").value
    const usertype_edit = document.getElementById("usertype_edit").value
    const gG = document.getElementsByName('GENDER_EDIT')
    var gender_edit = ""
    for (let i = 0; i < gG.length; i++) {
        if (gG[i].checked) {
            gender_edit = gG[i].value
        }
    }    
    const lL = document.getElementsByName('languages_edit')
    var language_edit = [];
    for (let i = 0; i < lL.length; i++) {
        if (lL[i].checked) {
            language_edit.push(lL[i].value)
        }
    }
    const profileObj = {
        pfp: pfp_edit,
        username: username_edit,
        age: age_edit,
        city: city_edit,
        gender: gender_edit,
        language: language_edit,
        usertype: usertype_edit,
    };
    console.log(profileObj);
    const reference = ref(database, 'users/' + userId);
    console.log(reference);
    set(reference, profileObj)
        .then(() => {
            console.log("Successfull");
        })
        .catch((error) => {
            console.error(error);
        });
});

const getciti = document.getElementById("edit")
getciti.addEventListener('click', () => {
    onValue(ref(database, '/city'), (snapshot) => {
        const citieslist = snapshot.val() || "--select city--";
        const cities = citieslist.cities.split(',');
        const selectElement = document.getElementById('city_edit');
    
        cities.forEach((index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = index;
            selectElement.appendChild(option);
        })

        selectElement.value = not_so_city;
    
        selectElement.classList.add('bg-[#f9ac40]', 'rounded-lg', 'focus:ring-[#ff534f]', 'py-1', 'px-2.5');
        selectElement.setAttribute('required', 'true');
    
    }, {
        onlyOnce: true
    });
})

onValue(ref(database, '/language'), (snapshot) => {
    const languageslist = snapshot.val()
    const languages = languageslist.languages.split(',')
    const selectElement = document.getElementById('languages_edit')
    
    languages.forEach((index) => {
        const selectElementdiv = document.createElement('div')
        const language = document.createElement('input')
        language.type = "checkbox"
        language.value = index
        language.name = 'languages_edit'
        const language_name = document.createElement('label')
        language_name.textContent = index
        language_name.htmlFor = language
        language_name.classList.add("mx-2")
        selectElementdiv.appendChild(language)
        selectElementdiv.appendChild(language_name)
        selectElement.appendChild(selectElementdiv)
    })

    selectElement.setAttribute('required', 'true')

}, {
    onlyOnce: true
})

const deleteBtn = document.getElementById('delete');
deleteBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    remove(ref(database, 'users/' + user.uid))
    .then(function () {
        // Delete
        console.log('you have successfully deleted');
    })
    .catch(function (error) {
        console.error("Error removing item: ", error);
    });
    deleteUser(user).then(() => {
        // User deleted.
      }).catch((error) => {
        // An error ocurred
        // ...
      });
});
