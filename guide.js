import app from "./firebaseconfig.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, onValue, orderByChild, query, equalTo } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
const auth = getAuth(app);
const db = getDatabase(app);

var userId = null;
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in");
        userId = user.uid;
        console.log(userId);
    } else {
        window.location.href = `login.html`;
    }
});

// Get references to HTML elements
const searchButton = document.getElementById("searchButton");
const cityInput = document.getElementById("city");
const searchResults = document.getElementById("searchResults");

// Handle form submission
searchButton.addEventListener("click", () => {

    const cityToSearch = cityInput.value.trim();

    if (cityToSearch === "") {
        alert("please enter a city name.");
        return;
    }

    // Search for users with matching city
    searchUsersByCity(cityToSearch);
});

// Function to search users by city
function searchUsersByCity(city) {
    // Clear previous search results
    searchResults.innerHTML = "";
    const usersRef = ref(db, '/users');
    // const query = orderByChild(ref(usersRef), 'city').equalTo(city);
    const filterQuery = query(usersRef, orderByChild('city'), equalTo(city));
    // Listen for value changes
    onValue(filterQuery, (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();

            // Iterate through matching users and display their profiles
            for (const userId in userData) {
                const user = userData[userId];
                if (user.city === city) {
                    displayUserProfile(user);
                }
            }
        } else {
            searchResults.innerHTML = "no matching guides found.";
        }
    });
}

// Function to display a user's profile
function displayUserProfile(user) {
    const profileDiv = document.createElement("div");
    profileDiv.classList.add("user-profile");
    profileDiv.style.cssText = `
        margin: 10px;
    `;

    const nameElement = document.createElement("p");
    nameElement.textContent = `name: ${user.username}`;

    const ageElement = document.createElement("p");
    ageElement.textContent = `age: ${user.age}`;

    const genderElement = document.createElement("p");
    genderElement.textContent = `gender: ${user.gender}`;

    // Add more elements for other profile details (e.g., email, mobile number)

    profileDiv.appendChild(nameElement);
    profileDiv.appendChild(ageElement);
    profileDiv.appendChild(genderElement);

    // Append the user profile to the search results
    searchResults.appendChild(profileDiv);
}