// Admin Dashboard JavaScript για GitHub Pages
// File upload με base64 encoding (χωρίς GitHub API)

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
const submitBtn = document.getElementById('submitBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    if (!checkAuth()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    loadExams();
    setupEventListeners();
    updateAdminStatus();
});

// Check Auth: Ελέγχει αν ο χρήστης είναι logged in
function checkAuth() {
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
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
            localStorage.removeItem('adminLoginTime');
            return false;
        }
    }
    
    return true;
}

// Update Admin Status
function updateAdminStatus() {
    const adminStatus = document.getElementById('adminStatus');
    const username = localStorage.getItem('adminUsername') || 'Admin';
    adminStatus.textContent = `Logged in as: ${username}`;
}

// Logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminLoginTime');
    window.location.href = 'admin-login.html';
}

// Load Exams: Φορτώνει τα θέματα από το JSON ή localStorage
async function loadExams() {
    try {
        loading.style.display = 'block';
        
        // Προσπαθεί να φορτώσει από localStorage πρώτα (για unsaved changes)
        const localExams = localStorage.getItem('localExams');
        if (localExams) {
            try {
                const parsed = JSON.parse(localExams);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    allExams = parsed;
                    displayExams();
                    loading.style.display = 'none';
                    return;
                }
            } catch (e) {
                // Αν το localStorage είναι corrupted, συνεχίζει με το JSON
                console.warn('LocalStorage data corrupted, loading from JSON');
            }
        }
        
        // Φορτώνει από το JSON file
        const response = await fetch('data/exams.json');
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

// Display Exams: Εμφανίζει τα θέματα
function displayExams() {
    if (allExams.length === 0) {
        examsList.innerHTML = '<p>Δεν υπάρχουν θέματα. Προσθέστε ένα νέο θέμα παραπάνω.</p>';
        return;
    }
    
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
                    ${exam.file ? `<span>📄 <a href="${exam.file}" target="_blank">Προβολή</a></span>` : ''}
                </div>
                ${exam.description ? `<p style="margin-top: 0.5rem; color: var(--text-secondary);">${escapeHtml(exam.description)}</p>` : ''}
            </div>
            <div class="exam-item-actions">
                <button class="btn-edit" onclick="editExam(${exam.id})">✏️ Επεξεργασία</button>
                <button class="btn-delete" onclick="deleteExam(${exam.id})">🗑️ Διαγραφή</button>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    addExamForm.addEventListener('submit', handleAddExam);
    editExamForm.addEventListener('submit', handleEditExam);
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
    exportJsonBtn.addEventListener('click', exportJson);
}

// Handle Add Exam: Προσθήκη νέου θέματος
async function handleAddExam(e) {
    e.preventDefault();
    
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');
    formError.style.display = 'none';
    formSuccess.style.display = 'none';
    
    const course = document.getElementById('course').value.trim();
    const semester = parseInt(document.getElementById('semester').value);
    const year = parseInt(document.getElementById('year').value);
    const type = document.getElementById('type').value.trim() || null;
    const description = document.getElementById('description').value.trim() || null;
    const fileInput = document.getElementById('file');
    
    if (!course || !semester || !year) {
        showFormError('Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Επεξεργασία...';
        
        let fileUrl = null;
        
        // Αν έχει επιλεγεί αρχείο, το μετατρέπει σε base64/data URL
        if (fileInput.files[0]) {
            const file = fileInput.files[0];
            const maxSize = file.type === 'image/png' || file.type === 'image/jpeg' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB για images, 10MB για PDF
            
            if (file.size > maxSize) {
                showFormError(`Το αρχείο είναι πολύ μεγάλο (${(file.size / 1024 / 1024).toFixed(2)}MB). Μέγιστο: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
                submitBtn.disabled = false;
                submitBtn.textContent = '💾 Προσθήκη Θέματος';
                return;
            }
            
            fileUrl = await fileToDataUrl(file);
        }
        
        // Προσθήκη νέου θέματος
        const newId = allExams.length > 0 ? Math.max(...allExams.map(e => e.id)) + 1 : 1;
        const newExam = {
            id: newId,
            course,
            semester,
            year,
            type,
            description,
            file: fileUrl,
            createdAt: new Date().toISOString()
        };
        
        allExams.push(newExam);
        
        // Αποθήκευση στο localStorage
        saveToLocalStorage();
        
        formSuccess.textContent = '✅ Θέμα προστέθηκε επιτυχώς! Κατεβάστε το JSON για να το ανεβάσετε στο GitHub.';
        formSuccess.style.display = 'block';
        addExamForm.reset();
        await loadExams();
        
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showFormError(error.message || 'Σφάλμα κατά την προσθήκη θέματος');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Προσθήκη Θέματος';
    }
}

// File to Data URL: Μετατρέπει αρχείο σε data URL (base64)
function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            // Data URL format: data:image/png;base64,xxxxx
            resolve(reader.result);
        };
        
        reader.onerror = () => reject(new Error('Σφάλμα ανάγνωσης αρχείου'));
        reader.readAsDataURL(file);
    });
}

// Save to LocalStorage: Αποθηκεύει τα exams στο localStorage
function saveToLocalStorage() {
    localStorage.setItem('localExams', JSON.stringify(allExams));
}

// Export JSON: Κατεβάζει το JSON file
function exportJson() {
    const jsonContent = JSON.stringify({ exams: allExams }, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exams.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Εμφανίζει success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = '✅ JSON file κατέβηκε! Ανέβασε το στο GitHub repository.';
    successMsg.style.position = 'fixed';
    successMsg.style.top = '20px';
    successMsg.style.right = '20px';
    successMsg.style.zIndex = '10000';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        document.body.removeChild(successMsg);
    }, 3000);
}

// Edit Exam: Ανοίγει modal για επεξεργασία
function editExam(id) {
    const exam = allExams.find(e => e.id === id);
    if (!exam) return;
    
    currentEditId = id;
    
    document.getElementById('editId').value = exam.id;
    document.getElementById('editCourse').value = exam.course;
    document.getElementById('editSemester').value = exam.semester;
    document.getElementById('editYear').value = exam.year;
    document.getElementById('editType').value = exam.type || '';
    document.getElementById('editDescription').value = exam.description || '';
    
    document.getElementById('editFormError').style.display = 'none';
    document.getElementById('editFormSuccess').style.display = 'none';
    
    editModal.style.display = 'flex';
}

// Handle Edit Exam: Ενημέρωση θέματος
async function handleEditExam(e) {
    e.preventDefault();
    
    const formError = document.getElementById('editFormError');
    const formSuccess = document.getElementById('editFormSuccess');
    formError.style.display = 'none';
    formSuccess.style.display = 'none';
    
    const examIndex = allExams.findIndex(e => e.id === currentEditId);
    if (examIndex === -1) return;
    
    const course = document.getElementById('editCourse').value.trim();
    const semester = parseInt(document.getElementById('editSemester').value);
    const year = parseInt(document.getElementById('editYear').value);
    const type = document.getElementById('editType').value.trim() || null;
    const description = document.getElementById('editDescription').value.trim() || null;
    const fileInput = document.getElementById('editFile');
    
    try {
        // Αν ανέβηκε νέο αρχείο
        if (fileInput.files[0]) {
            const file = fileInput.files[0];
            const maxSize = file.type === 'image/png' || file.type === 'image/jpeg' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
            
            if (file.size > maxSize) {
                showEditError(`Το αρχείο είναι πολύ μεγάλο (${(file.size / 1024 / 1024).toFixed(2)}MB). Μέγιστο: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
                return;
            }
            
            const fileUrl = await fileToDataUrl(file);
            allExams[examIndex].file = fileUrl;
        }
        
        // Ενημέρωση δεδομένων
        allExams[examIndex].course = course;
        allExams[examIndex].semester = semester;
        allExams[examIndex].year = year;
        allExams[examIndex].type = type;
        allExams[examIndex].description = description;
        allExams[examIndex].updatedAt = new Date().toISOString();
        
        // Αποθήκευση
        saveToLocalStorage();
        
        formSuccess.textContent = '✅ Θέμα ενημερώθηκε επιτυχώς! Κατεβάστε το JSON για να το ανεβάσετε στο GitHub.';
        formSuccess.style.display = 'block';
        await loadExams();
        
        setTimeout(() => {
            closeEditModal();
        }, 2000);
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showEditError(error.message || 'Σφάλμα κατά την ενημέρωση');
    }
}

// Delete Exam: Διαγραφή θέματος
function deleteExam(id) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το θέμα;')) {
        return;
    }
    
    const examIndex = allExams.findIndex(e => e.id === id);
    if (examIndex === -1) return;
    
    allExams.splice(examIndex, 1);
    saveToLocalStorage();
    loadExams();
    
    // Success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = '✅ Θέμα διαγράφηκε! Κατεβάστε το JSON για να το ανεβάσετε στο GitHub.';
    successMsg.style.position = 'fixed';
    successMsg.style.top = '20px';
    successMsg.style.right = '20px';
    successMsg.style.zIndex = '10000';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        document.body.removeChild(successMsg);
    }, 3000);
}

// Close Edit Modal
function closeEditModal() {
    editModal.style.display = 'none';
    editExamForm.reset();
    currentEditId = null;
}

// Helper Functions
function showFormError(message) {
    const formError = document.getElementById('formError');
    formError.textContent = message;
    formError.style.display = 'block';
}

function showEditError(message) {
    const formError = document.getElementById('editFormError');
    formError.textContent = message;
    formError.style.display = 'block';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global functions για onclick handlers
window.editExam = editExam;
window.deleteExam = deleteExam;
window.logout = logout;
