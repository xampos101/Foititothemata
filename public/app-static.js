// Static Version για GitHub Pages
// Διαβάζει τα δεδομένα απευθείας από το JSON file (χωρίς backend API)

// Global Variables
let allExams = [];

// DOM Elements
const examsContainer = document.getElementById('examsContainer');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const noResults = document.getElementById('noResults');
const courseFilter = document.getElementById('courseFilter');
const semesterFilter = document.getElementById('semesterFilter');
const yearFilter = document.getElementById('yearFilter');
const clearFiltersBtn = document.getElementById('clearFilters');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadExams();
    setupEventListeners();
    populateYearFilter();
});

// Load Exams: Διαβάζει από το JSON file απευθείας
async function loadExams() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        
        // Διαβάζει το JSON file απευθείας (για GitHub Pages)
        const response = await fetch('data/exams.json');
        
        if (!response.ok) {
            throw new Error('Σφάλμα κατά τη φόρτωση δεδομένων');
        }
        
        const data = await response.json();
        allExams = data.exams || [];
        
        displayExams(allExams);
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showError('Δεν ήταν δυνατή η φόρτωση των δεδομένων.');
    } finally {
        loading.style.display = 'none';
    }
}

// Display Exams: Εμφανίζει τα θέματα
function displayExams(exams) {
    if (exams.length === 0) {
        noResults.style.display = 'block';
        examsContainer.innerHTML = '';
        return;
    }
    
    noResults.style.display = 'none';
    
    examsContainer.innerHTML = exams.map(exam => {
        let fileDisplay = '';
        if (exam.file) {
            const fileExtension = exam.file.toLowerCase().split('.').pop();
            if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
                fileDisplay = `
                    <div style="margin-top: 1rem;">
                        <a href="${exam.file}" target="_blank" style="display: inline-block; margin-bottom: 0.5rem; color: #667eea; text-decoration: none; font-weight: 600;">📄 Προβολή Εικόνας</a>
                        <div style="margin-top: 0.5rem;">
                            <img src="${exam.file}" alt="Θέμα εξεταστικής" style="max-width: 100%; border-radius: 8px; border: 2px solid #e0e0e0; cursor: pointer;" onclick="window.open('${exam.file}', '_blank')">
                        </div>
                    </div>
                `;
            } else {
                fileDisplay = `
                    <div style="margin-top: 1rem;">
                        <a href="${exam.file}" target="_blank" style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.3s;" onmouseover="this.style.background='linear-gradient(135deg, #5568d3 0%, #653a92 100%)'" onmouseout="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'">📄 Προβολή PDF</a>
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

// Filter Exams
function filterExams() {
    const course = courseFilter.value.toLowerCase().trim();
    const semester = semesterFilter.value;
    const year = yearFilter.value;
    
    const filtered = allExams.filter(exam => {
        const matchesCourse = !course || exam.course.toLowerCase().includes(course);
        const matchesSemester = !semester || exam.semester === parseInt(semester);
        const matchesYear = !year || exam.year === parseInt(year);
        
        return matchesCourse && matchesSemester && matchesYear;
    });
    
    displayExams(filtered);
}

// Setup Event Listeners
function setupEventListeners() {
    courseFilter.addEventListener('input', filterExams);
    semesterFilter.addEventListener('change', filterExams);
    yearFilter.addEventListener('change', filterExams);
    
    clearFiltersBtn.addEventListener('click', () => {
        courseFilter.value = '';
        semesterFilter.value = '';
        yearFilter.value = '';
        filterExams();
    });
}

// Populate Year Filter
function populateYearFilter() {
    setTimeout(() => {
        if (allExams.length > 0) {
            const years = [...new Set(allExams.map(exam => exam.year))].sort((a, b) => b - a);
            yearFilter.innerHTML = '<option value="">Όλα</option>' + 
                years.map(year => `<option value="${year}">${year}</option>`).join('');
        }
    }, 500);
}

// Show Error
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

