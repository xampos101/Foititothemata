# 🚀 Οδηγίες Deployment στο GitHub

## Βήμα 1: Εγκατάσταση Git

### Windows:

1. **Κατέβασε το Git**:
   - Πήγαινε στο: https://git-scm.com/download/win
   - Κάνε κλικ στο "Download for Windows"
   - Θα κατεβάσει ένα installer

2. **Εγκατάσταση**:
   - Τρέξε το installer
   - Κάνε "Next" → "Next" → "Install" (με default options)
   - Κάνε "Finish"

3. **Επαλήθευση**:
   - **Κλείσε** το Terminal/PowerShell
   - **Άνοιξε νέο Terminal**
   - Τρέξε:
     ```powershell
     git --version
     ```
   - Θα πρέπει να δεις κάτι σαν: `git version 2.x.x`

---

## Βήμα 2: Δημιουργία GitHub Repository

1. **Πήγαινε στο GitHub**:
   - https://github.com
   - Κάνε login (ή sign up αν δεν έχεις account)

2. **Δημιούργησε νέο Repository**:
   - Κάνε κλικ στο **"+"** (πάνω δεξιά) → **"New repository"**
   - **Repository name**: `foititothemata` (ή ό,τι θέλεις)
   - **Description**: "Ιστοσελίδα για προβολή παλιών θεμάτων εξεταστικής"
   - **Public** ή **Private** (ό,τι προτιμάς)
   - **ΜΗΝ** επιλέξεις "Add a README file" (έχουμε ήδη)
   - Κάνε **"Create repository"**

3. **Αντιγράψε το Repository URL**:
   - Θα δεις κάτι σαν: `https://github.com/your-username/foititothemata.git`
   - Κράτα το για αργότερα

---

## Βήμα 3: Git Setup (Τοπικά)

### 3.1. Ρύθμιση Git (μόνο πρώτη φορά):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3.2. Αρχικοποίηση Repository:

```powershell
# Πήγαινε στον φάκελο του project
cd C:\Users\xampo\Desktop\Projects\Foititothemata

# Αρχικοποίηση Git
git init
```

### 3.3. Προσθήκη αρχείων:

```powershell
# Προσθήκη όλων των αρχείων (το .gitignore θα αγνοήσει τα "μη επιθυμητά")
git add .
```

### 3.4. Έλεγχος τι θα commit:

```powershell
git status
```

Θα δεις:
- **Green (staged)**: Αρχεία που θα commit ✅
- **Red (untracked)**: Νέα αρχεία
- **Gray**: Αρχεία που αγνοούνται (από .gitignore) ✅

**Σημαντικό**: Αν δεις `node_modules/` ή `data/admins.json` στη λίστα, κάτι πάει στραβά!

### 3.5. Commit:

```powershell
git commit -m "Initial commit - Modern design with animations"
```

---

## Βήμα 4: Σύνδεση με GitHub

### 4.1. Προσθήκη Remote:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

**Αντικατέστησε**:
- `YOUR-USERNAME` με το GitHub username σου
- `YOUR-REPO-NAME` με το όνομα του repository

**Παράδειγμα**:
```powershell
git remote add origin https://github.com/xampo/foititothemata.git
```

### 4.2. Push στο GitHub:

```powershell
git branch -M main
git push -u origin main
```

**Σημείωση**: Θα σου ζητήσει username και password:
- **Username**: Το GitHub username σου
- **Password**: **Personal Access Token** (όχι το GitHub password!)

---

## Βήμα 5: Personal Access Token (GitHub)

Αν σου ζητήσει password, χρειάζεσαι Personal Access Token:

1. **GitHub** → **Settings** (προφίλ σου)
2. **Developer settings** (κάτω αριστερά)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. **Note**: "Foititothemata Deployment"
6. **Expiration**: Επίλεξε διάρκεια
7. **Scopes**: Επιλέξτε **`repo`** (full control)
8. **Generate token**
9. **Αντιγράψε το token** (θα το δεις μόνο μια φορά!)
10. Χρησιμοποίησε το ως password όταν κάνεις push

---

## Βήμα 6: Επαλήθευση

1. **Πήγαινε στο GitHub repository** σου
2. **Refresh** τη σελίδα
3. Θα πρέπει να δεις **όλα τα αρχεία**!

---

## 📋 Checklist

- [ ] Git εγκατεστημένο
- [ ] `git --version` δουλεύει
- [ ] GitHub account
- [ ] Repository δημιουργημένο
- [ ] `git init` εκτελέστηκε
- [ ] `git add .` εκτελέστηκε
- [ ] `git status` ελέγχθηκε (δεν υπάρχουν node_modules/admins.json)
- [ ] `git commit` εκτελέστηκε
- [ ] Remote προστέθηκε
- [ ] Personal Access Token δημιουργήθηκε
- [ ] `git push` ολοκληρώθηκε
- [ ] Αρχεία εμφανίζονται στο GitHub

---

## 🔄 Επόμενες Αλλαγές

Για να κάνεις push νέες αλλαγές:

```powershell
git add .
git commit -m "Description of changes"
git push
```

---

## ⚠️ Σημαντικά

1. **ΜΗΝ** commit το `data/admins.json` (passwords!)
2. **ΜΗΝ** commit το `node_modules/` (πολύ μεγάλο)
3. **ΜΗΝ** commit το `uploads/` (uploaded files)
4. Το `.gitignore` τα αγνοεί αυτόματα ✅

---

## 🆘 Αντιμετώπιση Προβλημάτων

### "fatal: not a git repository"
- Τρέξε `git init` πρώτα

### "remote origin already exists"
- Τρέξε: `git remote remove origin`
- Μετά: `git remote add origin ...`

### "Authentication failed"
- Χρησιμοποίησε Personal Access Token, όχι password

### "Permission denied"
- Έλεγξε ότι έχεις access στο repository

---

## 🎉 Έτοιμο!

Μόλις ολοκληρώσεις, ο κώδικας θα είναι στο GitHub!

**Σημείωση**: Το GitHub **δεν τρέχει servers**. Για να τρέξει online, χρειάζεσαι hosting (Railway, Render, κλπ.) - δες το `DEPLOYMENT.md`!

