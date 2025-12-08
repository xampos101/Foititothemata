// Admin Dashboard JavaScript για GitHub Pages
// Χρησιμοποιεί GitHub API για uploads και CRUD operations

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
const saveGitHubConfig = document.getElementById('saveGitHubConfig');
const githubTokenInput = document.getElementById('githubToken');
const githubRepoInput = document.getElementById('githubRepo');
const submitBtn = document.getElementById('submitBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubConfig();
    loadExams();
    setupEventListeners();
});

// Load GitHub Config: Φορτώνει το GitHub token και repo από localStorage
function loadGitHubConfig() {
    githubToken = localStorage.getItem('githubToken');
    githubRepo = localStorage.getItem('githubRepo');
    
    if (githubToken) {
        githubTokenInput.value = '••••••••••••' + githubToken.slice(-4);
    }
    if (githubRepo) {
        githubRepoInput.value = githubRepo;
    }
    
    updateConfigStatus();
}

// Save GitHub Config: Αποθηκεύει το GitHub config
saveGitHubConfig.addEventListener('click', () => {
    const token = githubTokenInput.value;
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
    
    showConfigStatus('✅ Config αποθηκεύτηκε!', 'success');
    updateConfigStatus();
});

// Update Config Status: Ενημερώνει το status
function updateConfigStatus() {
    const statusDiv = document.getElementById('githubConfigStatus');
    if (githubToken && githubRepo) {
        statusDiv.innerHTML = '<div class="success-message">✅ GitHub config είναι έτοιμο!</div>';
        submitBtn.disabled = false;
    } else {
        statusDiv.innerHTML = '<div class="error-message">⚠️ Χρειάζεται GitHub config για uploads</div>';
        submitBtn.disabled = true;
    }
}

function showConfigStatus(message, type) {
    const statusDiv = document.getElementById('githubConfigStatus');
    const className = type === 'success' ? 'success-message' : 'error-message';
    statusDiv.innerHTML = `<div class="${className}">${message}</div>`;
    setTimeout(() => updateConfigStatus(), 3000);
}

// Load Exams: Φορτώνει τα θέματα από το JSON
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
}

// Handle Add Exam: Προσθήκη νέου θέματος
async function handleAddExam(e) {
    e.preventDefault();
    
    if (!githubToken || !githubRepo) {
        showFormError('⚠️ Χρειάζεται GitHub config. Δείτε το "GitHub Setup" section.');
        return;
    }
    
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
    
    if (!fileInput.files[0]) {
        showFormError('Παρακαλώ επιλέξτε αρχείο');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Ανέβασμα...';
        
        // 1. Upload file to GitHub
        const file = fileInput.files[0];
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `files/${fileName}`;
        const fileUrl = await uploadFileToGitHub(file, filePath);
        
        // 2. Add exam to JSON
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
        
        // 3. Update exams.json on GitHub
        await updateExamsJson();
        
        formSuccess.textContent = '✅ Θέμα προστέθηκε επιτυχώς!';
        formSuccess.style.display = 'block';
        addExamForm.reset();
        await loadExams();
        
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showFormError(error.message || 'Σφάλμα κατά την προσθήκη θέματος');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Προσθήκη Θέματος';
    }
}

// Upload File to GitHub: Ανέβει αρχείο στο GitHub repository
async function uploadFileToGitHub(file, filePath) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async () => {
            try {
                // Μετατρέπει ArrayBuffer σε base64
                const arrayBuffer = reader.result;
                const bytes = new Uint8Array(arrayBuffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64Content = btoa(binary);
                
                const fileName = filePath.split('/').pop();
                
                // GitHub API: Create file
                const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${githubToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        message: `Add exam file: ${fileName}`,
                        content: base64Content,
                        branch: 'main'
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Σφάλμα upload αρχείου');
                }
                
                const data = await response.json();
                // GitHub Pages URL (χρησιμοποιούμε raw.githubusercontent.com)
                const fileUrl = `https://raw.githubusercontent.com/${githubRepo}/main/${filePath}`;
                resolve(fileUrl);
                
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Σφάλμα ανάγνωσης αρχείου'));
        reader.readAsArrayBuffer(file);
    });
}

// Update Exams JSON: Ενημερώνει το exams.json στο GitHub
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
    // Μετατρέπει string σε base64 (σωστά για UTF-8)
    const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));
    
    const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/data/exams.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: 'Update exams.json',
            content: base64Content,
            branch: 'main',
            sha: sha // Αν υπάρχει, κάνει update. Αν όχι, δημιουργεί νέο
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Σφάλμα ενημέρωσης exams.json');
    }
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
    
    if (!githubToken || !githubRepo) {
        showEditError('⚠️ Χρειάζεται GitHub config');
        return;
    }
    
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
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `files/${fileName}`;
            const fileUrl = await uploadFileToGitHub(file, filePath);
            allExams[examIndex].file = fileUrl;
        }
        
        // Ενημέρωση δεδομένων
        allExams[examIndex].course = course;
        allExams[examIndex].semester = semester;
        allExams[examIndex].year = year;
        allExams[examIndex].type = type;
        allExams[examIndex].description = description;
        allExams[examIndex].updatedAt = new Date().toISOString();
        
        // Update JSON
        await updateExamsJson();
        
        formSuccess.textContent = '✅ Θέμα ενημερώθηκε επιτυχώς!';
        formSuccess.style.display = 'block';
        await loadExams();
        
        setTimeout(() => {
            closeEditModal();
        }, 1500);
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showEditError(error.message || 'Σφάλμα κατά την ενημέρωση');
    }
}

// Delete Exam: Διαγραφή θέματος
async function deleteExam(id) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το θέμα;')) {
        return;
    }
    
    if (!githubToken || !githubRepo) {
        alert('⚠️ Χρειάζεται GitHub config');
        return;
    }
    
    try {
        const examIndex = allExams.findIndex(e => e.id === id);
        if (examIndex === -1) return;
        
        allExams.splice(examIndex, 1);
        await updateExamsJson();
        await loadExams();
        alert('✅ Θέμα διαγράφηκε επιτυχώς!');
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        alert('Σφάλμα κατά τη διαγραφή: ' + error.message);
    }
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

