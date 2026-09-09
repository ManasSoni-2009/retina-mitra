# DrishtiSetu — Environment Setup Guide

**Document Version:** 1.0.0  
**Updated:** September 8, 2026  

This guide provides instructions for configuring environment variables for both the **Next.js Frontend** and **FastAPI Backend**.

---

## 1. Overview of Environment Files

- **Frontend Configuration:** Located at `frontend/.env.local` (local development) or set via Vercel / hosting dashboard.
- **Backend Configuration:** Located at `backend/.env` (local development) or set via Docker / cloud container environment.
- **Root Reference Example:** Located at `.env.example` in the project root.

---

## 2. Root `.env.example` Reference

```ini
# ==========================================
# DRISHTISETU ENVIRONMENT CONFIGURATION
# ==========================================

# ------------------------------------------
# FRONTEND CONFIGURATION (Next.js)
# ------------------------------------------
# Public URL of the FastAPI Backend API (Leave blank in development to use Next.js rewrite proxy)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Firebase Client Web Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=drishtisetu-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=drishtisetu-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=drishtisetu-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Optional: Enable Local Firebase Emulator Workflow (set 'true' for local emulators)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# ------------------------------------------
# BACKEND CONFIGURATION (FastAPI & PyTorch)
# ------------------------------------------
# Server binding configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production

# Security & CORS Origins (Comma-separated)
CORS_ORIGINS=http://localhost:3000,https://drishtisetu.web.app,https://drishtisetu.vercel.app

# Firebase Admin Service Account Credentials (SERVER ONLY - NEVER EXPOSE TO FRONTEND)
FIREBASE_PROJECT_ID=drishtisetu-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-service@drishtisetu-prod.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# PyTorch Model Checkpoint Paths
MODEL_PATH=ml/checkpoints/efficientnet_dr_v1.pth
SEGMENTATION_MODEL_PATH=ml/checkpoints/unet_lesions_v1.pth
MODEL_VERSION=2.4.0

# Quality Gate Thresholds
MIN_LAPLACIAN_VARIANCE=45.0
MIN_CONTRAST_RATIO=0.15
REFERABLE_PROB_THRESHOLD=0.45
UNCERTAINTY_ABSTAIN_THRESHOLD=0.35
```

---

## 3. Step-by-Step Setup

### Step 3.1: Frontend Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Populate the `NEXT_PUBLIC_FIREBASE_*` variables with values from your Firebase Console.

> ⚠️ **Important Security Rule:** Variables prefixed with `NEXT_PUBLIC_` are embedded into the client browser bundle. **Never** put private service account keys or backend database passwords into `NEXT_PUBLIC_` variables.

---

### Step 3.2: Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create `.env`:
   ```bash
   cp .env.example .env
   ```
3. Populate `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL` with your Firebase Admin Service Account details.
4. Verify that `MODEL_PATH` points to a valid PyTorch model file or directory.

---

## 4. Environment Security Best Practices

1. **`.gitignore` Safeguard:** Ensure `.env`, `.env.local`, and `*.pem` files are listed in `.gitignore`.
2. **Secret Rotation:** If a service account private key is ever checked into Git, revoke it immediately in the Google Cloud / Firebase console.
3. **Production Injection:** In production deployment environments (Google Cloud Run, AWS ECS, Vercel), inject environment variables securely via environment secret managers rather than committing `.env` files.
