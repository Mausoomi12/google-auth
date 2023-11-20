document.addEventListener('DOMContentLoaded', function () {
    const displayNameElement = document.getElementById('displayName');
    const logoutBtn = document.getElementById('logoutBtn');

    // Fetch user data from the server
    fetch('/user-data')
        .then(response => response.json())
        .then(user => {
            if (user && user.displayName) {
                displayNameElement.textContent = user.displayName;
            }
        })
        .catch(error => console.error('Error fetching user data:', error));

    logoutBtn.addEventListener('click', function () {
        // Redirect to the logout route
        window.location.href = '/logout';
    });
});
