
document.addEventListener('DOMContentLoaded', () => {
    // --- FORM REFERENCES ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // --- ADMIN CREDENTIALS ---
    const ADMIN_EMAIL = 'admin@sultanverite.com';
    const ADMIN_PASSWORD = 'admin123';

    // --- SIGNUP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Get existing users or initialize an empty array
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if user already exists
            const userExists = users.some(user => user.email === email);

            if (userExists) {
                alert('An account with this email already exists. Please log in.');
                return;
            }

            // Add new user
            const newUser = {
                name,
                email,
                password, // In a real app, hash this password!
                joined: new Date().toISOString().slice(0, 10)
            };
            users.push(newUser);

            // Save updated user list
            localStorage.setItem('users', JSON.stringify(users));

            alert('Signup successful! Please log in.');
            window.location.href = 'login.html';
        });
    }

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Check for Admin Login
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Set a session for the admin
                sessionStorage.setItem('loggedInUser', JSON.stringify({ name: 'Admin', email: ADMIN_EMAIL, isAdmin: true }));
                alert('Admin login successful!');
                window.location.href = 'admin_dashboard.html';
                return;
            }

            // Check for Regular User Login
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const foundUser = users.find(user => user.email === email && user.password === password);

            if (foundUser) {
                // Set a session for the user
                sessionStorage.setItem('loggedInUser', JSON.stringify({ name: foundUser.name, email: foundUser.email, isAdmin: false }));
                alert(`Welcome back, ${foundUser.name}!`);
                window.location.href = 'index.html'; 
            } else {
                alert('Invalid email or password. Please try again or sign up.');
            }
        });
    }
});
