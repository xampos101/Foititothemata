# 🚀 GitHub Pages - Quick Start Guide

## ✅ Έτοιμο για GitHub Pages!

Το project είναι **έτοιμο** για GitHub Pages deployment. Όλα τα static files είναι στο root directory.

---

## 📋 Βήματα Deployment

### 1. Δημιουργία GitHub Repository

1. Πήγαινε στο https://github.com
2. Κάνε **"New repository"**
3. **Repository name**: `foititothemata` (ή ό,τι θέλεις)
4. **Public** (για δωρεάν GitHub Pages)
5. **ΜΗΝ** επιλέξεις "Add a README"
6. Κάνε **"Create repository"**

### 2. Git Setup (Αν δεν έχεις Git, δες το GITHUB_DEPLOY.md)

```powershell
# 1. Αρχικοποίηση
git init

# 2. Προσθήκη αρχείων
git add .

# 3. Commit
git commit -m "Initial commit - GitHub Pages ready"

# 4. Σύνδεση με GitHub (αντικατέστησε YOUR-USERNAME και YOUR-REPO)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# 5. Push
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Πήγαινε στο repository → **Settings**
2. **Pages** (αριστερά στο menu)
3. **Source**: Επίλεξε `main` branch
4. **Folder**: `/ (root)`
5. Κάνε **Save**

### 4. Περίμενε 1-2 λεπτά

Το GitHub Pages χρειάζεται 1-2 λεπτά για να deploy.

### 5. Άνοιξε τη σελίδα!

Η σελίδα θα είναι live στο:
```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

**Παράδειγμα**: `https://xampo.github.io/foititothemata/`

---

## 📁 Δομή Αρχείων (GitHub Pages)

```
repository/
├── index.html          ✅ (στο root)
├── app.js             ✅ (στο root)
├── styles.css         ✅ (στο root)
├── data/
│   └── exams.json     ✅
└── files/              (προαιρετικό - για PDF/PNG)
    └── ...
```

---

## 📝 Προσθήκη PDF/PNG Αρχείων

### Αν θέλεις να προσθέσεις αρχεία:

1. **Δημιούργησε φάκελο `files/`**:
   ```powershell
   mkdir files
   ```

2. **Ανέβασε τα PDF/PNG** στο `files/` folder

3. **Ενημέρωσε το `data/exams.json`**:
   ```json
   {
     "file": "files/exam-2023.pdf"  // Relative path
   }
   ```

4. **Commit & Push**:
   ```powershell
   git add .
   git commit -m "Add exam files"
   git push
   ```

---

## 🔄 Updates (Ενημέρωση Θεμάτων)

### Για να προσθέσεις/αλλάξεις θέματα:

1. **Επεξεργάσου το `data/exams.json`** (local)
2. **Commit & Push**:
   ```powershell
   git add data/exams.json
   git commit -m "Update exams"
   git push
   ```
3. Το GitHub Pages θα ενημερωθεί αυτόματα σε 1-2 λεπτά!

---

## ⚠️ Σημαντικά

1. **Το repository πρέπει να είναι Public** (για δωρεάν GitHub Pages)
2. **Το `index.html` πρέπει να είναι στο root**
3. **Τα paths στα `exams.json` πρέπει να είναι relative** (π.χ. `files/exam.pdf`)
4. **Μέγιστο μέγεθος αρχείου**: 100MB (GitHub limit)

---

## 🎨 Features που Δουλεύουν

- ✅ Προβολή θεμάτων
- ✅ Αναζήτηση και φίλτρα
- ✅ Προβολή PDF/PNG
- ✅ Modern design με animations
- ✅ Responsive design

---

## ❌ Features που ΔΕΝ ΔουΛΕΥΟΥΝ

- ❌ Admin panel (χρειάζεται backend)
- ❌ File uploads (χρειάζεται backend)
- ❌ CRUD operations (χρειάζεται backend)

---

## 🆘 Αντιμετώπιση Προβλημάτων

### "404 Not Found"
- Έλεγξε ότι το `index.html` είναι στο root
- Περίμενε 2-3 λεπτά (GitHub Pages χρειάζεται χρόνο)

### "Data not loading"
- Έλεγξε ότι το `data/exams.json` υπάρχει
- Άνοιξε το browser console (F12) για errors

### "Files not found"
- Έλεγξε τα paths στο `exams.json` (πρέπει να είναι relative)
- Έλεγξε ότι τα αρχεία είναι στο repository

---

## ✅ Checklist

- [ ] Git εγκατεστημένο
- [ ] GitHub repository δημιουργημένο
- [ ] Αρχεία pushed στο GitHub
- [ ] GitHub Pages enabled
- [ ] Repository είναι Public
- [ ] Περίμενες 1-2 λεπτά
- [ ] Άνοιξες τη σελίδα!

---

## 🎉 Έτοιμο!

Μόλις ολοκληρώσεις, η σελίδα θα είναι live!

**URL**: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

