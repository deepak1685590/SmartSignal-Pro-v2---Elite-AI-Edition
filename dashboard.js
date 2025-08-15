document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    // If no user is in session, or the user is not approved, redirect to login
    if (!user || user.status !== 'Approved') {
        window.location.href = 'index.html';
        return;
    }

    // Display welcome message
    document.getElementById('user-welcome-name').textContent = user.username;

    // Logout logic
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});
