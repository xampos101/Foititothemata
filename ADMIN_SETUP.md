# ⚙️ Admin Panel Setup Guide

## 🎯 Πώς λειτουργεί

Το Admin Panel χρησιμοποιεί **GitHub API** για να:
- Ανέβει PDF/PNG αρχεία στο repository
- Ενημερώνει το `exams.json` απευθείας
- Κάνει commit στο GitHub

---

## 📋 Βήμα 1: Δημιουργία GitHub Personal Access Token

1. **Πήγαινε στο GitHub**:
   - https://github.com → **Settings** (προφίλ σου)
   - **Developer settings** (κάτω αριστερά)
   - **Personal access tokens** → **Tokens (classic)**
   - **Generate new token** → **Generate new token (classic)**

2. **Ρυθμίσεις Token**:
   - **Note**: "Foititothemata Admin Panel"
   - **Expiration**: Επίλεξε διάρκεια (π.χ. 90 days, 1 year)
   - **Scopes**: Επιλέξτε:
     - ✅ **`repo`** (Full control of private repositories)
     - ✅ **`workflow`** (Update GitHub Action workflows) - προαιρετικό

3. **Generate token**
4. **Αντιγράψε το token** (θα το δεις μόνο μια φορά!)
   - Θα είναι κάτι σαν: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 📋 Βήμα 2: Ρύθμιση Admin Panel

1. **Άνοιξε το Admin Panel**:
   - Πήγαινε στο: `https://YOUR-USERNAME.github.io/YOUR-REPO/admin-dashboard.html`

2. **Συμπλήρωσε τα πεδία**:
   - **GitHub Personal Access Token**: Επικόλλησε το token
   - **Repository**: `username/repo-name` (π.χ. `xampo/foititothemata`)

3. **Κάνε "Αποθήκευση Config"**
   - Το token αποθηκεύεται στο **localStorage** (μόνο στο browser σου)

---

## 📋 Βήμα 3: Δημιουργία φακέλου `files/`

Για να λειτουργήσουν τα uploads, χρειάζεται φάκελος `files/` στο repository:

1. **Στο GitHub repository**:
   - Κάνε **"Add file"** → **"Create new file"**
   - Path: `files/.gitkeep`
   - Κάνε commit

2. **Ή μέσω Git**:
   ```bash
   mkdir files
   touch files/.gitkeep
   git add files/.gitkeep
   git commit -m "Add files directory"
   git push
   ```

---

## ✅ Χρήση Admin Panel

### Προσθήκη Νέου Θέματος:

1. Συμπλήρωσε τα πεδία:
   - Μάθημα *
   - Εξάμηνο *
   - Έτος *
   - Τύπος Εξεταστικής (προαιρετικό)
   - Περιγραφή (προαιρετικό)
   - Αρχείο (PDF/PNG) *

2. Κάνε **"Προσθήκη Θέματος"**
3. Το admin panel θα:
   - Ανέβει το αρχείο στο `files/` folder
   - Προσθέσει το θέμα στο `exams.json`
   - Κάνει commit στο GitHub

### Επεξεργασία Θέματος:

1. Κάνε κλικ στο **"✏️ Επεξεργασία"**
2. Αλλάξτε τα πεδία
3. (Προαιρετικό) Ανέβασε νέο αρχείο
4. Κάνε **"Αποθήκευση Αλλαγών"**

### Διαγραφή Θέματος:

1. Κάνε κλικ στο **"🗑️ Διαγραφή"**
2. Επιβεβαιώσε τη διαγραφή
3. Το θέμα θα διαγραφεί από το `exams.json`

---

## ⚠️ Σημαντικά

### Ασφάλεια:

- **Το token αποθηκεύεται στο localStorage** (μόνο στο browser σου)
- **Μην μοιράζεσαι το token** με άλλους
- **Αν το token διαρρεύσει**, κάνε revoke και δημιούργησε νέο

### GitHub Limits:

- **Μέγιστο μέγεθος αρχείου**: 25MB (GitHub API limit)
- **Μέγιστο μέγεθος repository**: 100GB
- **Rate limits**: 5,000 requests/hour (αρκετό για κανονική χρήση)

### File Paths:

- Τα αρχεία αποθηκεύονται στο: `files/filename.pdf`
- Το URL για GitHub Pages: `https://raw.githubusercontent.com/USERNAME/REPO/main/files/filename.pdf`
- Το admin panel δημιουργεί αυτόματα το σωστό URL

---

## 🔧 Αντιμετώπιση Προβλημάτων

### "401 Unauthorized"
- Έλεγξε ότι το token είναι σωστό
- Έλεγξε ότι το token έχει `repo` scope
- Το token μπορεί να έχει λήξει

### "404 Not Found" (repository)
- Έλεγξε ότι το repository path είναι σωστό (username/repo-name)
- Έλεγξε ότι έχεις access στο repository

### "File too large"
- GitHub API limit: 25MB
- Αν το αρχείο είναι μεγαλύτερο, χρησιμοποίησε GitHub Desktop ή Git CLI

### "Failed to update exams.json"
- Έλεγξε ότι το `data/exams.json` υπάρχει στο repository
- Έλεγξε ότι έχεις write permissions

---

## 🔄 Workflow

1. **Admin** ανοίγει το admin panel
2. **Συμπληρώνει** GitHub token & repo (μία φορά)
3. **Προσθέτει** θέματα με upload αρχείων
4. **GitHub API** ανεβάζει αρχεία και ενημερώνει JSON
5. **GitHub Pages** ανανεώνεται αυτόματα (1-2 λεπτά)
6. **Φοιτητές** βλέπουν τα νέα θέματα!

---

## 📝 Notes

- Το admin panel είναι **public** (όλοι μπορούν να το δουν)
- Μόνο όσοι έχουν **GitHub token** μπορούν να κάνουν uploads
- Το token είναι **local** (αποθηκεύεται μόνο στο browser σου)
- Κάθε admin χρειάζεται **δικό του token**

---

## ✅ Checklist

- [ ] GitHub Personal Access Token δημιουργήθηκε
- [ ] Token έχει `repo` scope
- [ ] `files/` folder δημιουργήθηκε στο repository
- [ ] Admin panel config συμπληρώθηκε
- [ ] Test upload ολοκληρώθηκε επιτυχώς

---

## 🎉 Έτοιμο!

Μόλις ολοκληρώσεις, μπορείς να:
- Προσθέτεις θέματα
- Ανέβεις PDF/PNG αρχεία
- Επεξεργάζεσαι/διαγράφεις θέματα
- Όλα μέσω GitHub API! 🚀

