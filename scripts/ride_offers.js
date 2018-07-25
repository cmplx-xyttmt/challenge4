/**
 * This file contains the code for consuming the ride offers api endpoints
 * and some extra stuff to make the page come to life.
 * */


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
 * This function consumes the create ride offer api end point
 * */
let createRide = function () {
    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/users/rides';
    let token = localStorage.getItem('token');
    let loading = dots('status', 'Creating ride offer');

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

/**
 * This function consumes the create ride request api endpoint
 * */
let createRideRequest = function (rideId) {
    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/rides/' + rideId + '/requests';
    console.log(url);
    let token = localStorage.getItem('token');
    let loading = dots('dialog-box-body', 'Creating ride request');
    let buttons = document.getElementById('dialog-box-foot');
    buttons.innerHTML = "";

    let action = function (json) {
        window.clearInterval(loading);
        console.log(json);
        let status = document.getElementById('dialog-box-body');
        buttons.innerHTML = "<a class='button-dialog' onclick='dialog.no()'>OK</a>";
        if (json['error']) {
            console.log(json['error']);
            status.style.color = 'red';
            status.innerHTML = 'Failed to create the ride request. ' + json['message'];
        }
        else {
            status.style.color = 'green';
            status.innerHTML = 'Ride request created successfully';

        }
    };

    if (token) {
        let headers = new Headers({
            'Authorization': token
        });

        console.log('Sending request...');
        fetchAPI(url, 'POST', headers, null, action);
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
