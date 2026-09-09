# Retina-Mitra — Explainable Retinal Image Screening & Decision-Support System

[![System Version](https://img.shields.io/badge/System_Version-2.4.0--production-teal.svg)](#)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)

---

## 1. Product Positioning & Purpose

**Retina-Mitra** is an explainable retinal image decision-support system designed for diabetic retinopathy (DR) screening. It combines OpenCV computer vision quality assessment, PyTorch machine learning DR severity grading, Grad-CAM and morphological explainability overlays, calibrated uncertainty estimation, and specialist human-in-the-loop (HITL) review workflows.

> ⚠️ **Non-Prescriptive Medical Safety Notice:**  
> Retina-Mitra is **NOT** a medical diagnostic system and does **NOT** replace an ophthalmologist. It provides calibrated screening decision support and routes complex or uncertain cases to human specialists. All outputs use non-prescriptive terminology (*"Screening result"*, *"Possible signs detected"*, *"Human review recommended"*).

---

## 2. Key Product Architecture

- **Light & Warm Visual Interface:** Clean, accessible off-white and slate UI (`slate-900`, `teal-700`, `slate-50`) built with Next.js 16, React 19, TypeScript, and Tailwind CSS.
- **Zero Demo Mode:** Single, operational mode with zero fake patient databases or hardcoded sample toggles.
- **Opencv Image Quality Gate:** Evaluates focus variance, illumination range, contrast ratio, field coverage, and glare artifacts before ML processing.
- **PyTorch DR Classification:** 5-class DR severity grading (Level 0: No DR to Level 4: Proliferative DR) using EfficientNet-B0 backbone fine-tuned on retinal datasets.
- **Multi-Layer Explainability:** Interactive canvas viewer rendering 6 visual layers (*Original*, *Enhanced CLAHE*, *Retinal Vessels*, *Lesion Candidates*, *Grad-CAM Model Attention*, and *Combined Evidence*).
- **Temperature Scaling & Uncertainty Abstention:** Calibrated confidence scoring with automatic human-review routing for low-certainty or ungradable scans.
- **Specialist Human-in-the-Loop Workspace:** 3-column review workspace allowing specialists to accept, override (with mandatory rationale), or re-route screening outcomes.
- **Real Database Persistence:** Dual persistence engine with local JSON database backing (`backend/app/db/screenings_db.json`) and Firebase Cloud Firestore / Storage sync.
- **Clinical Report Engine:** Dynamic bilingual report generation (English / Marathi) with direct print and PDF export.
- **Rural Low-Connectivity Sync:** IndexedDB/localStorage queue engine for interrupted network connectivity without fake offline AI.

---

## 3. Quick Start Guide

### Step 1: Clone Repository
```bash
git clone https://github.com/drishtisetu/drishtisetu.git
cd drishtisetu
```

### Step 2: Start Backend (FastAPI & PyTorch)
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000
```

### Step 3: Start Frontend (Next.js)
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 4. Documentation Index

The complete documentation suite is available in the `docs/` directory:

| Document | Purpose |
| :--- | :--- |
| **[FINAL_STATUS.md](docs/FINAL_STATUS.md)** | Component implementation status matrix, real/mock verification report |
| **[PRODUCT_AUDIT.md](docs/PRODUCT_AUDIT.md)** | Initial product architecture audit & roadmap |
| **[ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)** | Environment variable setup guide (`.env`, `.env.local`) |
| **[API_KEYS.md](docs/API_KEYS.md)** | Firebase credentials setup, pricing tiers, and safety rules |
| **[MODEL_SETUP.md](docs/MODEL_SETUP.md)** | PyTorch model architecture, checkpoints, and explainability setup |
| **[DATA_SETUP.md](docs/DATA_SETUP.md)** | Dataset acquisition (APTOS 2019, IDRiD, DRIVE, Messidor-2) & splits |
| **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** | Step-by-step production deployment instructions |
| **[USER_GUIDE.md](docs/USER_GUIDE.md)** | Operator & specialist user manual |
| **[DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** | Developer onboarding, architecture, and testing guide |
| **[FIREBASE.md](docs/FIREBASE.md)** | Firestore schema, Storage configuration, and Security Rules |
| **[SAFETY.md](docs/SAFETY.md)** | Medical safety disclosures and non-prescriptive standards |
| **[SIMULATION.md](docs/SIMULATION.md)** | Workflow capacity simulation guide (Python queueing + Simulink) |

---

## 5. Running Automated Verification Tests

### Run Backend Unit Tests:
```bash
pytest backend/tests ml/tests -v
```

### Run Frontend Production Build:
```bash
cd frontend
npm run build
```

---

## 6. License & Compliance

Retina-Mitra is released under the **MIT License**. Dataset adapters operate under the research licenses of APTOS, IDRiD, DRIVE, and Messidor-2 datasets.
