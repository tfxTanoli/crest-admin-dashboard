# Crest Admin Panel — Setup Guide

## 1. Firebase Web App

1. Open [Firebase Console](https://console.firebase.google.com) → your project (`education-app-c0164`)
2. **Project Settings → Your apps → Add app → Web**
3. Register with any nickname (e.g. "Admin Panel")
4. Copy the `firebaseConfig` values into `.env` (see `.env.example`)

> The mobile app uses Android/iOS API keys. The admin panel needs its own **Web** API key.

---

## 2. Environment Variables

```bash
cp .env.example .env
# then fill in your Web App credentials
```

---

## 3. Create Your First Admin User

Admins are identified by a document in the `admins` Firestore collection.
The document ID must equal the user's Firebase Auth UID.

### Step A — Create the Firebase Auth account

In **Firebase Console → Authentication → Users → Add user**, create:
- Email: `admin@yourdomain.com`
- Password: (strong password)

Note the generated **UID** (e.g. `abc123xyz`).

### Step B — Create the Firestore admin document

In **Firebase Console → Firestore → admins collection**, create a document:

```
Collection: admins
Document ID: <the UID from Step A>

Fields:
  uid   (string)  → same UID
  email (string)  → admin@yourdomain.com
  role  (string)  → "admin"   (or "superadmin")
```

That's it. The admin panel will verify this document on every login.

---

## 4. Install & Run

```bash
cd admin-panel
npm install
npm run dev        # http://localhost:5173
```

### Production build

```bash
npm run build      # output in dist/
npm run preview    # preview the production build locally
```

---

## 5. Deploy (Firebase Hosting — optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # set public dir to "dist", SPA: yes
npm run build
firebase deploy
```

---

## 6. Feature Summary

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/` | Live stats + 4 charts |
| Users | `/users` | Search, filter, block, stage edit, delete |
| Stage & Weeks | `/stage-management` | Force-unlock weeks, reset progression, unlock certs |
| Moderation | `/moderation` | Blocked & deleted user lists, restore/unblock |
| Groups & Chat | `/groups` | Realtime group messages, delete, send announcements |
| Private Chats | `/private-chats` | View DMs & invitations, delete messages |
| Payments | `/payments` | Paystack payment records with stats |
| Transactions | `/wallet` | Full transaction ledger |
| Withdrawals | `/withdrawals` | Approve / reject / mark paid |
| Distribution | `/distribution` | Edit split percentages and fees |
| Crests | `/crests` | Upload images, create/edit/toggle crests |
| System Config | `/system` | Key-value store for app announcements |
| Analytics | `/analytics` | 60-day growth, revenue, stage & group charts |

---

## 7. Firestore Rules

The updated `firestore.rules` in the mobile app folder now grants admins
read/write access to all collections via `isAdmin()` — which checks for the
caller's UID in the `admins` collection. Mobile user rules are **unchanged**.
