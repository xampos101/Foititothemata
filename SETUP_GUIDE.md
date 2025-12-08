# 🛠️ Οδηγίες Τοπικής Εγκατάστασης

## Βήμα 1: Εγκατάσταση Node.js

### Windows:

1. **Κατέβασε το Node.js**:
   - Πήγαινε στο: https://nodejs.org/
   - Κάνε κλικ στο **"LTS"** button (Long Term Support - συνιστάται)
   - Θα κατεβάσει ένα `.msi` αρχείο

2. **Εγκατάσταση**:
   - Τρέξε το installer που κατέβασες
   - Κάνε "Next" → "Next" → "Install"
   - ⚠️ **Σημαντικό**: Βεβαιώσου ότι είναι επιλεγμένο το **"Add to PATH"** (συνήθως είναι)
   - Κάνε "Finish"

3. **Επαλήθευση**:
   - **Κλείσε** το τρέχον Terminal/PowerShell
   - **Άνοιξε νέο Terminal** (ή restart το Cursor/VS Code)
   - Τρέξε:
     ```powershell
     node -v
     npm -v
     ```
   - Θα πρέπει να δεις κάτι σαν:
     ```
     v20.x.x
     10.x.x
     ```

---

## Βήμα 2: Εγκατάσταση Dependencies

Μόλις εγκαταστήσεις το Node.js:

1. **Άνοιξε Terminal** στον φάκελο του project:
   ```powershell
   cd C:\Users\xampo\Desktop\Projects\Foititothemata
   ```

2. **Εγκατάσταση βιβλιοθηκών**:
   ```powershell
   npm install
   ```
   
   Αυτό θα:
   - Διαβάσει το `package.json`
   - Κατεβάσει όλες τις απαραίτητες βιβλιοθήκες (express, multer, κλπ.)
   - Τις τοποθετήσει στον φάκελο `node_modules/`
   
   ⏱️ **Χρόνος**: 1-3 λεπτά (ανάλογα με την ταχύτητα internet)

---

## Βήμα 3: Εκκίνηση Server

Μόλις ολοκληρωθεί το `npm install`:

```powershell
npm start
```

Θα δεις:
```
🚀 Server τρέχει στο http://localhost:3000
📚 Ιστοσελίδα για Φοιτητικά Θέματα - Τμήμα Πληροφορικής Καβάλας
```

---

## Βήμα 4: Άνοιγμα στον Browser

1. Άνοιξε τον browser (Chrome, Firefox, Edge, κλπ.)
2. Πήγαινε στο: **http://localhost:3000**
3. Θα δεις την αρχική σελίδα!

---

## Βήμα 5: Δοκιμή Admin Panel

1. Κάνε κλικ στο **"⚙️ Admin"** link στην κεφαλίδα
2. Ή πήγαινε απευθείας στο: **http://localhost:3000/admin-login.html**
3. **Login**:
   - Username: `admin`
   - Password: `admin123`
4. Θα μπεις στο Admin Dashboard!

---

## 🔧 Αντιμετώπιση Προβλημάτων

### "npm is not recognized"
- Κάνε **restart** το Terminal
- Κάνε **restart** τον υπολογιστή (αν δεν λειτουργεί)
- Ελέγξτε το PATH: Windows → Environment Variables

### "Port 3000 is already in use"
- Κλείσε άλλο πρόγραμμα που χρησιμοποιεί το port 3000
- Ή αλλάξτε το PORT στο `server.js`

### "Cannot find module"
- Τρέξε ξανά: `npm install`

---

## ✅ Checklist

- [ ] Node.js εγκατεστημένο
- [ ] `node -v` δουλεύει
- [ ] `npm -v` δουλεύει
- [ ] `npm install` ολοκληρώθηκε
- [ ] `npm start` τρέχει
- [ ] Browser ανοίγει http://localhost:3000
- [ ] Admin login δουλεύει

---

## 🎉 Έτοιμο!

Μόλις δεις την σελίδα στον browser, είσαι έτοιμος! 

Μπορείς να:
- Προσθέσεις θέματα μέσω του admin panel
- Ανέβεις PDF/PNG αρχεία
- Δοκιμάσεις τα φίλτρα αναζήτησης

