// Admin Login JavaScript: Χειρίζεται το login form

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// Όταν υποβάλλεται το form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Κρύβει προηγούμενα errors
    loginError.style.display = 'none';
    
    try {
        // Κάνει POST request στο /api/admin/login
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Επιτυχής login - ανακατεύθυνση στο dashboard
            window.location.href = '/admin-dashboard.html';
        } else {
            // Σφάλμα - εμφανίζει μήνυμα
            loginError.textContent = data.error || 'Σφάλμα κατά το login';
            loginError.style.display = 'block';
        }
    } catch (error) {
        console.error('Σφάλμα:', error);
        loginError.textContent = 'Σφάλμα σύνδεσης με τον server';
        loginError.style.display = 'block';
    }
});

