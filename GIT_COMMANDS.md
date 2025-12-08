# 🚀 Git Commands για PyCharm Terminal

## 📋 Εντολές για Upload στο GitHub

### Βήμα 1: Αρχικοποίηση Git (μόνο πρώτη φορά)

```bash
git init
```

### Βήμα 2: Προσθήκη όλων των αρχείων

```bash
git add .
```

**Σημείωση**: Το `.gitignore` θα αγνοήσει αυτόματα:
- `node_modules/`
- `data/admins.json`
- `uploads/`
- `.env`, `*.log`, κλπ.

### Βήμα 3: Έλεγχος τι θα commit (προαιρετικό)

```bash
git status
```

Θα δεις ποια αρχεία είναι "staged" (έτοιμα για commit).

### Βήμα 4: Commit

```bash
git commit -m "Initial commit - Φοιτητικά Θέματα με Admin Panel"
```

### Βήμα 5: Προσθήκη Remote (GitHub Repository)

**Αντικατέστησε `YOUR-USERNAME` και `YOUR-REPO-NAME`**:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

**Παράδειγμα**:
```bash
git remote add origin https://github.com/xampo/foititothemata.git
```

### Βήμα 6: Push στο GitHub

```bash
git branch -M main
git push -u origin main
```

**Σημείωση**: Αν σου ζητήσει username/password:
- **Username**: Το GitHub username σου
- **Password**: **Personal Access Token** (όχι το GitHub password!)

---

## 🔄 Επόμενες Αλλαγές (Updates)

Για να κάνεις push νέες αλλαγές:

```bash
git add .
git commit -m "Description of changes"
git push
```

---

## 📝 Παράδειγμα: Πλήρης Workflow

```bash
# 1. Αρχικοποίηση
git init

# 2. Προσθήκη αρχείων
git add .

# 3. Commit
git commit -m "Initial commit - Φοιτητικά Θέματα"

# 4. Προσθήκη remote (αντικατέστησε με το δικό σου)
git remote add origin https://github.com/xampo/foititothemata.git

# 5. Push
git branch -M main
git push -u origin main
```

---

## ⚠️ Αντιμετώπιση Προβλημάτων

### "fatal: not a git repository"
```bash
git init
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
```

### "Authentication failed"
- Χρησιμοποίησε **Personal Access Token**, όχι password
- Δημιούργησε token: GitHub → Settings → Developer settings → Personal access tokens

### "Permission denied"
- Έλεγξε ότι έχεις access στο repository
- Έλεγξε ότι το repository path είναι σωστό

---

## ✅ Checklist

- [ ] `git init` εκτελέστηκε
- [ ] `git add .` εκτελέστηκε
- [ ] `git status` ελέγχθηκε (δεν υπάρχουν node_modules/admins.json)
- [ ] `git commit` εκτελέστηκε
- [ ] GitHub repository δημιουργήθηκε
- [ ] `git remote add origin` εκτελέστηκε
- [ ] Personal Access Token έτοιμο
- [ ] `git push` ολοκληρώθηκε
- [ ] Αρχεία εμφανίζονται στο GitHub

---

## 🎯 Quick Copy-Paste (Αν έχεις ήδη repository)

```bash
git init
git add .
git commit -m "Initial commit - Φοιτητικά Θέματα"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

**Αντικατέστησε**:
- `YOUR-USERNAME` → Το GitHub username σου
- `YOUR-REPO` → Το όνομα του repository σου

---

## 📚 Επιπλέον Εντολές

### Δες τι άλλαξε:
```bash
git status
```

### Δες τις αλλαγές:
```bash
git diff
```

### Δες το ιστορικό:
```bash
git log
```

### Ανέβασε νέες αλλαγές:
```bash
git add .
git commit -m "Update description"
git push
```

---

## 🎉 Έτοιμο!

Μόλις ολοκληρώσεις, τα αρχεία θα είναι στο GitHub!

