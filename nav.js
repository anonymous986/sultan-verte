
document.addEventListener('DOMContentLoaded', () => {
    const navLinksContainer = document.getElementById('nav-links');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        // User is logged in, show a user menu
        const userMenuHTML = `
            <li><a href="products.html">PRODUCTS</a></li>
            <li><a href="cart.html" class="cart-link"><i class="ri-shopping-cart-line"></i> <span class="cart-count">0</span></a></li>
            <li class="user-menu">
                <button class="user-btn"><i class="ri-user-line"></i> ${loggedInUser.name.split(' ')[0]} <i class="ri-arrow-down-s-line"></i></button>
                <div class="dropdown-menu">
                    <a href="#"><i class="ri-user-line"></i> Profile</a>
                    <a href="#"><i class="ri-shopping-bag-line"></i> My Orders</a>
                    <hr>
                    <a href="#" id="logout-btn"><i class="ri-logout-box-r-line"></i> Logout</a>
                </div>
            </li>
        `;
        navLinksContainer.innerHTML = userMenuHTML;

        // Dropdown toggle
        const userBtn = navLinksContainer.querySelector('.user-btn');
        const dropdown = navLinksContainer.querySelector('.dropdown-menu');
        userBtn.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        // Logout logic
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            alert('You have been logged out.');
            window.location.href = 'index.html';
        });

    } else {
        // User is not logged in, show login/signup
        const guestMenuHTML = `
            <li><a href="products.html">PRODUCTS</a></li>
            <li><a href="cart.html" class="cart-link"><i class="ri-shopping-cart-line"></i> <span class="cart-count">0</span></a></li>
            <li><a href="login.html" class="btn btn-sm">LOG IN</a></li>
            <li><a href="signup.html" class="btn btn-sm signup-link">SIGN UP</a></li>
        `;
        navLinksContainer.innerHTML = guestMenuHTML;
    }

    // Close dropdown if clicked outside
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(d => d.classList.remove('show'));
        }
    });
});
