// Backend Server με Express.js
// Αυτός ο server εξυπηρετεί τα static files (HTML, CSS, JS) και παρέχει API endpoints

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000; // Χρησιμοποιεί PORT από environment variable (για hosting) ή 3000 για local

// Configuration: Ρυθμίσεις για sessions και file uploads
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(__dirname, 'data', 'exams.json');
const ADMINS_FILE = path.join(__dirname, 'data', 'admins.json');

// Δημιουργεί τον φάκελο uploads αν δεν υπάρχει
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Configuration: Ρυθμίσεις για upload αρχείων
// Αποδέχεται μόνο PDF και PNG αρχεία
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Δημιουργεί unique filename: timestamp-randomnumber-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Ελέγχει αν το αρχείο είναι PDF ή PNG
  if (file.mimetype === 'application/pdf' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Μόνο PDF και PNG αρχεία επιτρέπονται!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Μέγιστο 10MB
});

// Session Configuration: Ρυθμίσεις για sessions (για login)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production', // ΣΕ PRODUCTION ΑΛΛΑΞΕ ΑΥΤΟ!
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // true αν χρησιμοποιείς HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 ώρες
  }
}));

// Middleware: Επιτρέπει CORS (για να μπορεί το frontend να καλέσει το API)
app.use(cors());

// Middleware: Επιτρέπει parsing JSON από requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: Σερβίρει static files από το φάκελο 'public'
app.use(express.static('public'));

// Middleware: Σερβίρει uploaded files από το φάκελο 'uploads'
// Τα αρχεία θα είναι προσβάσιμα στο /uploads/filename
app.use('/uploads', express.static(UPLOAD_DIR));

// Helper Functions: Βοηθητικές συναρτήσεις
function readExams() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { exams: [] };
  }
}

function writeExams(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function readAdmins() {
  try {
    const data = fs.readFileSync(ADMINS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Default admin: username: admin, password: admin123
    const defaultAdmins = {
      admins: [{
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10) // hashed password
      }]
    };
    writeAdmins(defaultAdmins);
    return defaultAdmins;
  }
}

function writeAdmins(data) {
  if (!fs.existsSync(path.dirname(ADMINS_FILE))) {
    fs.mkdirSync(path.dirname(ADMINS_FILE), { recursive: true });
  }
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Middleware: Έλεγχος αν ο χρήστης είναι admin (για προστατευμένες routes)
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Απαιτείται σύνδεση ως admin' });
  }
}

// API Endpoint: Επιστρέφει όλα τα θέματα εξετάσεων
// GET /api/exams - Επιστρέφει όλα τα διαθέσιμα θέματα
app.get('/api/exams', (req, res) => {
  try {
    const data = readExams();
    res.json(data);
  } catch (error) {
    console.error('Σφάλμα κατά την ανάγνωση δεδομένων:', error);
    res.status(500).json({ error: 'Σφάλμα κατά την ανάγνωση δεδομένων' });
  }
});

// API Endpoint: Επιστρέφει θέματα με φίλτρο (ανά μάθημα, εξάμηνο, κλπ)
// GET /api/exams/filter?course=...&semester=... - Φιλτράρει τα θέματα
app.get('/api/exams/filter', (req, res) => {
  try {
    const { course, semester, year } = req.query;
    const allExams = readExams();
    
    // Φιλτράρει τα θέματα βάσει των παραμέτρων
    let filtered = allExams.exams || [];
    
    if (course) {
      filtered = filtered.filter(exam => 
        exam.course.toLowerCase().includes(course.toLowerCase())
      );
    }
    
    if (semester) {
      filtered = filtered.filter(exam => exam.semester === parseInt(semester));
    }
    
    if (year) {
      filtered = filtered.filter(exam => exam.year === parseInt(year));
    }
    
    res.json({ exams: filtered });
  } catch (error) {
    console.error('Σφάλμα κατά το φιλτράρισμα:', error);
    res.status(500).json({ error: 'Σφάλμα κατά το φιλτράρισμα' });
  }
});

// ============================================
// ADMIN ROUTES: Routes για διαχείριση από admins
// ============================================

// POST /api/admin/login - Login για admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username και password απαιτούνται' });
    }
    
    const adminsData = readAdmins();
    const admin = adminsData.admins.find(a => a.username === username);
    
    if (!admin) {
      return res.status(401).json({ error: 'Λάθος username ή password' });
    }
    
    // Ελέγχει το password (bcrypt comparison)
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Λάθος username ή password' });
    }
    
    // Δημιουργεί session
    req.session.isAdmin = true;
    req.session.username = username;
    
    res.json({ success: true, message: 'Επιτυχής σύνδεση!' });
  } catch (error) {
    console.error('Σφάλμα login:', error);
    res.status(500).json({ error: 'Σφάλμα κατά το login' });
  }
});

// POST /api/admin/logout - Logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Επιτυχής αποσύνδεση' });
});

// GET /api/admin/check - Ελέγχει αν ο χρήστης είναι logged in
app.get('/api/admin/check', (req, res) => {
  res.json({ isAdmin: !!(req.session && req.session.isAdmin) });
});

// POST /api/admin/exams - Προσθήκη νέου θέματος (με file upload)
// requireAuth: Μόνο logged in admins μπορούν να προσθέσουν θέματα
app.post('/api/admin/exams', requireAuth, upload.single('file'), (req, res) => {
  try {
    const { course, semester, year, type, description } = req.body;
    
    if (!course || !semester || !year) {
      return res.status(400).json({ error: 'Course, semester και year απαιτούνται' });
    }
    
    const data = readExams();
    const newId = data.exams.length > 0 
      ? Math.max(...data.exams.map(e => e.id)) + 1 
      : 1;
    
    const newExam = {
      id: newId,
      course: course.trim(),
      semester: parseInt(semester),
      year: parseInt(year),
      type: type || null,
      description: description || null,
      file: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString()
    };
    
    data.exams.push(newExam);
    writeExams(data);
    
    res.json({ success: true, exam: newExam });
  } catch (error) {
    console.error('Σφάλμα προσθήκης θέματος:', error);
    res.status(500).json({ error: 'Σφάλμα κατά την προσθήκη θέματος' });
  }
});

// PUT /api/admin/exams/:id - Ενημέρωση θέματος
app.put('/api/admin/exams/:id', requireAuth, upload.single('file'), (req, res) => {
  try {
    const examId = parseInt(req.params.id);
    const { course, semester, year, type, description } = req.body;
    
    const data = readExams();
    const examIndex = data.exams.findIndex(e => e.id === examId);
    
    if (examIndex === -1) {
      return res.status(404).json({ error: 'Θέμα δεν βρέθηκε' });
    }
    
    // Ενημερώνει τα δεδομένα
    if (course) data.exams[examIndex].course = course.trim();
    if (semester) data.exams[examIndex].semester = parseInt(semester);
    if (year) data.exams[examIndex].year = parseInt(year);
    if (type !== undefined) data.exams[examIndex].type = type || null;
    if (description !== undefined) data.exams[examIndex].description = description || null;
    
    // Αν ανέβηκε νέο αρχείο, διαγράφει το παλιό και αποθηκεύει το νέο
    if (req.file) {
      const oldFile = data.exams[examIndex].file;
      if (oldFile) {
        const oldFilePath = path.join(__dirname, oldFile);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      data.exams[examIndex].file = `/uploads/${req.file.filename}`;
    }
    
    data.exams[examIndex].updatedAt = new Date().toISOString();
    writeExams(data);
    
    res.json({ success: true, exam: data.exams[examIndex] });
  } catch (error) {
    console.error('Σφάλμα ενημέρωσης θέματος:', error);
    res.status(500).json({ error: 'Σφάλμα κατά την ενημέρωση θέματος' });
  }
});

// DELETE /api/admin/exams/:id - Διαγραφή θέματος
app.delete('/api/admin/exams/:id', requireAuth, (req, res) => {
  try {
    const examId = parseInt(req.params.id);
    const data = readExams();
    const examIndex = data.exams.findIndex(e => e.id === examId);
    
    if (examIndex === -1) {
      return res.status(404).json({ error: 'Θέμα δεν βρέθηκε' });
    }
    
    // Διαγράφει το αρχείο αν υπάρχει
    const exam = data.exams[examIndex];
    if (exam.file) {
      const filePath = path.join(__dirname, exam.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Διαγράφει το θέμα
    data.exams.splice(examIndex, 1);
    writeExams(data);
    
    res.json({ success: true, message: 'Θέμα διαγράφηκε επιτυχώς' });
  } catch (error) {
    console.error('Σφάλμα διαγραφής θέματος:', error);
    res.status(500).json({ error: 'Σφάλμα κατά τη διαγραφή θέματος' });
  }
});

// Εκκίνηση του server
app.listen(PORT, () => {
  console.log(`🚀 Server τρέχει στο http://localhost:${PORT}`);
  console.log(`📚 Ιστοσελίδα για Φοιτητικά Θέματα - Τμήμα Πληροφορικής Καβάλας`);
});
