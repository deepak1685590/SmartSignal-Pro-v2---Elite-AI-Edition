document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const message = document.getElementById('message');

    // Initialize localStorage if it's empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = loginForm.username.value;
        const password = loginForm.password.value;
        const message = document.getElementById('message');

        // Admin Login
        if (username === 'DG143' && password === 'DG143') {
            message.textContent = '✅ Admin login successful! Redirecting...';
            message.className = 'success';
            sessionStorage.setItem('isAdmin', 'true'); // Set admin flag
            // Redirect to admin page
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
            return;
        }

        let users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.username === username);

        if (user) {
            // Existing user
            if (user.password === password) {
                // Password is correct, now check status
                switch (user.status) {
                    case 'Approved':
                        message.textContent = '✅ Login successful!';
                        message.className = 'success';
                        // In a real application, you would redirect to a user dashboard
                        // For now, we will just show a message.
                        break;
                    case 'Pending':
                        message.textContent = '⚠️ Your account is pending admin approval. Please wait for admin to activate your account.';
                        message.className = 'error';
                        break;
                    case 'Revoked':
                        message.textContent = `⚠️ Your account access has been revoked by admin. Reason: ${user.reason || 'No reason specified'}`;
                        message.className = 'error';
                        break;
                }
            } else {
                // Incorrect password
                message.textContent = '⚠️ Incorrect password.';
                message.className = 'error';
            }
        } else {
            // New user registration
            const newUser = {
                username,
                password, // In a real app, passwords should be hashed
                status: 'Pending',
                reason: ''
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            message.textContent = '✅ Account created! Awaiting admin approval...';
            message.className = 'success';
        }
    });
});
