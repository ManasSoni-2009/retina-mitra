# DrishtiSetu — Developer Onboarding & Architecture Guide

**Document Version:** 1.0.0  
**Updated:** September 8, 2026  

This guide provides technical onboarding instructions for developers maintaining or extending DrishtiSetu.

---

## 1. Codebase Structure

```
drishtisetu/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # FastAPI routes (screenings, review, insights, health)
│   │   ├── core/            # Config, security, logging
│   │   ├── db/              # Persistent database JSON engine (`screenings_db.json`)
│   │   ├── services/        # Database, quality gate, ML wrapper, reports
│   │   └── main.py          # FastAPI application entrypoint
│   └── static/uploads/      # Stored retinal fundus images
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js 16 App Router pages (screening, history, review, etc.)
│   │   ├── components/      # UI components (Navbar, CanvasImageViewer, ReportModal)
│   │   ├── context/         # AuthContext provider
│   │   ├── lib/             # API client, Firebase configuration
│   │   └── services/        # Sync engine for offline queueing
├── ml/
│   ├── checkpoints/         # PyTorch weights (.pth)
│   ├── datasets/            # Dataset loaders for APTOS, IDRiD, DRIVE, Messidor-2
│   ├── explainability/      # Grad-CAM heatmap generator
│   ├── models/              # EfficientNet architecture
│   └── preprocessing/       # CLAHE, OpenCV quality assessment
├── docs/                    # Full system documentation suite
├── tests/                   # Pytest automated test suite
├── docker-compose.yml       # Container orchestration
└── firebase.json            # Firebase hosting & rules configuration
```

---

## 2. Local Development Setup

### Prerequisites:
- Python 3.11+
- Node.js 18+ & npm
- Docker (optional)

### Step 1: Clone & Install Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```

### Step 2: Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000` and proxies API requests to `http://localhost:8000`.

---

## 3. Running Automated Test Suites

### Backend Unit Tests:
```bash
pytest backend/tests ml/tests -v
```

### Frontend Build Verification:
```bash
cd frontend
npm run build
```

---

## 4. Engineering Standards & Code Rules

1. **Strict Non-Diagnostic Terminology:** Never output absolute diagnostic statements ("Patient has DR"). Always use non-prescriptive decision-support phrasing ("Screening result", "Possible signs detected").
2. **Zero Fake Inference / Demo Fallbacks:** If ML inference fails or weights are absent, return explicit ungradable error responses. Never mock fake predictions.
3. **Clean Relative Paths:** Frontend API calls must use relative routes (`/api/v1/...`) to enable proxy rewriting without hardcoded localhost URLs.
