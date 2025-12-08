# 🔧 Troubleshooting - GitHub Pages Δεν Εμφανίζει Αλλαγές

## ✅ Έλεγχος Λίστα

### 1. GitHub Pages Ενεργοποιημένο;
- Πήγαινε στο repository → **Settings** → **Pages**
- **Source**: Πρέπει να είναι `main` (ή `master`) branch
- **Folder**: `/ (root)` ή `/docs`
- Αν δεν είναι ενεργοποιημένο, ενεργοποίησέ το!

### 2. Περίμενε 1-2 λεπτά
- Το GitHub Pages χρειάζεται **1-2 λεπτά** για να ανανεωθεί
- Κάνε refresh το site μετά από 2 λεπτά

### 3. Hard Refresh (Clear Cache)
- **Windows/Linux**: `Ctrl + Shift + R` ή `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`
- Ή άνοιξε το site σε **Incognito/Private window**

### 4. Έλεγχος Branch
- Βεβαιώσου ότι έκανες push στο **main** branch (όχι master ή άλλο)
- Έλεγξε: `git branch` (πρέπει να είσαι στο main)

### 5. Έλεγχος Αρχείων
- Βεβαιώσου ότι τα αρχεία είναι στο **root** του repository:
  - `index.html`
  - `app.js`
  - `styles.css`
  - `data/exams.json`
  - `admin-dashboard.html`
  - `admin-dashboard.js`
  - `exam-details.html`
  - `exam-details.js`
  - κλπ.

### 6. URL του GitHub Pages
- Το URL είναι: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`
- **ΠΡΟΣΟΧΗ**: Αν το repository λέγεται `foititothemata`, το URL είναι:
  - `https://YOUR-USERNAME.github.io/foititothemata/`
- **ΌΧΙ**: `https://YOUR-USERNAME.github.io/Foititothemata/` (case sensitive!)

### 7. Έλεγχος Commit
- Πήγαινε στο GitHub repository
- Έλεγξε το **Commits** tab
- Βεβαιώσου ότι το τελευταίο commit είναι εκεί

### 8. GitHub Actions (αν υπάρχει)
- Πήγαινε στο **Actions** tab
- Έλεγξε αν υπάρχουν errors

---

## 🔍 Βήμα-βήμα Έλεγχος

### Βήμα 1: Έλεγχος Git Status
```bash
git status
```
Πρέπει να δείχνει: `nothing to commit, working tree clean`

### Βήμα 2: Έλεγχος Remote
```bash
git remote -v
```
Πρέπει να δείχνει το GitHub repository URL

### Βήμα 3: Έλεγχος Push
```bash
git log --oneline -5
```
Πρέπει να δείχνει τα τελευταία commits

### Βήμα 4: Force Push (αν χρειάζεται)
```bash
git push origin main --force
```
**ΠΡΟΣΟΧΗ**: Χρησιμοποίησε `--force` μόνο αν είσαι σίγουρος!

---

## 🚨 Συχνά Προβλήματα

### Πρόβλημα 1: "404 Not Found"
**Λύση**: 
- Έλεγξε ότι το GitHub Pages είναι ενεργοποιημένο
- Έλεγξε το URL (case sensitive)
- Περίμενε 2-3 λεπτά

### Πρόβλημα 2: "Old version shows"
**Λύση**:
- Hard refresh (`Ctrl + Shift + R`)
- Clear browser cache
- Περίμενε 1-2 λεπτά

### Πρόβλημα 3: "Files not found"
**Λύση**:
- Έλεγξε ότι τα αρχεία είναι στο root (όχι σε `public/` folder)
- Έλεγξε τα paths στα HTML files

### Πρόβλημα 4: "GitHub Pages not building"
**Λύση**:
- Πήγαινε στο **Settings** → **Pages**
- Έλεγξε το **Source** branch
- Κάνε **Re-run** το build (αν υπάρχει Actions)

---

## 📋 Checklist

- [ ] GitHub Pages ενεργοποιημένο (Settings → Pages)
- [ ] Source branch: `main` (ή `master`)
- [ ] Περίμενες 1-2 λεπτά
- [ ] Έκανες hard refresh (`Ctrl + Shift + R`)
- [ ] Τα αρχεία είναι στο root folder
- [ ] Το URL είναι σωστό (case sensitive)
- [ ] Το commit είναι στο GitHub
- [ ] Δοκίμασες σε incognito window

---

## 🆘 Αν Τίποτα Δεν Λειτουργεί

1. **Διέγραψε και ξανα-δημιούργησε το GitHub Pages**:
   - Settings → Pages → Disable
   - Περίμενε 1 λεπτό
   - Enable ξανά

2. **Έλεγξε το GitHub Actions** (αν υπάρχει):
   - Actions tab → Έλεγξε για errors

3. **Δοκίμασε να κάνεις ένα νέο commit**:
   ```bash
   git commit --allow-empty -m "Trigger GitHub Pages rebuild"
   git push
   ```

4. **Έλεγξε τα Console Errors**:
   - Άνοιξε Developer Tools (F12)
   - Console tab → Έλεγξε για errors

---

## 📞 Χρήσιμα Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-github-pages)

---

## ✅ Quick Fix

Αν τίποτα δεν λειτουργεί, δοκίμασε αυτό:

1. **Disable GitHub Pages**: Settings → Pages → Disable
2. **Περίμενε 1 λεπτό**
3. **Enable ξανά**: Settings → Pages → Enable (Source: main)
4. **Περίμενε 2-3 λεπτά**
5. **Hard refresh** το site

---

## 🎯 Τι Να Ελέγξεις Τώρα

1. **Πήγαινε στο GitHub repository**
2. **Settings** → **Pages**
3. **Έλεγξε** αν είναι ενεργοποιημένο
4. **Έλεγξε** το Source branch
5. **Περίμενε 2 λεπτά**
6. **Hard refresh** (`Ctrl + Shift + R`)

---

## 💡 Tip

Το GitHub Pages URL είναι **πάντα**:
```
https://USERNAME.github.io/REPO-NAME/
```

**ΠΡΟΣΟΧΗ**: 
- Case sensitive (μικρά/μεγάλα γράμματα)
- Χωρίς `.git` στο τέλος
- Χωρίς trailing slash (συνήθως)

