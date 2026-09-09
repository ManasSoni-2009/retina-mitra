# DrishtiSetu — Step-by-Step Production Deployment Guide

**Document Version:** 1.0.0  
**Updated:** September 8, 2026  

This guide provides step-by-step instructions for deploying DrishtiSetu into production, covering Firebase, the FastAPI backend container, the Next.js frontend, environment configuration, and verification checks.

---

## 1. Production Architecture Summary

```
USER BROWSER
     │
     ▼
NEXT.JS FRONTEND (Vercel / Firebase App Hosting)
     │
     ▼ (HTTPS API Calls)
FASTAPI BACKEND CONTAINER (Google Cloud Run / AWS ECS / Docker)
     │
     ├──────────────────────────┐
     ▼                          ▼
PYTORCH & OPENCV PIPELINE   FIREBASE (Auth, Firestore, Storage)
```

---

## 2. Firebase Configuration & Deployment

### Step 1: Initialize Firebase Project
1. Log in to Firebase CLI:
   ```bash
   firebase login
   ```
2. Link the local project:
   ```bash
   firebase use --add
   ```

### Step 2: Deploy Firestore & Storage Security Rules
Deploy security rules to enforce role-based authorization for database and media storage:
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## 3. FastAPI Backend Deployment (Docker Container)

The backend runs python inference with OpenCV and PyTorch. Build and launch using Docker:

### Step 1: Build Docker Image
```bash
cd backend
docker build -t drishtisetu-backend:latest .
```

### Step 2: Test Container Locally
```bash
docker run -d -p 8000:8000 \
  --env-file .env \
  --name drishtisetu-api \
  drishtisetu-backend:latest
```

### Step 3: Deploy to Cloud Container Host (e.g., Google Cloud Run)
```bash
gcloud run deploy drishtisetu-backend \
  --image gcr.io/YOUR_PROJECT_ID/drishtisetu-backend:latest \
  --platform managed \
  --region asia-south1 \
  --set-env-vars ENVIRONMENT=production
```

---

## 4. Next.js Frontend Deployment (Vercel / Firebase App Hosting)

### Deploying to Vercel:
1. Push your repository to GitHub.
2. Import project into Vercel dashboard.
3. Set root directory to `frontend`.
4. Configure Environment Variables in Vercel settings:
   - `NEXT_PUBLIC_API_URL=https://your-backend-api.run.app`
   - `NEXT_PUBLIC_FIREBASE_API_KEY=...`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID=...`
5. Click **Deploy**.

---

## 5. Post-Deployment Verification Checklist

Execute the following sequential steps to verify production health:

- [ ] **1. Verify API Health Check:**
  `GET https://your-backend-api.run.app/health` returns `200 OK` with status `healthy`.
- [ ] **2. Verify Authentication Flow:**
  Sign in as an operator on the web interface. Confirm Firebase Auth token generation.
- [ ] **3. Upload Test Retinal Scan:**
  Submit a valid fundus image on `/screening/new`.
- [ ] **4. Verify Quality Assessment Gate:**
  Confirm that OpenCV evaluates focus, lighting, and contrast without errors.
- [ ] **5. Verify ML Inference & Explainability:**
  Confirm that PyTorch DR grading returns calibrated confidence, Grad-CAM attention maps, and vessel overlays.
- [ ] **6. Verify Human Review Routing:**
  Open `/review` and confirm the screening appears in the review workspace.
- [ ] **7. Verify Persistence:**
  Refresh the page or re-query `GET /api/v1/screenings` to confirm database retention.
- [ ] **8. Verify Report Generation:**
  Open the screening result and download the clinical report PDF.
