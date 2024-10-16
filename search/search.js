import app from "../firebaseconfig.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
import { getDatabase, ref, onValue, orderByChild, query, equalTo } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"
const auth = getAuth(app)
const database = getDatabase(app)

var userId = null
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in")
        userId = user.uid
        console.log(userId)
        document.getElementById("loading-screen").style.display = "none"
    } else {
        window.location.href = `https://mgurunikhil.github.io/toGoWeb/login`
    }
});

// Get references to HTML elements
const searchButton = document.getElementById("searchButton")
const cityInput = document.getElementById("city")
const searchResults = document.getElementById("searchResults")


// Handle form submission
function search() {

    const cityToSearch = cityInput.value.trim();

    if (cityToSearch === "") {
        document.getElementById("title").innerHTML = "please enter a city name"
        return
    }

    // Search for users with matching city
    searchUsersByCity(cityToSearch)
}

searchButton.addEventListener("click", () => {
    document.getElementById("loading-screen").style.display = "flex"
    search()
})
// Function to search users by city
function searchUsersByCity(city) {
    // Clear previous search results
    searchResults.innerHTML = ""
    const usersRef = ref(database, '/users')
    // const query = orderByChild(ref(usersRef), 'city').equalTo(city)
    const filterQuery = query(usersRef, orderByChild('city'), equalTo(city))
    // Listen for value changes
    onValue(filterQuery, (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val()
            const username = document.getElementById("username").value
            const age = document.getElementById("age").value
            const lL = document.getElementsByName('languages')
            var language = []
            for (let i = 0; i < lL.length; i++) {
                if (lL[i].checked) {
                    language.push(lL[i].value)
                }
            }
            const gG = document.getElementsByName('GENDER')
            var gender = ""
            for (let i = 0; i < gG.length; i++) {
                if (gG[i].checked) {
                    gender = gG[i].value;
                }
            }
            
            // Iterate through matching users and display their profiles
            for (const userId in userData) {
                const user = userData[userId]
                // displayUserProfile(user,userId)
                if(user.usertype != "guide") {
                    delete userData[userId]
                }
            }

            if(username.trim().length!=0) {
                for (const userId in userData) {
                    const user = userData[userId]
                    // displayUserProfile(user,userId)
                    if(user.username != username) {
                        delete userData[userId]
                    }
                }
            }

            if(age.trim().length!=0) {
                for (const userId in userData) {
                    const user = userData[userId]
                    // displayUserProfile(user,userId)
                    if(user.age != age) {
                        delete userData[userId]
                    }
                }
            }

            if(gender.trim().length!=0) {
                for (const userId in userData) {
                    const user = userData[userId]
                    // displayUserProfile(user,userId)
                    if(user.gender != gender) {
                        delete userData[userId]
                    }
                }
            }

            if(language.length!=0) {
                for (const userId in userData) {
                    const user = userData[userId]
                    var count = 0
                    for(var i=0;i<language.length;i++) {
                        for(var j=0;j<user.language.length;j++) {
                            if(language[i]==user.language[j]) {
                                count++;
                                break;
                            }
                        }
                    }
                    if(count == 0) {
                        delete userData[userId]
                    }
                }
            }

            for(const userId in userData) {
                const user = userData[userId]
                displayUserProfile(user,userId)
            }

            if (searchResults.childElementCount === 0){
                searchResults.innerHTML = "<div class='border border-black rounded-lg p-2 m-2'>no guides found at "+city+"</div>"
            }
        } 
        document.getElementById("loading-screen").style.display = "none"
    });
}

// Function to display a user's profile
function displayUserProfile(user, userId) {
    const profileDiv = document.createElement("div")
    profileDiv.classList.add("user-profile")
    profileDiv.classList.add("border")
    profileDiv.classList.add("border-black")
    profileDiv.classList.add("rounded-lg")
    profileDiv.classList.add("p-2")
    profileDiv.classList.add("m-2")
    profileDiv.classList.add("cursor-pointer")
    profileDiv.onclick = () => {window.location.href='https://mgurunikhil.github.io/toGoWeb/guide/index.html?uid=' + userId}
    
    const nameElement = document.createElement("p")
    nameElement.textContent = `name: ${user.username}`
    
    const ageElement = document.createElement("p")
    ageElement.textContent = `age: ${user.age}`
    
    const genderElement = document.createElement("p")
    genderElement.textContent = `gender: ${user.gender}`
    
    // Add more elements for other profile details (e.g., email, mobile number)

    profileDiv.appendChild(nameElement)
    profileDiv.appendChild(ageElement)
    profileDiv.appendChild(genderElement)

    // Append the user profile to the search results
    searchResults.appendChild(profileDiv)
}

function render_url(){
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const pcity = urlParams.get('city')
    document.getElementById("city").value = pcity
    if(pcity !== ''){
        search()
    }
}

onValue(ref(database, '/city'), (snapshot) => {
    const citieslist = snapshot.val() || "--select city--"
    const cities = citieslist.cities.split(',')
    const selectElement = document.getElementById('city')

    cities.forEach((index) => {
        const option = document.createElement('option')
        option.value = index
        option.textContent = index
        selectElement.appendChild(option)
    })

    selectElement.classList.add('bg-[#f9ac40]', 'rounded-lg', 'focus:ring-[#ff534f]', 'py-1', 'px-2.5')
    selectElement.setAttribute('required', 'true')
    render_url()

}, {
    onlyOnce: true
})

onValue(ref(database, '/language'), (snapshot) => {
    const languageslist = snapshot.val()
    const languages = languageslist.languages.split(',')
    const selectElement = document.getElementById('languages')
    
    languages.forEach((index) => {
        const selectElementdiv = document.createElement('div')
        const language = document.createElement('input')
        language.type = "checkbox"
        language.value = index
        language.name = 'languages'
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