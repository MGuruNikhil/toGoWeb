import app from "./firebaseconfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
const auth = getAuth(app);
const database = getDatabase(app);
var userId = null;
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("logged in");
        userId = user.uid;
        console.log(userId);
        onValue(ref(database, '/users/' + userId), (snapshot) => {
            const userData = snapshot.val() || {};
            const noname = userData.username || 'Anonymous';
            document.getElementById("name").innerText = noname;
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

onValue(ref(database, '/cityImgs'), (snapshot) => {
    const cityimgs = snapshot.val() || {};
    for (const city in cityimgs) {
        if (cityimgs.hasOwnProperty(city)) {
      
          const holdmetight = document.getElementById('imghold');
          const cityname = document.createElement('p');
          cityname.textContent = city;
          cityname.classList.add("text-center")
          cityname.classList.add("text-[#f9ac40]")
          cityname.classList.add("text-[10vw]")
          cityname.classList.add("lg:text-[100px]")
          cityname.style.textStroke = '2px black'
          cityname.style.WebkitTextStroke = '2px black'
      
          const citygallery = document.createElement('div');
          citygallery.style.backgroundImage = "url("+cityimgs[city]+")";
          citygallery.style.backgroundSize = "cover"
          citygallery.appendChild(cityname);
          citygallery.classList.add("p-2")
          citygallery.classList.add("flex")
          citygallery.classList.add("justify-center")
          citygallery.classList.add("items-center")
          citygallery.classList.add("h-[200px]")
          citygallery.classList.add("rounded-xl")
          citygallery.classList.add("flex")
          citygallery.classList.add("flex-col")
          citygallery.classList.add("cursor-pointer")
          
          citygallery.onclick = () => { window.location.href='search/index.html?city=' + city }
          
      
          holdmetight.appendChild(citygallery);
        }}
}, {
    onlyOnce: true
})

onValue(ref(database, '/city'), (snapshot) => {
    const citieslist = snapshot.val() || "--select city--";
    const cities = citieslist.cities.split(',');
    const selectElement = document.getElementById('city');

    cities.forEach((index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = index;
        selectElement.appendChild(option);
    })

    selectElement.classList.add('bg-[#f9ac40]', 'rounded-lg', 'focus:ring-[#ff534f]', 'py-1', 'px-2.5');
    selectElement.setAttribute('required', 'true');

}, {
    onlyOnce: true
})