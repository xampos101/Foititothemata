# 🚀 GitHub Pages Deployment Guide

## ⚠️ Σημαντικό: GitHub Pages Limitations

Το **GitHub Pages** υποστηρίζει **μόνο static sites** (HTML, CSS, JavaScript). **ΔΕΝ** μπορεί να τρέξει Node.js backend.

### Τι θα χάσεις:
- ❌ Admin panel (login, authentication)
- ❌ File uploads (PDF/PNG)
- ❌ CRUD operations (προσθήκη/επεξεργασία/διαγραφή θεμάτων)

### Τι θα έχεις:
- ✅ Προβολή θεμάτων
- ✅ Αναζήτηση και φίλτρα
- ✅ Προβολή PDF/PNG (αν τα αρχεία είναι στο repository)

---

## 📋 Επιλογή 1: Static Version (GitHub Pages)

### Βήμα 1: Προετοιμασία

1. **Αντιγράψε τα static files**:
   - `public/index-static.html` → `index.html`
   - `public/app-static.js` → `app.js`
   - `public/styles.css` → `styles.css`
   - `data/exams.json` → `data/exams.json`

2. **Ανέβασε τα PDF/PNG αρχεία**:
   - Ανέβασε τα αρχεία στο repository (π.χ. `files/` folder)
   - Ενημέρωσε το `exams.json` με τα σωστά paths

### Βήμα 2: GitHub Repository Setup

1. **Δημιούργησε repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Πήγαινε στο repository → **Settings**
   - **Pages** (αριστερά)
   - **Source**: Επίλεξε `main` branch
   - **Folder**: `/ (root)`
   - **Save**

3. **URL**:
   - Θα είναι: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

### Βήμα 3: Ενημέρωση Paths

Στο `exams.json`, τα file paths πρέπει να είναι relative:
```json
{
  "file": "files/exam-2023.pdf"  // ✅ Σωστό
  "file": "/uploads/exam.pdf"    // ❌ Λάθος (δεν υπάρχει /uploads)
}
```

---

## 🎯 Επιλογή 2: Full-Featured Hosting (Συνιστάται)

Αν θέλεις **όλες** τις λειτουργίες (admin panel, uploads), χρησιμοποίησε:

### Railway (Δωρεάν, Εύκολο):
1. Push στο GitHub
2. https://railway.app → "Deploy from GitHub"
3. Επιλογή repository
4. Ready! 🎉

### Render (Δωρεάν):
1. Push στο GitHub
2. https://render.com → "New Web Service"
3. Σύνδεση GitHub → Επιλογή repository
4. Build: `npm install`
5. Start: `npm start`

### Vercel (Δωρεάν):
1. Push στο GitHub
2. https://vercel.com → "Import Project"
3. Επιλογή repository
4. Ready! 🎉

---

## 📁 Δομή για GitHub Pages

```
repository/
├── index.html          # (από index-static.html)
├── app.js             # (από app-static.js)
├── styles.css
├── data/
│   └── exams.json
└── files/             # PDF/PNG αρχεία εδώ
    ├── exam1.pdf
    ├── exam2.png
    └── ...
```

---

## 🔄 Workflow για Updates

### Static Version (GitHub Pages):
1. Επεξεργάσου το `data/exams.json` (local)
2. Ανέβασε νέα PDF/PNG στο `files/`
3. Commit & Push:
   ```bash
   git add .
   git commit -m "Update exams"
   git push
   ```

### Full Version (Railway/Render):
1. Login στο admin panel
2. Προσθήκη/επεξεργασία μέσω UI
3. Auto-deploy! 🎉

---

## ⚖️ Σύγκριση

| Feature | GitHub Pages | Railway/Render |
|---------|-------------|----------------|
| Προβολή θεμάτων | ✅ | ✅ |
| Αναζήτηση | ✅ | ✅ |
| Admin Panel | ❌ | ✅ |
| File Uploads | ❌ | ✅ |
| CRUD Operations | ❌ | ✅ |
| Cost | Δωρεάν | Δωρεάν |
| Setup | Εύκολο | Εύκολο |

---

## 💡 Σύσταση

**Για φοιτητική χρήση** (μόνο προβολή):
- GitHub Pages είναι αρκετό ✅

**Για πλήρη διαχείριση** (admin panel, uploads):
- Railway/Render/Vercel ✅

---

## 🆘 Αντιμετώπιση Προβλημάτων

### "404 Not Found" στο GitHub Pages:
- Έλεγξε ότι το `index.html` είναι στο root
- Έλεγξε τα paths στα `exams.json`

### "CORS Error":
- GitHub Pages δεν έχει CORS issues για static files
- Αν βλέπεις CORS, έλεγξε τα fetch paths

### "Files not loading":
- Έλεγξε ότι τα αρχεία είναι στο repository
- Έλεγξε τα paths (πρέπει να είναι relative)

---

## ✅ Checklist για GitHub Pages

- [ ] `index-static.html` → `index.html`
- [ ] `app-static.js` → `app.js`
- [ ] `data/exams.json` με σωστά paths
- [ ] PDF/PNG αρχεία στο repository
- [ ] GitHub Pages enabled
- [ ] Repository είναι public (για free GitHub Pages)

---

## 🎉 Έτοιμο!

Μόλις ολοκληρώσεις, η σελίδα θα είναι live στο:
`https://YOUR-USERNAME.github.io/YOUR-REPO/`

