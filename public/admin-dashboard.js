// Admin Dashboard JavaScript: Χειρίζεται τη διαχείριση θεμάτων

// Global Variables
let allExams = [];
let currentEditId = null;

// DOM Elements
const addExamForm = document.getElementById('addExamForm');
const editExamForm = document.getElementById('editExamForm');
const examsList = document.getElementById('examsList');
const loading = document.getElementById('loading');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close-modal');
const cancelEdit = document.getElementById('cancelEdit');
const logoutBtn = document.getElementById('logoutBtn');
const adminUsername = document.getElementById('adminUsername');

// Initialize: Ελέγχει αν ο χρήστης είναι logged in
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadExams();
    setupEventListeners();
});

// Check Auth: Ελέγχει αν ο χρήστης είναι admin
async function checkAuth() {
    try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        
        if (!data.isAdmin) {
            // Αν δεν είναι admin, ανακατεύθυνση στο login
            window.location.href = '/admin-login.html';
            return;
        }
        
        // Εμφανίζει το username (από session)
        adminUsername.textContent = 'Admin';
    } catch (error) {
        console.error('Σφάλμα ελέγχου auth:', error);
        window.location.href = '/admin-login.html';
    }
}

// Load Exams: Φορτώνει όλα τα θέματα
async function loadExams() {
    try {
        loading.style.display = 'block';
        const response = await fetch('/api/exams');
        const data = await response.json();
        allExams = data.exams || [];
        displayExams();
    } catch (error) {
        console.error('Σφάλμα φόρτωσης θεμάτων:', error);
        examsList.innerHTML = '<div class="error-message">Σφάλμα κατά τη φόρτωση θεμάτων</div>';
    } finally {
        loading.style.display = 'none';
    }
}

// Display Exams: Εμφανίζει τα θέματα στη λίστα
function displayExams() {
    if (allExams.length === 0) {
        examsList.innerHTML = '<p>Δεν υπάρχουν θέματα. Προσθέστε ένα νέο θέμα παραπάνω.</p>';
        return;
    }
    
    // Ταξινομεί ανά έτος (πιο πρόσφατα πρώτα)
    const sorted = [...allExams].sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.semester - a.semester;
    });
    
    examsList.innerHTML = sorted.map(exam => `
        <div class="exam-item">
            <div class="exam-item-info">
                <h3>${escapeHtml(exam.course)}</h3>
                <div class="meta">
                    <span>📅 ${exam.year}</span>
                    <span>📚 ${exam.semester}ο Εξάμηνο</span>
                    ${exam.type ? `<span>📝 ${escapeHtml(exam.type)}</span>` : ''}
                    ${exam.file ? `<span>📄 <a href="${exam.file}" target="_blank">Προβολή Αρχείου</a></span>` : ''}
                </div>
                ${exam.description ? `<p style="margin-top: 0.5rem; color: #666;">${escapeHtml(exam.description)}</p>` : ''}
            </div>
            <div class="exam-item-actions">
                <button class="btn-edit" onclick="editExam(${exam.id})">✏️ Επεξεργασία</button>
                <button class="btn-delete" onclick="deleteExam(${exam.id})">🗑️ Διαγραφή</button>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners: Ρυθμίζει τα event listeners
function setupEventListeners() {
    // Add Exam Form
    addExamForm.addEventListener('submit', handleAddExam);
    
    // Edit Exam Form
    editExamForm.addEventListener('submit', handleEditExam);
    
    // Modal controls
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    
    // Κλείνει το modal όταν κάνεις click έξω από αυτό
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
}

// Handle Add Exam: Χειρίζεται την προσθήκη νέου θέματος
async function handleAddExam(e) {
    e.preventDefault();
    
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');
    formError.style.display = 'none';
    formSuccess.style.display = 'none';
    
    const formData = new FormData(addExamForm);
    
    try {
        const response = await fetch('/api/admin/exams', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            formSuccess.textContent = 'Θέμα προστέθηκε επιτυχώς!';
            formSuccess.style.display = 'block';
            addExamForm.reset();
            await loadExams();
            
            // Κρύβει το success message μετά από 3 δευτερόλεπτα
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 3000);
        } else {
            formError.textContent = data.error || 'Σφάλμα κατά την προσθήκη θέματος';
            formError.style.display = 'block';
        }
    } catch (error) {
        console.error('Σφάλμα:', error);
        formError.textContent = 'Σφάλμα σύνδεσης με τον server';
        formError.style.display = 'block';
    }
}

// Edit Exam: Ανοίγει το modal για επεξεργασία
function editExam(id) {
    const exam = allExams.find(e => e.id === id);
    if (!exam) return;
    
    currentEditId = id;
    
    // Γεμίζει το form με τα υπάρχοντα δεδομένα
    document.getElementById('editId').value = exam.id;
    document.getElementById('editCourse').value = exam.course;
    document.getElementById('editSemester').value = exam.semester;
    document.getElementById('editYear').value = exam.year;
    document.getElementById('editType').value = exam.type || '';
    document.getElementById('editDescription').value = exam.description || '';
    
    // Κρύβει προηγούμενα messages
    document.getElementById('editFormError').style.display = 'none';
    document.getElementById('editFormSuccess').style.display = 'none';
    
    // Εμφανίζει το modal
    editModal.style.display = 'flex';
}

// Handle Edit Exam: Χειρίζεται την ενημέρωση θέματος
async function handleEditExam(e) {
    e.preventDefault();
    
    const formError = document.getElementById('editFormError');
    const formSuccess = document.getElementById('editFormSuccess');
    formError.style.display = 'none';
    formSuccess.style.display = 'none';
    
    const formData = new FormData(editExamForm);
    
    try {
        const response = await fetch(`/api/admin/exams/${currentEditId}`, {
            method: 'PUT',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            formSuccess.textContent = 'Θέμα ενημερώθηκε επιτυχώς!';
            formSuccess.style.display = 'block';
            await loadExams();
            
            // Κλείνει το modal μετά από 1.5 δευτερόλεπτα
            setTimeout(() => {
                closeEditModal();
            }, 1500);
        } else {
            formError.textContent = data.error || 'Σφάλμα κατά την ενημέρωση θέματος';
            formError.style.display = 'block';
        }
    } catch (error) {
        console.error('Σφάλμα:', error);
        formError.textContent = 'Σφάλμα σύνδεσης με τον server';
        formError.style.display = 'block';
    }
}

// Delete Exam: Διαγράφει ένα θέμα
async function deleteExam(id) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το θέμα;')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/exams/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            await loadExams();
            alert('Θέμα διαγράφηκε επιτυχώς!');
        } else {
            alert(data.error || 'Σφάλμα κατά τη διαγραφή θέματος');
        }
    } catch (error) {
        console.error('Σφάλμα:', error);
        alert('Σφάλμα σύνδεσης με τον server');
    }
}

// Close Edit Modal: Κλείνει το modal
function closeEditModal() {
    editModal.style.display = 'none';
    editExamForm.reset();
    currentEditId = null;
}

// Handle Logout: Χειρίζεται το logout
async function handleLogout() {
    try {
        const response = await fetch('/api/admin/logout', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/admin-login.html';
        }
    } catch (error) {
        console.error('Σφάλμα logout:', error);
        // Ακόμα και αν υπάρξει σφάλμα, ανακατεύθυνση στο login
        window.location.href = '/admin-login.html';
    }
}

// Escape HTML: Προστατεύει από XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Κάνει τις functions διαθέσιμες global για τα onclick handlers
window.editExam = editExam;
window.deleteExam = deleteExam;

