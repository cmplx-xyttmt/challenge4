/**
 * This file contains common functions that I use across the other files.
 * */

// This function handles all the fetching from the API and returns the json response
function fetchAPI(url, method, headers, body, action) {
    if (!('fetch' in window)) {
        console.log('Fetch API not found');
        return;
    }

    fetch(url,{
        method: method,
        headers: headers,
        body: body
    })
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            //TODO: Add action to perform when the request fails.
            console.log("There's a problem: \n" + error);
        })
        .then(function (myJson) {
            action(myJson);
        });
}

//Function to consume the get user endpoint
let loadProfile = function () {
    let username = localStorage.getItem('username');
    let token = localStorage.getItem('token');

    let url = "https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/user/" + username;
    profile.render("", "", "");

    let loading = dots('profile-box-body', 'Loading profile ');

    let action = function (json) {
        window.clearInterval(loading);

        if (json['error']) {
            let profileMessage = document.getElementById('profile-box-body');
            profileMessage.innerHTML = 'Failed to load profile';
        }
        else {
            profile.render(json['username'], json['rides_taken'], json['rides_given']);
        }
    };

    if (token) {
        let headers = new Headers({
            'Authorization': token
        });

        fetchAPI(url, 'GET', headers, null, action);
    }
    else window.location.replace('index.html');
};

//Render user profile
function Profile() {
    this.render = function (name, ridesTaken, ridesGiven) {
        let winW = window.innerWidth;
        let winH = window.innerHeight;
        let dialogOverlay = document.getElementById('dialog-overlay');
        let profileBox = document.getElementById('profile-box');
        dialogOverlay.style.display = "block";
        dialogOverlay.style.height = winH + "px";
        profileBox.style.left = (winW/2) - (550*.5) + "px";
        profileBox.style.top = "100px";
        profileBox.style.display = "block";
        document.getElementById("name").innerHTML = name;
        document.getElementById("ridesTaken").innerHTML = ridesTaken;
        document.getElementById("ridesGiven").innerHTML = ridesGiven;
        document.getElementById('profile-box-foot').innerHTML = '<a class="button-dialog" onclick="profile.ok()">CLOSE</a>';
    };

    this.ok = function () {
        document.getElementById('profile-box').style.display = "none";
        document.getElementById('dialog-overlay').style.display = "none";
    }
}

let profile = new Profile();

//Show loading dots
let dots = function (elemId, status, changeSize) {
    let message = document.getElementById(elemId);
    message.style.color = "orange";
    if (changeSize) message.style.fontSize = "70%";
    message.innerHTML = status + " ";
    return window.setInterval(function() {
        if (message.innerHTML.length > status.length + 3)
            message.innerHTML = status + " ";
        else
            message.innerHTML += '.';
    }, 500);
};

// This function logs the user out by replacing the token with some random stuff.
let logout = function () {
    localStorage.setItem('token', 'gfiaiug');
    window.location.replace('index.html');
};