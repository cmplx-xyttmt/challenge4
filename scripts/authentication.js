/**
 * This file contains the code for consuming the authentication api endpoints
 * and thus powering the login and sign up pages.
 */


// Header for the sign-up and login pages
let headers = new Headers({
    'Content-Type': 'application/json',
});

let login = function () {
    let loading = dots("Logging in");
    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/auth/login';
    let form = document.getElementById("login");
    let data = {
        "username": form.elements[0].value,
        "password": form.elements[1].value
    };

    //Action to perform after sending the request
    let action = function (json) {
        window.clearInterval(loading);
        if (json['access_token']) {
            localStorage.setItem('token', json['access_token']);
            window.location.replace('view_ride_offers.html');
        }
        else {
            let reply = json['message'];
            let error = "Failed to login!";
            if (reply === 'User account does not exist')
                error = error + " " + reply + ". " + "Please sign up.";
            else if (reply === 'Invalid user credentials')
                error = error + " " + reply + ". " + "Please enter the correct password and username";

            let message = document.getElementById('error_message');
            message.style.color = 'red';
            message.style.fontSize = '70%';
            message.innerHTML = error;
        }
        console.log(json);
    };

    let val = validate(data);

    if (!val[0]) {
        window.clearInterval(loading);
        let message = document.getElementById('error_message');
        message.style.color = "red";
        message.style.fontSize = "60%";
        message.innerHTML = "Error: " + val[1];
    }
    else {
        data = JSON.stringify(data);
        fetchAPI(url, 'POST', headers, data, action);
    }
};

let sign_up = function () {
    console.log("Entering function");
    // Show dots while sign up operation is taking place
    let loading = dots("Signing up");

    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/auth/signup';
    let form = document.getElementById('signup');

    let data = {
        "username": form.elements[0].value,
        "password": form.elements[1].value,
        "email": form.elements[2].value
    };

    //Action to perform after sending the request
    let action = function (json) {
        window.clearInterval(loading);
        console.log(json);
        if (json['error']) {
            let message = document.getElementById('error_message');
            message.style.color = 'red';
            message.style.fontSize = '70%';
            let err_message;
            if (json['message'] === "Email in wrong format")
                err_message = "Enter email in correct format";
            else
                err_message = 'User already exists. Choose a different username or login if it\'s you.';
            message.innerHTML = err_message;
        }
        else {
            let message = "<div class='intro-container'>" +
                "<div class='intro'>" +
                "<h1 class=\"intro-heading\">RIDE MY WAY</h1>" +
                "<p class=\"intro-info\">";
            message = message + "Sign up successful" +
                "<br>" +
                "Go to the <a href='login_page.html'>login page</a> and enter your details.";
            message = message + "</p></div></div>";
            let container = document.body;
            container.innerHTML = message;
        }
    };

    let val = validate(data);
    if (!val[0]) {
        window.clearInterval(loading);
        let message = document.getElementById("error_message");
        message.style.color = "red";
        message.style.fontSize = "60%";
        message.innerHTML = "Error: " + val[1];
    }
    else {
        data = JSON.stringify(data);
        fetchAPI(url, 'POST', headers, data, action);
    }
};

//Validating user input
let validate = function (data) {
    if (data["username"].length < 7) {
        let error = "Make sure your username is at least 7 characters";
        if (data["username"] === "") {
            error = "Please supply a username";
        }
        return [false, error];
    }
    else if (data["password"].length < 5) {
        let error = "Make sure your password is at least 5 characters";
        if (data["username"] === "") {
            error = "Please supply a password";
        }
        return [false, error];
    }

    return [true];
};

/**
 * Executed when the body of the page has loaded.
 * Sends a request to a protected endpoint and checks for an error message
 * Redirects to ride offer page if the user is logged in.
 * */
let onload = function () {
    toggleDisplay(false);
    let token = localStorage.getItem('token');
    let url = 'https://ridemywayapidb.herokuapp.com/ridemyway/api/v1/rides';

    let action = function (json) {
        if (json['error']) {
            toggleDisplay(true);
            return;
        }
        window.location.replace('view_ride_offers.html');
    };

    if (token) {
        headers.append("Authorization", token);
        fetchAPI(url, 'GET', headers, null, action);
        headers.delete("Authorization");
    }
    else {
        toggleDisplay(true);
    }
};

/**
 * Shows loading while page is making api request and shows landing page if user is not logged in
 * */
let toggleDisplay = function (showLanding) {
    let loading = document.getElementById("loading");
    let info = document.getElementById("info");
    let auth_buttons = document.getElementById("auth_buttons");
    if (showLanding) {
        loading.style.display = "none";
        info.style.display = "block";
        auth_buttons.style.display = "block";
    }
    else {
        loading.style.display = "block";
        info.style.display = "none";
        auth_buttons.style.display = "none";
    }

};