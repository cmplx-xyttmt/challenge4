/**
 * This file contains the code for consuming the ride offers api endpoint
 * and some extra stuff to make the page come to life.
 * */


// This function logs the user out by replacing the token with some random stuff.
let logout = function () {
    localStorage.setItem('token', 'gfiaiug');
    window.location.replace('index.html');
};
