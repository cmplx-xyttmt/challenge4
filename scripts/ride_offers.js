/**
 * This file contains the code for consuming the ride offers api endpoints
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
            let rides = json['rides'];
            if (rides.length === 0) {
                document.getElementById('heading').innerHTML = "No ride offers yet";
            }
            else {
                for (let i = 0; i < rides.length; i++) {
                    createRideHTML(rides[i]['name'], rides[i]['origin'], rides[i]['destination'], rides[i]['price']);
                }
            }
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
 * This function consumes the create ride offer api end point
 * */
let createRide = function () {
    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/users/rides';
    let token = localStorage.getItem('token');
    let loading = dots('Creating ride offer');

    let form = document.getElementById('form');
    let data = {
        'origin': form.elements[0].value,
        'destination': form.elements[1].value,
        'price': form.elements[2].value
    };

    let action = function (json) {
        let status = document.getElementById('status');

        if (json['error']) {
            window.clearInterval(loading);
            console.log(json['error']);
            status.style.color = 'red';
            status.innerHTML = 'Failed to create the ride offer';
        }
        else {
            window.clearInterval(loading);
            status.style.color = 'green';
            status.innerHTML = 'Ride offer created successfully';
        }
    };

    if (token) {
        let headers = new Headers({
           'Authorization': token,
            'Content-Type': 'application/json'
        });

        fetchAPI(url, 'POST', headers, JSON.stringify(data), action);
    }
    else {
        window.location.replace('index.html');
    }
};

//Show loading dots
let dots = function (status) {
    let message = document.getElementById('status');
    message.style.color = "orange";
    // message.style.fontSize = "70%";
    message.innerHTML = status + " ";
    return window.setInterval(function() {
        if (message.innerHTML.length > status.length + 3)
            message.innerHTML = status + " ";
        else
            message.innerHTML += '.';
    }, 500);
};

/**
 * Creates the HTML to display the ride
 * */
let createRideHTML = function (name, origin, destination, price) {
    let ridesGrid = document.getElementById("rides");
    let rideHTML = "<div class='grid-item'><div class='ride-offer-details'>" +
        "<div class='ride-offer-header'> <h2>RIDE OFFER</h2> " +
        "<span class='city-name'><span>" + name + "</span></span></div>" +
        "<ul class='details-list'>" +
        "<li>Origin: " + origin + "</li>" +
        "<li>Destination: " + destination + "</li>" +
        "<li>Price: " + price + "</li>" +
        "</ul>" +
        "<div class='offer-button'>" +
        "<a href='#' class='button-choose'>REQUEST RIDE</a>" +
        "</div></div></div>";

    ridesGrid.innerHTML = ridesGrid.innerHTML + rideHTML;
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
        offerButtons.style.display = "block";
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
