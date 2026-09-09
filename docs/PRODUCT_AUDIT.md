# DrishtiSetu — Product Audit & Transition Assessment

**Document Version:** 1.0.0  
**Audit Date:** September 8, 2026  
**Auditor:** Lead Product & Systems Architect

---

## 1. Executive Summary

DrishtiSetu has built a strong technical foundation covering OpenCV quality assessment, PyTorch DR severity classification, Grad-CAM explainability, U-Net lesion overlays, human-in-the-loop specialist review, and capacity simulation. However, the system currently exhibits several "prototype/demo" characteristics:

- Hardcoded sample screenings (`SCR-2026-001` to `SCR-2026-005`) in backend memory.
- A "Demo Mode Launchpad" banner in the frontend dashboard.
- Dark "AI-slop" visual theme (navy/cyan gradients, dark dashboards, glowing cards).
- Exposed technical jargon in navigation ("Grad-CAM", "Inference", "Simulink", "Temperature Scaling").
- Partial Firebase authentication integration on the frontend.

This audit establishes the roadmap to productionize DrishtiSetu into a **single, genuinely functional, modern, secure, and warm product** with **ZERO DEMO MODE**.

---

## 2. Component-by-Component Audit

### 2.1 Frontend Architecture (`frontend/`)
- **Current State:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons.
- **What Works:** Responsive pages, multi-layer canvas viewer, modal reports, offline sync engine (`syncEngine.ts`).
- **What is Mocked/Fake:** Hardcoded sample cases (`SCR-2026-001` - `005`), static fallback state in `screening/[id]/page.tsx`, fake KPI statistics on dashboard.
- **UI/UX Problems:** Dark navy/cyan theme ("AI slop" aesthetic), dense technical text, complex navigation labels, lack of warm human-centered typography and whitespace.
- **Remediation Plan:** Re-skin to a warm, bright, approachable visual language (off-white backgrounds, dark charcoal text, warm teal/coral accents). Remove all demo toggles and sample launchers. Implement clean empty states ("No screenings yet").

### 2.2 Backend API (`backend/`)
- **Current State:** FastAPI, Python 3.13, Pydantic v2, Uvicorn, OpenCV (`cv2`), PyTorch.
- **What Works:** `POST /api/v1/screenings`, `POST /api/v1/screenings/{id}/image`, `POST /api/v1/screenings/{id}/analyze`, OpenCV Quality Gate, Idempotency header checking (`X-Idempotency-Key`), RBAC role middleware.
- **What is Mocked/Fake:** In-memory dictionary `_IN_MEMORY_SCREENINGS` seeded with `SAMPLE_SCREENINGS` from `mock_data.py`.
- **Remediation Plan:** Purge mock data seeding. Support real persistence (Firestore / local JSON database) where user-created screenings persist dynamically across restarts.

### 2.3 ML Pipeline (`ml/`)
- **Current State:** EfficientNet-B0 / ConvNeXt backbone, Grad-CAM heatmap generator (`gradcam.py`), Frangi vesselness filter, U-Net lesion candidate overlays, Temperature Scaling calibration (`temperature_scaling.py`).
- **What Works:** Real OpenCV quality calculation, real Grad-CAM tensor gradient hooks, real vesselness extraction, calibrated confidence scoring.
- **What Requires Fixes:** Ensure `RealInferenceEngine` is resident in memory and gracefully returns `"Analysis unavailable"` with `requiresHumanReview = True` if model weights are missing or inference fails (never silent fake predictions).

### 2.4 Authentication & Security (`firebase/` & `backend/app/core/rbac.py`)
- **Current State:** `firestore.rules` and `storage.rules` defined. RBAC header checks in backend.
- **What is Missing:** Real Firebase Authentication UI flow (Sign In, Sign Out, session state, protected route redirects).
- **Remediation Plan:** Implement clean auth state provider and login interface.

### 2.5 Reports Engine
- **Current State:** `get_screening_report()` in `screenings.py` and `ReportModal.tsx` in frontend.
- **What Works:** Bilingual English/Marathi advice, structured quality & evidence items, print/PDF layout.
- **Remediation Plan:** Ensure reports generate purely from real persisted user screening records.

### 2.6 Capacity Simulation (`simulation/`)
- **Current State:** MATLAB scripts (`simulink_model_setup.m`, `run_simulink_scenario.m`) and Fast Python queue engine (`simulink_service.py`).
- **What Works:** Configurable inputs (patients/day, bandwidth Mbps, reviewer count) driving output throughput and delay metrics.
- **Remediation Plan:** Rename UI section to **"Workflow Capacity Simulator"**, clearly label web engine as interactive state-space approximation, and maintain MATLAB files.

---

## 3. Product Positioning & Non-Prescriptive Medical Safety

DrishtiSetu is an **explainable AI decision-support platform** for diabetic retinopathy screening. It is **NOT** a medical diagnostic system and does **NOT** replace an ophthalmologist.

### Language Standard Enforced Across UI & Reports:
- ✅ *"Screening result"* (Not *"Diagnosis"*)
- ✅ *"Possible signs detected — further review recommended"* (Not *"You have diabetic retinopathy"*)
- ✅ *"Quality Gate Assessment"* (Not *"AI Judgement"*)
- ✅ *"Refer for Ophthalmologist Evaluation"* (Not *"Treatment Plan"*)

---

## 4. Required Secrets & External Services

| Service | Environment Variable | Usage | Safe for Frontend? |
| :--- | :--- | :--- | :--- |
| **Firebase Project ID** | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore & Auth identity | Yes |
| **Firebase API Key** | `NEXT_PUBLIC_FIREBASE_API_KEY` | Client Web SDK Auth | Yes |
| **Firebase Auth Domain** | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client OAuth redirects | Yes |
| **Firebase Storage Bucket** | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Image asset storage | Yes |
| **Firebase App ID** | `NEXT_PUBLIC_FIREBASE_APP_ID` | Web App Identification | Yes |
| **Model Weights Path** | `MODEL_PATH` | PyTorch weight checkpoint (`ml/checkpoints/`) | Server Only |

---

## 5. Recommended Implementation Sequence (Milestones)

1. **Milestone 1:** Repository Audit (`docs/PRODUCT_AUDIT.md`) — *[COMPLETED]*
2. **Milestone 2:** Absolute Purge of Demo Mode & Seed Data (Clean Single Operational Mode)
3. **Milestone 3:** Complete Visual Redesign (Warm, bright, accessible theme; human-friendly language)
4. **Milestone 4:** Real End-to-End Screening Flow (Upload $\rightarrow$ Quality Gate $\rightarrow$ ML Engine $\rightarrow$ Result Workspace)
5. **Milestone 5:** Real Database Persistence (Backend JSON / Firestore persistence for user screenings)
6. **Milestone 6:** Firebase Authentication & Session Management
7. **Milestone 7:** Specialist Human Review Queue & Immutable Audit Trail
8. **Milestone 8:** Real Clinical Report Generation & PDF/Print Export
9. **Milestone 9:** Operational Insights & Real Data Analytics
10. **Milestone 10:** Workflow Capacity Simulator
11. **Milestone 11:** Rural Low-Connectivity Sync Engine (Real queueing without fake offline AI)
12. **Milestone 12:** Security Hardening & Secret Protection
13. **Milestone 13:** Automated Pytest & Build Verification
14. **Milestone 14:** Complete Documentation Package (`DEPLOYMENT.md`, `ENVIRONMENT_SETUP.md`, `API_KEYS.md`, `MODEL_SETUP.md`, `DATA_SETUP.md`, `FIREBASE.md`, `SAFETY.md`, `DEVELOPER_GUIDE.md`, `USER_GUIDE.md`, `FINAL_STATUS.md`, `README.md`)
