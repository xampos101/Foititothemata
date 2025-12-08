# 🚀 Οδηγίες Deployment

## Επιλογή 1: Railway (Συνιστάται - Εύκολο)

### Βήματα:

1. **Εγκατάσταση Git** (αν δεν το έχεις):
   - Κατέβασε: https://git-scm.com/download/win
   - Εγκατάσταση με default options

2. **Δημιουργία GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   - Πήγαινε στο https://github.com
   - Δημιούργησε νέο repository
   - Ακολούθησε τις οδηγίες για push

3. **Deploy στο Railway**:
   - Πήγαινε στο https://railway.app
   - Κάνε sign up με GitHub
   - "New Project" → "Deploy from GitHub repo"
   - Επίλεξε το repository σου
   - Railway θα εντοπίσει αυτόματα το Node.js project
   - Θα πάρεις ένα URL (π.χ. `your-app.railway.app`)

4. **Environment Variables** (στο Railway dashboard):
   - `PORT` - Railway το θέτει αυτόματα
   - Μπορείς να αλλάξεις το session secret αν θέλεις

### ⚠️ Σημαντικά:
- Το `uploads/` folder δεν ανεβαίνει στο Git (είναι στο .gitignore)
- Θα χρειαστεί να ανεβάσεις αρχεία μέσω του admin panel μετά το deployment
- Το `data/admins.json` δεν ανεβαίνει (ασφάλεια)

---

## Επιλογή 2: Render

1. Push στο GitHub (ίδια διαδικασία)
2. Πήγαινε στο https://render.com
3. "New" → "Web Service"
4. Σύνδεσε το GitHub repository
5. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Deploy!

---

## Επιλογή 3: Local Development (Για να δοκιμάσεις πρώτα)

Αν θέλεις να δοκιμάσεις τοπικά πριν το deployment:

1. **Εγκατάσταση Node.js**: https://nodejs.org/
2. **Εγκατάσταση dependencies**:
   ```bash
   npm install
   ```
3. **Εκκίνηση server**:
   ```bash
   npm start
   ```
4. Άνοιξε: http://localhost:3000

---

## 🔒 Ασφάλεια για Production

Πριν το deployment, αλλάξτε:

1. **Session Secret** στο `server.js`:
   ```javascript
   secret: process.env.SESSION_SECRET || 'your-random-secret-key-here'
   ```

2. **Default Admin Password**:
   - Login στο admin panel
   - Αλλάξτε το password μέσω του `data/admins.json` (local)
   - Ή προσθέστε νέο admin

3. **HTTPS**: Οι hosting platforms (Railway, Render) παρέχουν HTTPS αυτόματα

---

## 📝 Notes

- Το `node_modules/` δεν ανεβαίνει (το Git το αγνοεί)
- Το hosting platform θα τρέξει `npm install` αυτόματα
- Το PORT συνήθως το θέτει το hosting platform (Railway, Render)
- Για file uploads, χρειάζεται persistent storage (Railway/Render το παρέχουν)

