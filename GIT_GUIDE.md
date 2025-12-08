# 📦 Git Commit Guide

## ✅ Αρχεία που ΠΡΕΠΕΙ να κάνεις commit:

### Source Code (Κώδικας):
- ✅ `server.js` - Backend server
- ✅ `package.json` - Dependencies και scripts
- ✅ `package-lock.json` - (θα δημιουργηθεί με npm install, commit το)

### Frontend Files:
- ✅ `public/index.html` - Αρχική σελίδα
- ✅ `public/admin-login.html` - Admin login
- ✅ `public/admin-dashboard.html` - Admin dashboard
- ✅ `public/app.js` - Frontend JavaScript
- ✅ `public/admin-login.js` - Admin login logic
- ✅ `public/admin-dashboard.js` - Admin dashboard logic
- ✅ `public/styles.css` - Βασικά styles
- ✅ `public/admin-styles.css` - Admin styles

### Configuration Files:
- ✅ `.gitignore` - Τι να αγνοεί το Git
- ✅ `Procfile` - Για Heroku/Railway
- ✅ `railway.json` - Για Railway deployment

### Documentation:
- ✅ `README.md` - Βασική τεκμηρίωση
- ✅ `DEPLOYMENT.md` - Οδηγίες deployment
- ✅ `SETUP_GUIDE.md` - Οδηγίες setup

### Data (Μερικά):
- ✅ `data/exams.json` - Τα θέματα εξετάσεων (ΜΟΝΟ αν θέλεις sample data)
- ❌ `data/admins.json` - **ΜΗΝ** commit (passwords!)

---

## ❌ Αρχεία που ΔΕΝ πρέπει να commit:

### Auto-generated / Dependencies:
- ❌ `node_modules/` - Βιβλιοθήκες (θα εγκατασταθούν με npm install)
- ❌ `package-lock.json` - (Στην πραγματικότητα, ΚΑΝΕ το commit - βοηθάει)

### Sensitive Data (Ασφάλεια):
- ❌ `data/admins.json` - **ΠΟΤΕ!** (περιέχει hashed passwords)
- ❌ `.env` - Environment variables (αν το προσθέσεις)

### User Uploads:
- ❌ `uploads/` - Uploaded files (PDF/PNG) - πολύ μεγάλα, δεν χρειάζονται

### System Files:
- ❌ `.DS_Store` - Mac system files
- ❌ `*.log` - Log files

---

## 🚀 Πώς να κάνεις commit:

### 1. Αρχικοποίηση Git (μόνο πρώτη φορά):
```bash
git init
```

### 2. Προσθήκη αρχείων:
```bash
git add .
```
Αυτό προσθέτει **όλα** τα αρχεία, αλλά το `.gitignore` θα αγνοήσει αυτά που δεν θέλουμε.

### 3. Έλεγχος τι θα commit:
```bash
git status
```
Θα δεις ποια αρχεία είναι "staged" (έτοιμα για commit).

### 4. Commit:
```bash
git commit -m "Initial commit - Φοιτητικά Θέματα website"
```

### 5. Προσθήκη remote (GitHub):
```bash
git remote add origin https://github.com/your-username/your-repo.git
```

### 6. Push:
```bash
git push -u origin main
```

---

## 📋 Checklist πριν το commit:

- [ ] Έχω ελέγξει το `.gitignore` (είναι σωστό)
- [ ] Δεν υπάρχει `data/admins.json` στη λίστα (ασφάλεια!)
- [ ] Δεν υπάρχει `node_modules/` στη λίστα
- [ ] Δεν υπάρχει `uploads/` στη λίστα
- [ ] Όλα τα source files είναι included

---

## ⚠️ Σημαντικό:

### `data/exams.json`:
- **Μπορείς** να το commit αν θέλεις sample data
- **Μπορείς** να το αφαιρέσεις από Git αν δεν θέλεις sample data
- Αν το αφαιρέσεις, το admin panel θα δημιουργήσει νέο άδειο

### `data/admins.json`:
- **ΠΟΤΕ** μην το commit!
- Περιέχει hashed passwords
- Κάθε admin θα πρέπει να το δημιουργήσει τοπικά

---

## 🔍 Έλεγχος τι θα commit:

Πριν το commit, τρέξε:
```bash
git status
```

Θα δεις:
- **Green (staged)**: Αρχεία που θα commit
- **Red (untracked)**: Αρχεία που το Git δεν παρακολουθεί
- **Gray**: Αρχεία που αγνοούνται (από .gitignore)

---

## 💡 Tip:

Αν θέλεις να δεις **ακριβώς** τι θα commit:
```bash
git diff --cached
```

Αυτό δείχνει τις αλλαγές που είναι staged.

