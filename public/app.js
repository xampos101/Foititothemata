// Frontend JavaScript: Κάνει τη σελίδα interactive
// Αυτό το script φορτώνει τα δεδομένα από το API και τα εμφανίζει

// Global Variables: Μεταβλητές που χρησιμοποιούμε σε όλο το script
let allExams = []; // Αποθηκεύει όλα τα θέματα
let filteredExams = []; // Αποθηκεύει τα φιλτραρισμένα θέματα

// DOM Elements: Αναφορές στα HTML elements
const examsContainer = document.getElementById('examsContainer');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const noResults = document.getElementById('noResults');
const courseFilter = document.getElementById('courseFilter');
const semesterFilter = document.getElementById('semesterFilter');
const yearFilter = document.getElementById('yearFilter');
const clearFiltersBtn = document.getElementById('clearFilters');

// Initialize: Αρχικοποίηση - τρέχει όταν φορτώσει η σελίδα
document.addEventListener('DOMContentLoaded', () => {
    loadExams(); // Φορτώνει τα θέματα
    setupEventListeners(); // Ρυθμίζει τα event listeners
    populateYearFilter(); // Γεμίζει το dropdown με τα έτη
});

// Load Exams: Φορτώνει τα θέματα από το API
async function loadExams() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        
        // Κάνει HTTP request στο backend API
        const response = await fetch('/api/exams');
        
        if (!response.ok) {
            throw new Error('Σφάλμα κατά τη φόρτωση δεδομένων');
        }
        
        const data = await response.json();
        allExams = data.exams || [];
        
        // Εμφανίζει τα θέματα
        displayExams(allExams);
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showError('Δεν ήταν δυνατή η φόρτωση των δεδομένων. Ελέγξτε ότι ο server τρέχει.');
    } finally {
        loading.style.display = 'none';
    }
}

// Display Exams: Εμφανίζει τα θέματα στην οθόνη
function displayExams(exams) {
    if (exams.length === 0) {
        noResults.style.display = 'block';
        examsContainer.innerHTML = '';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Δημιουργεί HTML cards για κάθε θέμα
    examsContainer.innerHTML = exams.map(exam => {
        let fileDisplay = '';
        if (exam.file) {
            const fileExtension = exam.file.toLowerCase().split('.').pop();
            if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
                // Για εικόνες: εμφανίζει preview
                fileDisplay = `
                    <div style="margin-top: 1rem;">
                        <a href="${exam.file}" target="_blank" style="display: inline-block; margin-bottom: 0.5rem; color: #667eea; text-decoration: none; font-weight: 600;">📄 Προβολή Εικόνας</a>
                        <div style="margin-top: 0.5rem;">
                            <img src="${exam.file}" alt="Θέμα εξεταστικής" style="max-width: 100%; border-radius: 8px; border: 2px solid #e0e0e0; cursor: pointer;" onclick="window.open('${exam.file}', '_blank')">
                        </div>
                    </div>
                `;
            } else {
                // Για PDF: direct link
                fileDisplay = `
                    <div style="margin-top: 1rem;">
                        <a href="${exam.file}" target="_blank" style="display: inline-block; padding: 0.75rem 1.5rem; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.3s;" onmouseover="this.style.background='#5568d3'" onmouseout="this.style.background='#667eea'">📄 Προβολή PDF</a>
                    </div>
                `;
            }
        }
        
        return `
            <div class="exam-card">
                <h3>${escapeHtml(exam.course)}</h3>
                <div class="meta">
                    <span>📅 ${exam.year}</span>
                    <span>📚 ${exam.semester}ο Εξάμηνο</span>
                    ${exam.type ? `<span>📝 ${escapeHtml(exam.type)}</span>` : ''}
                </div>
                ${exam.description ? `<div class="description">${escapeHtml(exam.description)}</div>` : ''}
                ${fileDisplay}
            </div>
        `;
    }).join('');
}

// Filter Exams: Φιλτράρει τα θέματα βάσει των φίλτρων
function filterExams() {
    const course = courseFilter.value.toLowerCase().trim();
    const semester = semesterFilter.value;
    const year = yearFilter.value;
    
    filteredExams = allExams.filter(exam => {
        const matchesCourse = !course || exam.course.toLowerCase().includes(course);
        const matchesSemester = !semester || exam.semester === parseInt(semester);
        const matchesYear = !year || exam.year === parseInt(year);
        
        return matchesCourse && matchesSemester && matchesYear;
    });
    
    displayExams(filteredExams);
}

// Setup Event Listeners: Ρυθμίζει τα event listeners για τα φίλτρα
function setupEventListeners() {
    // Όταν αλλάζει κάποιο φίλτρο, τρέχει το filterExams
    courseFilter.addEventListener('input', filterExams);
    semesterFilter.addEventListener('change', filterExams);
    yearFilter.addEventListener('change', filterExams);
    
    // Κουμπί καθαρισμού φίλτρων
    clearFiltersBtn.addEventListener('click', () => {
        courseFilter.value = '';
        semesterFilter.value = '';
        yearFilter.value = '';
        filterExams();
    });
}

// Populate Year Filter: Γεμίζει το dropdown με τα διαθέσιμα έτη
function populateYearFilter() {
    // Περιμένει να φορτωθούν τα δεδομένα πρώτα
    setTimeout(() => {
        if (allExams.length > 0) {
            const years = [...new Set(allExams.map(exam => exam.year))].sort((a, b) => b - a);
            yearFilter.innerHTML = '<option value="">Όλα</option>' + 
                years.map(year => `<option value="${year}">${year}</option>`).join('');
        }
    }, 500);
}

// Show Error: Εμφανίζει μήνυμα σφάλματος
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Escape HTML: Προστατεύει από XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

