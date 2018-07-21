/**
 * This file contains the code that allows the user to view his ride offers and respond to them
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
 * Run when the view my ride offers page is loaded.
 * */
let onloadRideOffers = function () {
    toggleDisplay(false);
    let token = localStorage.getItem('token');
    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/user/rides';

    let action = function (json) {
        if (json['error']) {
            window.location.replace('index.html');
        }
        else {
            toggleDisplay(true);
            let rides = json['rides'];
            if (rides.length === 0) {
                document.getElementById('heading').innerHTML = "You haven't created any ride offers yet";
            }
            else {
                for (let i = 0; i < rides.length; i++) {
                    createRideHTML(rides[i]['name'], rides[i]['origin'],
                        rides[i]['destination'], rides[i]['price'], rides[i]['id']);
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
 * Creates the HTML to display the ride
 * */
let createRideHTML = function (name, origin, destination, price, id) {
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
        "<a onclick='dialog.render(" + id + ")' class='button-choose'>REQUEST RIDE</a>" +
        "</div></div></div>";

    ridesGrid.innerHTML = ridesGrid.innerHTML + rideHTML;
};

/**
* Shows dialog box
* */
let RenderDialog = function () {

    this.render = function (rideId) {
        let windowWidth = window.innerWidth, windowHeight = window.innerHeight;
        let dialogOverlay = document.getElementById('dialog-overlay');
        let dialogBox = document.getElementById('dialog-box');
        dialogOverlay.style.display = "block";
        dialogOverlay.style.height = windowHeight + "px";
        dialogBox.style.left = (windowWidth/2) - (550*0.5) + "px";
        dialogBox.style.top = "100px";
        dialogBox.style.display = "block";
        document.getElementById('dialog-box-head').innerHTML = "Confirm";
        document.getElementById('dialog-box-body').style.color = "white";
        document.getElementById('dialog-box-body').innerHTML = "Are you sure you want to request this ride?";
        document.getElementById('dialog-box-foot').innerHTML = "" +
            "<a class='button-dialog' onclick='dialog.yes(" + rideId + ")'>YES</a>" +
            "<a class='button-dialog' onclick='dialog.no()'>NO</a>";
    };

    this.yes = function (rideId) {
        createRideRequest(rideId);
    };

    this.no = function () {
        document.getElementById('dialog-box').style.display = "none";
        document.getElementById('dialog-overlay').style.display = "none";
    };
};

let dialog = new RenderDialog();

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