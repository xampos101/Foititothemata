# 📖 Admin Panel - Οδηγός Χρήσης

## 🔑 Login

1. **Username**: `admin`
2. **Password**: `admin`

---

## ⚙️ Πρώτη Ρύθμιση (Μόνο μία φορά)

### Βήμα 1: Δημιουργία GitHub Personal Access Token

1. **Πήγαινε στο GitHub**:
   - https://github.com → Κάνε κλικ στο **προφίλ σου** (πάνω δεξιά)
   - **Settings** → **Developer settings** (κάτω αριστερά)
   - **Personal access tokens** → **Tokens (classic)**
   - **Generate new token** → **Generate new token (classic)**

2. **Ρυθμίσεις Token**:
   - **Note**: "Foititothemata Admin Panel" (οτιδήποτε)
   - **Expiration**: Επίλεξε διάρκεια (π.χ. 90 days, 1 year)
   - **Scopes**: Επιλέξτε **μόνο**:
     - ✅ **`repo`** (Full control of private repositories)
   
3. **Generate token**
4. **Αντιγράψε το token** (θα το δεις μόνο μια φορά!)
   - Θα είναι κάτι σαν: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Βήμα 2: Βρες το Repository Path

Το **Repository path** είναι το:
```
username/repo-name
```

**Πώς το βρίσκεις:**

1. **Πήγαινε στο GitHub repository σου**
2. **Κοίτα το URL**:
   ```
   https://github.com/YOUR-USERNAME/YOUR-REPO-NAME
   ```
3. **Το repository path είναι**:
   ```
   YOUR-USERNAME/YOUR-REPO-NAME
   ```

**Παραδείγματα:**
- Αν το URL είναι: `https://github.com/xampo/foititothemata`
- Το repository path είναι: `xampo/foititothemata`

- Αν το URL είναι: `https://github.com/john/my-exams`
- Το repository path είναι: `john/my-exams`

### Βήμα 3: Ρύθμιση στο Admin Panel

1. **Άνοιξε το Admin Panel**:
   - Πήγαινε στο: `https://YOUR-USERNAME.github.io/YOUR-REPO/admin-dashboard.html`
   - Κάνε login με: `admin` / `admin`

2. **Συμπλήρωσε τα πεδία**:
   - **GitHub Personal Access Token**: Επικόλλησε το token που δημιούργησες
   - **Repository (username/repo)**: Βάλε `username/repo-name`
     - Παράδειγμα: `xampo/foititothemata`

3. **Κάνε "Αποθήκευση Config"**
   - Το token αποθηκεύεται στο **localStorage** (μόνο στο browser σου)
   - Το GitHub Setup section θα εξαφανιστεί

---

## 📤 Πώς να Ανέβεις Αρχείο

### Μέθοδος 1: File Upload (Αυτόματο)

1. **Πήγαινε στο Admin Panel**
2. **Συμπλήρωσε τη φόρμα "Προσθήκη Νέου Θέματος"**:
   - **Μάθημα***: π.χ. "Προγραμματισμός Υπολογιστών"
   - **Εξάμηνο***: Επίλεξε (1-8)
   - **Έτος***: π.χ. 2024
   - **Τύπος Εξεταστικής**: π.χ. "Εξεταστική Ιανουαρίου" (προαιρετικό)
   - **Περιγραφή**: (προαιρετικό)
   - **Αρχείο**: Επίλεξε PDF ή PNG (μέχρι 5-10MB)

3. **Κάνε "Προσθήκη Θέματος"**
4. **Το admin panel θα**:
   - Μετατρέψει το αρχείο σε base64
   - Προσθέσει το θέμα στο JSON
   - Κάνει **αυτόματο commit** στο GitHub
   - Το αρχείο αποθηκεύεται **απευθείας στο JSON** (ως data URL)

5. **Τέλος!** Το θέμα είναι διαθέσιμο αμέσως

### Μέθοδος 2: Manual URL (Για μεγάλα αρχεία)

Αν το αρχείο είναι >10MB, μπορείς να:

1. **Ανέβασε το αρχείο σε external hosting**:
   - Google Drive (share → Get link)
   - Dropbox (share → Get link)
   - GitHub (ανέβασέ το manual στο repository)

2. **Στο Admin Panel**:
   - Αφήσε το "Αρχείο" κενό
   - Μετά την προσθήκη, επεξεργάσου το θέμα
   - Βάλε το URL στο "URL Αρχείου" (αν υπάρχει field)

---

## ✏️ Επεξεργασία Θέματος

1. **Κάνε κλικ στο "✏️ Επεξεργασία"** στο θέμα που θέλεις
2. **Αλλάξε τα πεδία**
3. **(Προαιρετικό) Ανέβασε νέο αρχείο**
4. **Κάνε "Αποθήκευση Αλλαγών"**
5. **Αυτόματο commit** στο GitHub

---

## 🗑️ Διαγραφή Θέματος

1. **Κάνε κλικ στο "🗑️ Διαγραφή"**
2. **Επιβεβαιώσε** τη διαγραφή
3. **Αυτόματο commit** στο GitHub

---

## ⚠️ Σημαντικά

### Repository Path Format:
- ✅ **Σωστό**: `xampo/foititothemata`
- ✅ **Σωστό**: `john/my-exams`
- ❌ **Λάθος**: `https://github.com/xampo/foititothemata`
- ❌ **Λάθος**: `xampo/foititothemata.git`
- ❌ **Λάθος**: `xampo/foititothemata/`

### Token Security:
- **Το token αποθηκεύεται στο localStorage** (μόνο στο browser σου)
- **Μην μοιράζεσαι το token** με άλλους
- **Αν το token διαρρεύσει**, κάνε revoke και δημιούργησε νέο

### File Size Limits:
- **PNG/JPG**: Μέχρι 5MB
- **PDF**: Μέχρι 10MB
- **Μεγαλύτερα αρχεία**: Χρειάζονται external hosting

---

## 🔄 Workflow

```
1. Login → Admin Panel
2. Setup GitHub (μία φορά) → Token + Repository
3. Προσθήκη Θέματος → File Upload
4. Αυτόματο Commit → GitHub
5. Τέλος! (Διαθέσιμο αμέσως)
```

---

## 📝 Παράδειγμα

**Repository URL**: `https://github.com/xampo/foititothemata`

**Στο Admin Panel βάζεις**:
- **GitHub Personal Access Token**: `ghp_xxxxxxxxxxxx`
- **Repository**: `xampo/foititothemata`

**Όχι**:
- ❌ `https://github.com/xampo/foititothemata`
- ❌ `xampo/foititothemata.git`
- ❌ `xampo/foititothemata/`

---

## 🆘 Αντιμετώπιση Προβλημάτων

### "401 Unauthorized"
- Έλεγξε ότι το token είναι σωστό
- Έλεγξε ότι το token έχει `repo` scope
- Το token μπορεί να έχει λήξει

### "404 Not Found" (repository)
- Έλεγξε ότι το repository path είναι σωστό
- Format: `username/repo-name` (χωρίς https://, .git, κλπ.)

### "File too large"
- GitHub API limit: 25MB (αλλά εμείς έχουμε 5-10MB limit)
- Αν το αρχείο είναι μεγαλύτερο, χρησιμοποίησε external hosting

---

## ✅ Checklist

- [ ] GitHub Personal Access Token δημιουργήθηκε
- [ ] Token έχει `repo` scope
- [ ] Repository path βρέθηκε (username/repo-name)
- [ ] Admin panel config συμπληρώθηκε
- [ ] Test upload ολοκληρώθηκε επιτυχώς

---

## 🎉 Έτοιμο!

Μόλις ολοκληρώσεις, μπορείς να:
- Προσθέτεις θέματα με file upload
- Επεξεργάζεσαι θέματα
- Διαγράφεις θέματα
- Όλα **αυτόματα** στο GitHub! 🚀

