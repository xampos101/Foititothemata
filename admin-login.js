// Admin Login JavaScript για GitHub Pages
// Χρησιμοποιεί localStorage για session management

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// Admin credentials (hardcoded - για static site)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        window.location.href = 'admin-dashboard.html';
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    loginError.style.display = 'none';
    
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Save session to localStorage
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        // Redirect to dashboard
        window.location.href = 'admin-dashboard.html';
    } else {
        loginError.textContent = 'Λάθος username ή password';
        loginError.style.display = 'block';
    }
});

// Helper function to check if logged in
function isLoggedIn() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!loggedIn || loggedIn !== 'true') {
        return false;
    }
    
    // Check if session expired (24 hours)
    if (loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            // Session expired
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
            localStorage.removeItem('adminLoginTime');
            return false;
        }
    }
    
    return true;
}

