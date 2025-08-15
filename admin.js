document.addEventListener('DOMContentLoaded', () => {
    // Admin access check
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'index.html';
        return; // Stop executing the rest of the script
    }

    const userListContainer = document.getElementById('user-list');

    function renderUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.length === 0) {
            userListContainer.innerHTML = '<p>No users found.</p>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        users.forEach((user, index) => {
            if (user.username === 'DG143') return; // Admin cannot manage their own account from this panel

            let actions = '';
            switch(user.status) {
                case 'Pending':
                    actions = `<button class="approve-btn" data-index="${index}">Approve</button>`;
                    break;
                case 'Approved':
                    actions = `<button class="revoke-btn" data-index="${index}">Revoke</button>`;
                    break;
                case 'Revoked':
                    actions = `<button class="restore-btn" data-index="${index}">Restore</button>`;
                    break;
            }

            tableHTML += `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.status} ${user.status === 'Revoked' ? `(Reason: ${user.reason || 'N/A'})` : ''}</td>
                    <td class="user-actions">
                        ${actions}
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        userListContainer.innerHTML = tableHTML;
    }

    function updateUser(index, newStatus, reason = '') {
        let users = JSON.parse(localStorage.getItem('users'));
        if (users[index]) {
            users[index].status = newStatus;
            if (newStatus === 'Revoked') {
                users[index].reason = reason;
            } else {
                // Clear reason if approved or restored
                users[index].reason = '';
            }
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
        }
    }

    userListContainer.addEventListener('click', (e) => {
        const target = e.target;
        const userIndex = target.dataset.index;

        if (userIndex === undefined) return;

        if (target.classList.contains('approve-btn')) {
            updateUser(userIndex, 'Approved');
        } else if (target.classList.contains('revoke-btn')) {
            const reason = prompt('Enter reason for revoking access:');
            if (reason) { // Only revoke if a reason is provided
                updateUser(userIndex, 'Revoked', reason);
            }
        } else if (target.classList.contains('restore-btn')) {
            updateUser(userIndex, 'Approved'); // Restoring sets status back to Approved
        }
    });

    renderUsers();

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdmin');
        window.location.href = 'index.html';
    });
});
