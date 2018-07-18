/**
 * This file contains the code for consuming the authentication api endpoints
 * and powering the login and sign up api endpoints.
 */

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
            window.location.replace('view_ride_offers.html');
            localStorage.setItem('token', json['access_token']);
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
            message.innerHTML = 'User already exists. Choose a different username or login if it\'s you.';
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
    //TODO: Also validate email addresses
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

    //TODO: Also validate email when I add it to the api
    return [true];
};

//Show loading dots
let dots = function (status) {
    let message = document.getElementById('error_message');
    message.style.color = "orange";
    message.style.fontSize = "70%";
    message.innerHTML = status + " ";
    return window.setInterval(function() {
        if (message.innerHTML.length > status.length + 3)
            message.innerHTML = status + " ";
        else
            message.innerHTML += '.';
    }, 500);
};
// let testToken = function () {
//     console.log("The token is: " + localStorage.getItem('token'));
// };
