document.addEventListener('DOMContentLoaded', function () {

    var usernameError = false;
    if (usernameError) {
        document.getElementById('usernameContainer').classList.add('error-border');
    }

    var passwordError = false;
    if (passwordError) {
        document.getElementById('passwordContainer').classList.add('error-border');
    }

    if (window.location.search) {
        var newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, newURL);
    }
});