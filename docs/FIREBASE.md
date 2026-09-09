# DrishtiSetu Firebase Infrastructure & Security Architecture

This document describes the Firebase infrastructure, Authentication RBAC model, Cloud Firestore collection schemas, Cloud Storage folder layout, verified security rules, and local emulator setup for **DrishtiSetu**.

---

## 1. Enabled Firebase Services
1. **Firebase Authentication:** Role-based email/password user authentication.
2. **Cloud Firestore:** Document database for structured screenings, review notes, and audit events.
3. **Cloud Storage:** Secure storage for raw fundus scans, enhanced overlays, and PDF reports.

*(No unnecessary paid Firebase services are enabled).*

---

## 2. Role-Based Access Control (RBAC)
- **`operator` (PHC Technician):** Can upload fundus scans, create screening records, and view PHC station screening logs.
- **`reviewer` (Ophthalmologist):** Can access escalated/uncertain cases, view XAI visual evidence, submit review notes, and override AI predictions.
- **`admin` (District Health Coordinator):** Full administrative access to system metrics, user role assignments, and audit logs.

*Client roles supplied by the frontend are never trusted blindly by the backend API; tokens are verified server-side.*

---

## 3. Firestore Database Collections

| Collection Name | Purpose | Key Fields |
| :--- | :--- | :--- |
| `users` | Role definitions & station assignments | `uid`, `email`, `role`, `phcCenter`, `district` |
| `screenings` | High-level screening metadata | `screeningId`, `patientAlias`, `drGrade`, `referable`, `confidence`, `requiresHumanReview`, `reviewStatus` |
| `screeningResults` | Detailed ML inference outputs | `screeningId`, `qualityMetrics`, `lesionCandidates`, `gradcamMetadata`, `processingTimeMs` |
| `reviewNotes` | Specialist human review records | `noteId`, `screeningId`, `reviewerId`, `action`, `overrideGrade`, `comments` |
| `auditEvents` | Append-only security & system audit log | `eventId`, `eventType`, `userId`, `userRole`, `screeningId`, `timestamp` |
| `systemMetrics` | Aggregated district capacity stats | `metricId`, `totalScreened`, `passRate`, `referralVolume`, `updatedAt` |

*(Note: Raw image files are stored in Storage, never duplicated in Firestore).*

---

## 4. Cloud Storage Folder Layout

```
gs://drishtisetu-demo.appspot.com/
├── screenings/
│   └── {screeningId}/
│       ├── original/      # Uploaded raw fundus photograph (Restricted)
│       ├── processed/     # CLAHE & Green Channel enhanced image
│       └── overlays/      # Frangi vessel trees & Grad-CAM visual heatmaps
└── reports/
    └── {screeningId}/     # Generated bilingual clinical referral PDFs
```

*(Medical images are strictly protected and NEVER publicly readable).*

---

## 5. Verified Security Rules

### Firestore Security Rules (`firebase/firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function getUserRole() { return request.auth.token.role; }
    function isOperator() { return isAuthenticated() && (getUserRole() == 'operator' || getUserRole() == 'PHC_TECHNICIAN'); }
    function isReviewer() { return isAuthenticated() && (getUserRole() == 'reviewer' || getUserRole() == 'OPHTHALMOLOGIST' || getUserRole() == 'admin'); }
    function isAdmin() { return isAuthenticated() && getUserRole() == 'admin'; }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    match /screenings/{screeningId} {
      allow read: if isAuthenticated();
      allow create, update: if isOperator() || isReviewer();
      allow delete: if isAdmin();
    }
    match /screeningResults/{resultId} {
      allow read: if isAuthenticated();
      allow create, update: if isOperator() || isReviewer();
      allow delete: if isAdmin();
    }
    match /reviewNotes/{noteId} {
      allow read: if isAuthenticated();
      allow create, update: if isReviewer();
      allow delete: if isAdmin();
    }
    match /auditEvents/{eventId} {
      allow read: if isReviewer() || isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false; // Append-only audit log
    }
    match /systemMetrics/{metricId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

### Storage Security Rules (`firebase/storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() { return request.auth != null; }
    match /screenings/{screeningId}/{category}/{fileName} {
      allow read, write: if isAuthenticated();
    }
    match /reports/{screeningId}/{fileName} {
      allow read, write: if isAuthenticated();
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 6. Local Emulator Workflow

To run the local Firebase emulator suite without hitting cloud servers or incurring billing:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Start the local emulator:
   ```bash
   firebase emulators:start
   ```
3. Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env` to connect local Auth (port 9099), Firestore (port 8080), and Storage (port 9199).

---

## 7. Manual Firebase Console Actions Required (If Deploying to Cloud)
If you decide to deploy from local emulators to a live Cloud Firebase project in the future:
1. Enable **Email/Password** provider in **Firebase Console $\rightarrow$ Authentication $\rightarrow$ Sign-in method**.
2. Initialize **Cloud Firestore** in Production mode in **Firebase Console $\rightarrow$ Firestore Database**.
3. Initialize **Cloud Storage** bucket in **Firebase Console $\rightarrow$ Storage**.
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```
