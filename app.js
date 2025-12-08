// Static Version για GitHub Pages
// Εμφανίζει μόνο μαθήματα - κάθε μάθημα οδηγεί σε σελίδα με τις εξεταστικές του

// Global Variables
let allExams = [];
let uniqueCourses = [];

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
        
        const response = await fetch('data/exams.json');
        
        if (!response.ok) {
            throw new Error('Σφάλμα κατά τη φόρτωση δεδομένων');
        }
        
        const data = await response.json();
        allExams = data.exams || [];
        
        // Ομαδοποιεί τα μαθήματα (unique courses)
        groupCourses();
        displayCourses();
        
    } catch (error) {
        console.error('Σφάλμα:', error);
        showError('Δεν ήταν δυνατή η φόρτωση των δεδομένων.');
    } finally {
        loading.style.display = 'none';
    }
}

// Group Courses: Ομαδοποιεί τα μαθήματα (unique courses)
function groupCourses() {
    const courseMap = new Map();
    
    allExams.forEach(exam => {
        if (!courseMap.has(exam.course)) {
            courseMap.set(exam.course, {
                course: exam.course,
                semester: exam.semester,
                examCount: 0,
                years: new Set(),
                latestYear: exam.year
            });
        }
        
        const courseData = courseMap.get(exam.course);
        courseData.examCount++;
        courseData.years.add(exam.year);
        if (exam.year > courseData.latestYear) {
            courseData.latestYear = exam.year;
        }
    });
    
    uniqueCourses = Array.from(courseMap.values()).map(course => ({
        ...course,
        years: Array.from(course.years).sort((a, b) => b - a)
    }));
}

// Display Courses: Εμφανίζει τα μαθήματα ως cards
function displayCourses() {
    if (uniqueCourses.length === 0) {
        noResults.style.display = 'block';
        examsContainer.innerHTML = '';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Φιλτράρει τα μαθήματα
    let filtered = uniqueCourses;
    
    const courseFilterValue = courseFilter.value.toLowerCase().trim();
    const semesterFilterValue = semesterFilter.value;
    const yearFilterValue = yearFilter.value;
    
    if (courseFilterValue) {
        filtered = filtered.filter(c => c.course.toLowerCase().includes(courseFilterValue));
    }
    
    if (semesterFilterValue) {
        filtered = filtered.filter(c => c.semester === parseInt(semesterFilterValue));
    }
    
    if (yearFilterValue) {
        filtered = filtered.filter(c => c.years.includes(parseInt(yearFilterValue)));
    }
    
    if (filtered.length === 0) {
        noResults.style.display = 'block';
        examsContainer.innerHTML = '';
        return;
    }
    
    // Ταξινομεί ανά όνομα μαθήματος
    filtered.sort((a, b) => a.course.localeCompare(b.course));
    
    examsContainer.innerHTML = filtered.map(course => {
        // URL για τη σελίδα λεπτομερειών (με URL encoding για ελληνικά)
        const courseUrl = `exam-details.html?course=${encodeURIComponent(course.course)}`;
        
        return `
            <div class="exam-card course-card" onclick="window.location.href='${courseUrl}'">
                <h3>${escapeHtml(course.course)}</h3>
                <div class="meta">
                    <span>📚 ${course.semester}ο Εξάμηνο</span>
                    <span>📝 ${course.examCount} ${course.examCount === 1 ? 'Εξεταστική' : 'Εξεταστικές'}</span>
                </div>
                <div class="course-years">
                    <strong>Έτη:</strong> ${course.years.join(', ')}
                </div>
                <div class="course-action">
                    <span class="view-exams-btn">👁️ Προβολή Εξεταστικών →</span>
                </div>
            </div>
        `;
    }).join('');
}

// Filter Courses: Φιλτράρει τα μαθήματα
function filterCourses() {
    displayCourses();
}

// Setup Event Listeners
function setupEventListeners() {
    courseFilter.addEventListener('input', filterCourses);
    semesterFilter.addEventListener('change', filterCourses);
    yearFilter.addEventListener('change', filterCourses);
    
    clearFiltersBtn.addEventListener('click', () => {
        courseFilter.value = '';
        semesterFilter.value = '';
        yearFilter.value = '';
        filterCourses();
    });
}

// Populate Year Filter: Γεμίζει το dropdown με τα διαθέσιμα έτη
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
