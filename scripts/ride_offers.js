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
            //TODO: Add action to perform when the request fails.
            console.log("There's a problem: \n" + error);
        })
        .then(function (myJson) {
            action(myJson);
        });
}

/**
 * This function is run when the page loads.
 * It makes a request for the rides to the api.
 * If the user is authorized, it displays the rest of the page.
 * Otherwise, it redirects to the landing page.
 * */
let onload = function () {
    toggleDisplay(false);
    let token = localStorage.getItem('token');
    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/rides';

    let action = function (json) {
        if (json['error']) {
            window.location.replace('index.html');
        }
        else {
            toggleDisplay(true);
            //TODO: Add code for populating the page with ride offers
        }
    };

    if (token) {
        let headers = new Headers({
            'Authorization': token
        });

        fetchAPI(url, 'GET', headers, null, action);
    }
    else {
        window.location.replace('index.html');
    }
};

/**
 * Shows loading gif (used when determining if user is logged in)
 * */
let toggleDisplay = function (showInfo) {
    let loading = document.getElementById("loading");
    let heading = document.getElementById("heading");
    let offerButtons = document.getElementById("offer-buttons");
    if (showInfo) {
        loading.style.display = "none";
        heading.style.display = "table-row";
        offerButtons.style.display = "table-row";
    }
    else {
        loading.style.display = "table-row";
        heading.style.display = "none";
        offerButtons.style.display = "none";
    }
};

// This function logs the user out by replacing the token with some random stuff.
let logout = function () {
    localStorage.setItem('token', 'gfiaiug');
    window.location.replace('index.html');
};
