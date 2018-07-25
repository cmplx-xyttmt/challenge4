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