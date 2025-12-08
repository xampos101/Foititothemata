// Exam Details JavaScript
// Εμφανίζει όλες τις εξεταστικές ενός μαθήματος ομαδοποιημένες ανά έτος

// Global Variables
let allExams = [];
let courseExams = [];
let currentCourse = '';

// DOM Elements
const courseTitle = document.getElementById('courseTitle');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const noResults = document.getElementById('noResults');
const examsByYear = document.getElementById('examsByYear');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Παίρνει το course από το URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentCourse = decodeURIComponent(urlParams.get('course') || '');
    
    if (!currentCourse) {
        showError('Δεν επιλέχθηκε μάθημα.');
        return;
    }
    
    loadExams();
});

// Load Exams: Φορτώνει τα δεδομένα
async function loadExams() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        
        const response = await fetch('data/exams.json');
        
        if (!response.ok) {
            throw new Error('Σφάλμα κατά τη φόρτωση δεδομένων');
        }
        
        const data = await response.json();
        allExams = data.exams || [];
        
        // Φιλτράρει τα εξεταστικά για το συγκεκριμένο μάθημα
        courseExams = allExams.filter(exam => exam.course === currentCourse);
        
        if (courseExams.length === 0) {
            noResults.style.display = 'block';
            examsByYear.innerHTML = '';
            return;
        }
        
        // Ενημερώνει τον τίτλο
        courseTitle.textContent = `📚 ${escapeHtml(currentCourse)}`;
        
        // Εμφανίζει τις εξεταστικές ομαδοποιημένες ανά έτος
        displayExamsByYear();
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showError('Δεν ήταν δυνατή η φόρτωση των δεδομένων.');
    } finally {
        loading.style.display = 'none';
    }
}

// Display Exams By Year: Ομαδοποιεί και εμφανίζει τις εξεταστικές ανά έτος
function displayExamsByYear() {
    // Ομαδοποιεί ανά έτος
    const examsByYearMap = new Map();
    
    courseExams.forEach(exam => {
        if (!examsByYearMap.has(exam.year)) {
            examsByYearMap.set(exam.year, []);
        }
        examsByYearMap.get(exam.year).push(exam);
    });
    
    // Ταξινομεί τα έτη (πιο πρόσφατα πρώτα)
    const sortedYears = Array.from(examsByYearMap.keys()).sort((a, b) => b - a);
    
    examsByYear.innerHTML = sortedYears.map(year => {
        const yearExams = examsByYearMap.get(year);
        // Ταξινομεί ανά εξάμηνο και τύπο
        yearExams.sort((a, b) => {
            if (a.semester !== b.semester) return a.semester - b.semester;
            // Αν ίδιο εξάμηνο, ταξινομεί ανά τύπο
            const typeOrder = ['Ιανουαρίου', 'Ιουνίου', 'Σεπτεμβρίου'];
            const aType = a.type || '';
            const bType = b.type || '';
            const aIndex = typeOrder.findIndex(t => aType.includes(t));
            const bIndex = typeOrder.findIndex(t => bType.includes(t));
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            return 0;
        });
        
        return `
            <section class="year-section">
                <h2 class="year-header">📅 Έτος ${year}</h2>
                <div class="exams-grid">
                    ${yearExams.map(exam => createExamCard(exam)).join('')}
                </div>
            </section>
        `;
    }).join('');
}

// Create Exam Card: Δημιουργεί card για μια εξεταστική
function createExamCard(exam) {
    let fileDisplay = '';
    if (exam.file) {
        // Έλεγχος αν είναι data URL (base64)
        const isDataUrl = exam.file.startsWith('data:');
        
        if (isDataUrl) {
            // Data URL - ελέγχει το MIME type
            const mimeType = exam.file.split(';')[0].split(':')[1];
            if (mimeType.startsWith('image/')) {
                fileDisplay = `
                    <div class="exam-file-section">
                        <a href="${exam.file}" target="_blank" class="file-link-image" download="exam-image.png">📄 Προβολή Εικόνας</a>
                        <div class="image-preview">
                            <img src="${exam.file}" alt="Θέμα εξεταστικής" onclick="window.open('${exam.file}', '_blank')">
                        </div>
                    </div>
                `;
            } else if (mimeType === 'application/pdf') {
                fileDisplay = `
                    <div class="exam-file-section">
                        <a href="${exam.file}" target="_blank" class="file-link-pdf" download="exam.pdf">📄 Προβολή PDF</a>
                    </div>
                `;
            } else {
                // Generic data URL
                fileDisplay = `
                    <div class="exam-file-section">
                        <a href="${exam.file}" target="_blank" class="file-link-pdf" download="exam-file">📄 Προβολή Αρχείου</a>
                    </div>
                `;
            }
        } else {
            // Regular URL
            const fileExtension = exam.file.toLowerCase().split('.').pop();
            if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
                fileDisplay = `
                    <div class="exam-file-section">
                        <a href="${exam.file}" target="_blank" class="file-link-image">📄 Προβολή Εικόνας</a>
                        <div class="image-preview">
                            <img src="${exam.file}" alt="Θέμα εξεταστικής" onclick="window.open('${exam.file}', '_blank')">
                        </div>
                    </div>
                `;
            } else {
                fileDisplay = `
                    <div class="exam-file-section">
                        <a href="${exam.file}" target="_blank" class="file-link-pdf">📄 Προβολή PDF</a>
                    </div>
                `;
            }
        }
    }
    
    return `
        <div class="exam-card detail-card">
            <div class="exam-header">
                <h3>${escapeHtml(exam.type || 'Εξεταστική')}</h3>
                <span class="semester-badge">${exam.semester}ο Εξάμηνο</span>
            </div>
            ${exam.description ? `<div class="description">${escapeHtml(exam.description)}</div>` : ''}
            ${fileDisplay}
        </div>
    `;
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

