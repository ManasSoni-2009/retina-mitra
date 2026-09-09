# DrishtiSetu — API Keys & External Services Documentation

**Document Version:** 1.0.0  
**Updated:** September 8, 2026  

This document details all external services, API keys, credentials, cost structures, and instructions for obtaining keys required by DrishtiSetu.

---

## 1. Summary of External Services

| Service Name | Purpose | Required / Optional | Pricing Tier / Cost | Exposable to Frontend? |
| :--- | :--- | :--- | :--- | :--- |
| **Firebase Authentication** | Identity management & user sign-in | Required for Auth | Free Tier (Spark Plan: 50k MAU) | Yes (`NEXT_PUBLIC_*`) |
| **Cloud Firestore** | Document storage for screenings & audit logs | Required for Cloud Sync | Free Tier (Spark Plan: 50k reads, 20k writes/day) | Yes (via Client SDK) |
| **Firebase Storage** | Retinal image cloud storage | Required for Cloud Backup | Free Tier (Spark Plan: 5GB storage, 1GB/day download) | Yes (via Client SDK) |
| **Firebase Admin SDK** | Backend administrative Firestore/Storage bypass | Optional (Local fallback available) | Included with Firebase project | **NO — SERVER ONLY** |

> ℹ️ **Zero External Inference APIs:** DrishtiSetu processes retinal images locally on the backend using PyTorch and OpenCV. It does **not** send patient images to third-party proprietary AI APIs (such as OpenAI or Google Vision API), eliminating external usage costs and safeguarding patient privacy.

---

## 2. Firebase Credentials Breakdown

### 2.1 Web Client Credentials (Frontend)

The frontend requires the following web client configuration keys:

- **`NEXT_PUBLIC_FIREBASE_API_KEY`**
- **`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`**
- **`NEXT_PUBLIC_FIREBASE_PROJECT_ID`**
- **`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`**
- **`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`**
- **`NEXT_PUBLIC_FIREBASE_APP_ID`**

#### How to Obtain:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (or click **Add Project** to create one).
3. In **Project Settings** > **General**, scroll to **Your apps**.
4. Click **Web App (`</>`)** and register `DrishtiSetu`.
5. Copy the `firebaseConfig` object values into your `frontend/.env.local`.

---

### 2.2 Server Service Account Key (Backend)

The backend requires the following service account credentials for administrative access:

- **`FIREBASE_PROJECT_ID`**
- **`FIREBASE_CLIENT_EMAIL`**
- **`FIREBASE_PRIVATE_KEY`**

#### How to Obtain:
1. Go to [Firebase Console](https://console.firebase.google.com/) > **Project Settings** > **Service Accounts**.
2. Click **Generate New Private Key**.
3. Download the JSON file.
4. Extract `project_id`, `client_email`, and `private_key` into your `backend/.env`.

---

## 3. Clear Placeholder Setup Instructions

If you need to populate `.env` files for the first time, use the exact placeholder format below:

```ini
# Frontend Placeholder Example (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Backend Placeholder Example (backend/.env)
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@YOUR_PROJECT_ID.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## 4. Local Offline / Emulator Support

If Firebase credentials are not provided, DrishtiSetu automatically falls back to:
- **Local Persistence Engine:** Stores screening records in `backend/app/db/screenings_db.json`.
- **Local Media Storage:** Stores images in `backend/static/uploads/`.
- **Firebase Emulator Mode:** Supports local emulator testing via setting `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`.
