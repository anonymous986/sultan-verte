// User Authentication System using localStorage
// NOTE: This is a demonstration system for a static website
// For production use, implement proper backend authentication

// Simple hash function using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

function getAllUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

async function loginUser(email, password) {
  const users = getAllUsers();
  const passwordHash = await hashPassword(password);
  const user = users.find(u => u.email === email && u.passwordHash === passwordHash);
  
  if (user) {
    const userData = { ...user };
    delete userData.passwordHash; // Don't store password hash in session
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true, user: userData };
  }
  
  return { success: false, message: 'Invalid email or password' };
}

async function signupUser(name, email, password) {
  const users = getAllUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Hash password before storing
  const passwordHash = await hashPassword(password);
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Auto login after signup
  const userData = { ...newUser };
  delete userData.passwordHash;
  localStorage.setItem('currentUser', JSON.stringify(userData));
  
  return { success: true, user: userData };
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Update navbar based on login status
function updateNavbar() {
  const user = getCurrentUser();
  const navLinks = document.getElementById('nav-links');
  
  if (!navLinks) return;
  
  // Remove existing auth links
  const existingAuthLinks = navLinks.querySelectorAll('.auth-nav-item');
  existingAuthLinks.forEach(item => item.remove());
  
  if (user) {
    // User is logged in - show user menu
    const userMenuItem = document.createElement('li');
    userMenuItem.className = 'auth-nav-item user-menu';
    userMenuItem.innerHTML = `
      <div class="user-dropdown">
        <button class="user-btn">
          <i class="ri-user-line"></i>
          <span>${user.name}</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <div class="dropdown-menu">
          <a href="#"><i class="ri-user-line"></i> Profile</a>
          <a href="#"><i class="ri-shopping-bag-line"></i> Orders</a>
          <a href="#"><i class="ri-settings-line"></i> Settings</a>
          <hr>
          <a href="#" class="logout-btn"><i class="ri-logout-line"></i> Logout</a>
        </div>
      </div>
    `;
    
    // Insert before cart
    const cartLink = navLinks.querySelector('.cart-link');
    if (cartLink && cartLink.parentElement) {
      navLinks.insertBefore(userMenuItem, cartLink.parentElement);
    } else {
      navLinks.appendChild(userMenuItem);
    }
    
    // Add logout listener
    const logoutBtn = userMenuItem.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
      });
    }
    
    // Toggle dropdown
    const userBtn = userMenuItem.querySelector('.user-btn');
    const dropdownMenu = userMenuItem.querySelector('.dropdown-menu');
    if (userBtn && dropdownMenu) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
      });
    }
  } else {
    // User is not logged in - show login/signup links
    const loginItem = document.createElement('li');
    loginItem.className = 'auth-nav-item';
    loginItem.innerHTML = '<a href="login.html"><i class="ri-login-line"></i> Login</a>';
    
    const signupItem = document.createElement('li');
    signupItem.className = 'auth-nav-item';
    signupItem.innerHTML = '<a href="signup.html" class="signup-link"><i class="ri-user-add-line"></i> Sign Up</a>';
    
    // Insert before cart
    const cartLink = navLinks.querySelector('.cart-link');
    if (cartLink && cartLink.parentElement) {
      navLinks.insertBefore(signupItem, cartLink.parentElement);
      navLinks.insertBefore(loginItem, cartLink.parentElement);
    } else {
      navLinks.appendChild(loginItem);
      navLinks.appendChild(signupItem);
    }
  }
}

// Handle login form
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await loginUser(email, password);
    
    if (result.success) {
      showToast('Login successful!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showToast(result.message);
    }
  });
}

// Handle signup form
if (document.getElementById('signup-form')) {
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      showToast('Password must be at least 6 characters!');
      return;
    }
    
    const result = await signupUser(name, email, password);
    
    if (result.success) {
      showToast('Account created successfully!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showToast(result.message);
    }
  });
}

// Initialize navbar on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
  });
}
