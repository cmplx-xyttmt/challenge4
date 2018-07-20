/**
 * This file contains the code for consuming the ride offers api endpoint
 * and some extra stuff to make the page come to life.
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
            console.log("There's a problem: \n" + error);
        })
        .then(function (myJson) {
            action(myJson);
        });
}


// let onload = function () {
//
// };

/**
 * Shows loading gif (used when determining if user is logged in)
 * */
let toggleDisplay = function (showInfo) {
    let loading = document.getElementById("loading");
    let heading = document.getElementById("heading");
    let offerButtons = document.getElementById("offer-buttons");
    if (showInfo) {
        loading.style.display = "none";
        heading.style.display = "block";
        offerButtons.style.display = "block";
    }
    else {
        loading.style.display = "block";
        heading.style.display = "none";
        offerButtons.style.display = "none";
    }
};

// This function logs the user out by replacing the token with some random stuff.
let logout = function () {
    localStorage.setItem('token', 'gfiaiug');
    window.location.replace('index.html');
};
