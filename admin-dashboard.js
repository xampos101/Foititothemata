// Admin Dashboard JavaScript για GitHub Pages
// Αυτόματες αλλαγές στο GitHub με API (χωρίς manual download/upload)

// Global Variables
let allExams = [];
let currentEditId = null;
let githubToken = null;
let githubRepo = null;

// DOM Elements
const addExamForm = document.getElementById('addExamForm');
const editExamForm = document.getElementById('editExamForm');
const examsList = document.getElementById('examsList');
const loading = document.getElementById('loading');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close-modal');
const cancelEdit = document.getElementById('cancelEdit');
const submitBtn = document.getElementById('submitBtn');
const saveGitHubConfig = document.getElementById('saveGitHubConfig');
const githubTokenInput = document.getElementById('githubToken');
const githubRepoInput = document.getElementById('githubRepo');
const githubSetupSection = document.getElementById('githubSetupSection');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    if (!checkAuth()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    loadGitHubConfig();
    loadExams();
    setupEventListeners();
    updateAdminStatus();
});

// Check Auth
function checkAuth() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!loggedIn || loggedIn !== 'true') {
        return false;
    }
    
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

// Load GitHub Config
function loadGitHubConfig() {
    githubToken = localStorage.getItem('githubToken');
    githubRepo = localStorage.getItem('githubRepo');
    
    if (githubToken && githubRepo) {
        // Hide setup section if already configured
        githubSetupSection.style.display = 'none';
        githubTokenInput.value = '••••••••••••' + githubToken.slice(-4);
        githubRepoInput.value = githubRepo;
    } else {
        githubSetupSection.style.display = 'block';
    }
}

// Save GitHub Config
saveGitHubConfig.addEventListener('click', () => {
    const token = githubTokenInput.value.trim();
    const repo = githubRepoInput.value.trim();
    
    if (!token || !repo) {
        showConfigStatus('⚠️ Παρακαλώ συμπληρώστε όλα τα πεδία', 'error');
        return;
    }
    
    // Αν το token είναι masked (••••), δεν το αλλάζουμε
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
        if (githubToken) {
            // Κρατάμε το παλιό token
        } else {
            showConfigStatus('⚠️ Παρακαλώ εισάγετε valid GitHub token', 'error');
            return;
        }
    } else {
        localStorage.setItem('githubToken', token);
        githubToken = token;
    }
    
    localStorage.setItem('githubRepo', repo);
    githubRepo = repo;
    
    showConfigStatus('✅ Config αποθηκεύτηκε! Τώρα οι αλλαγές γίνονται απευθείας στο GitHub.', 'success');
    githubSetupSection.style.display = 'none';
    
    setTimeout(() => {
        updateConfigStatus();
    }, 3000);
});

function showConfigStatus(message, type) {
    const statusDiv = document.getElementById('githubConfigStatus');
    const className = type === 'success' ? 'success-message' : 'error-message';
    statusDiv.innerHTML = `<div class="${className}">${message}</div>`;
}

function updateConfigStatus() {
    const statusDiv = document.getElementById('githubConfigStatus');
    if (githubToken && githubRepo) {
        statusDiv.innerHTML = '<div class="success-message">✅ GitHub config είναι έτοιμο! Οι αλλαγές γίνονται απευθείας.</div>';
    }
}

// Load Exams
async function loadExams() {
    try {
        loading.style.display = 'block';
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

// Display Exams
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
}

// Handle Add Exam
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
            const maxSize = file.type === 'image/png' || file.type === 'image/jpeg' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
            
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
        
        // Αν υπάρχει GitHub config, κάνει automatic commit
        if (githubToken && githubRepo) {
            submitBtn.textContent = '⏳ Αποθήκευση στο GitHub...';
            await updateExamsJson();
            formSuccess.textContent = '✅ Θέμα προστέθηκε επιτυχώς και αποθηκεύτηκε στο GitHub!';
        } else {
            formSuccess.textContent = '✅ Θέμα προστέθηκε! (Τοπικά - ρυθμίστε GitHub για automatic save)';
        }
        
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

// File to Data URL
function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Σφάλμα ανάγνωσης αρχείου'));
        reader.readAsDataURL(file);
    });
}

// Update Exams JSON on GitHub
async function updateExamsJson() {
    // 1. Get current file SHA (για update)
    const getResponse = await fetch(`https://api.github.com/repos/${githubRepo}/contents/data/exams.json`, {
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    let sha = null;
    if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
    }
    
    // 2. Update file
    const jsonContent = JSON.stringify({ exams: allExams }, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));
    
    const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/data/exams.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: 'Update exams.json via Admin Panel',
            content: base64Content,
            branch: 'main',
            sha: sha
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Σφάλμα ενημέρωσης exams.json');
    }
}

// Edit Exam
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

// Handle Edit Exam
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
        
        // Αν υπάρχει GitHub config, κάνει automatic commit
        if (githubToken && githubRepo) {
            await updateExamsJson();
            formSuccess.textContent = '✅ Θέμα ενημερώθηκε επιτυχώς και αποθηκεύτηκε στο GitHub!';
        } else {
            formSuccess.textContent = '✅ Θέμα ενημερώθηκε! (Τοπικά - ρυθμίστε GitHub για automatic save)';
        }
        
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

// Delete Exam
async function deleteExam(id) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το θέμα;')) {
        return;
    }
    
    const examIndex = allExams.findIndex(e => e.id === id);
    if (examIndex === -1) return;
    
    allExams.splice(examIndex, 1);
    
    // Αν υπάρχει GitHub config, κάνει automatic commit
    if (githubToken && githubRepo) {
        try {
            await updateExamsJson();
            alert('✅ Θέμα διαγράφηκε επιτυχώς και αποθηκεύτηκε στο GitHub!');
        } catch (error) {
            alert('Σφάλμα κατά τη διαγραφή: ' + error.message);
            return;
        }
    } else {
        alert('✅ Θέμα διαγράφηκε! (Τοπικά - ρυθμίστε GitHub για automatic save)');
    }
    
    await loadExams();
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

// Global functions
window.editExam = editExam;
window.deleteExam = deleteExam;
window.logout = logout;
