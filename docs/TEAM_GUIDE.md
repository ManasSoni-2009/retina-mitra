# DrishtiSetu Team & Student Handover Guide

Welcome to **DrishtiSetu**! This guide is written specifically for students, developers, and maintainers to navigate the codebase, understand the architecture, run tests, debug issues, and deploy trained deep learning models for Diabetic Retinopathy screening in rural India.

---

## 1. Project Directory Architecture

```
drishtisetu/
├── frontend/        # Next.js 14+ Web Application (React 19, TypeScript, Vanilla CSS/Tailwind)
├── backend/         # Python FastAPI Backend & REST API Routers
├── ml/              # Machine Learning Pipeline (PyTorch, OpenCV, Grad-CAM, UNet, Temperature Scaling)
├── firebase/        # Security Rules (firestore.rules, storage.rules) & Config
├── simulation/      # MATLAB & Simulink Capacity Models (.m & .slx setup scripts)
├── docs/            # Technical Specifications, QA Reports, Demo Flows, Dataset Guides
└── tests/           # Automated Pytest and Integration Test Suites
```

### Module Responsibilities:
- **`frontend/`**: Interactive web app for PHC operators and retina specialists. Contains 11 clean routes including Dashboard, Screening Workspace, Review Queue, and Capacity Simulation.
- **`backend/`**: FastAPI REST API handling image uploads, OpenCV quality checks, PyTorch ML pipeline execution, RBAC authorization, and idempotency protection.
- **`ml/`**: Machine Learning pipeline modules cleanly split by responsibility:
  - `ml/classification/`: EfficientNet-B0 / ConvNeXt backbone model & 5-class ICDR loss functions.
  - `ml/explainability/`: Grad-CAM heatmap generator (`gradcam.py`).
  - `ml/segmentation/`: Frangi vessel extraction & U-Net lesion candidate detection.
  - `ml/calibration/`: Post-processing Temperature Scaling & uncertainty entropy calculation.
  - `ml/datasets/`: Dataset loaders for APTOS 2019, IDRiD, DRIVE, Messidor-2.
- **`firebase/`**: Firestore & Storage security rules enforcing RBAC permissions and append-only audit trails.
- **`simulation/`**: MATLAB setup scripts (`simulink_model_setup.m`, `run_simulink_scenario.m`) for district queuing dynamics.

---

## 2. How to Run the System

### 2.1 Backend (Python FastAPI)
1. Navigate to project root:
   ```bash
   cd C:\Users\user\.gemini\antigravity\scratch\drishtisetu\backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start Uvicorn development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
4. Access interactive API docs at `http://localhost:8000/docs`.

### 2.2 Frontend (Next.js)
1. Navigate to frontend folder:
   ```bash
   cd C:\Users\user\.gemini\antigravity\scratch\drishtisetu\frontend
   ```
2. Install Node dependencies (if needed):
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open web application at `http://localhost:3000`.

### 2.3 Running Automated Test Suite
Run the full Pytest test suite (50 test cases covering API, RBAC, Quality Gate, Low-Connectivity, HITL, and ML pipeline):
```bash
pytest backend/tests ml/tests
```

---

## 3. Student Customization & Configuration Guide

### 3.1 Where to Change Quality Gate Thresholds
- **Primary Threshold Logic:** `backend/app/services/quality_service.py`
  - Function: `analyze_fundus_quality()`
  - Key Parameters: `sharpness_threshold` (0.35), `illumination_threshold` (0.40), `contrast_threshold` (0.30).
- **ML Quality Config:** `ml/config/config.yaml`
  - Section: `quality_gate.thresholds`

### 3.2 Where to Replace Mock Inference with Trained PyTorch Weights
- **Model Checkpoints Directory:** `ml/checkpoints/`
  - Place your trained `.pth` or `.pt` weight files in `ml/checkpoints/efficientnet_dr_best.pth`.
- **Inference Engine Integration:** `backend/app/ml/inference_engine.py`
  - Class: `RealInferenceEngine`
  - Replace `self.model` loading in `__init__()`:
    ```python
    checkpoint = torch.load("ml/checkpoints/efficientnet_dr_best.pth", map_location=self.device)
    self.model.load_state_dict(checkpoint["state_dict"])
    ```

### 3.3 Where Datasets are Configured
- **Setup Guide:** `docs/DATASET_SETUP.md`
- **Dataset Adapters:** `ml/datasets/`
  - `aptos_dataset.py`: APTOS 2019 (5-class DR)
  - `idrid_dataset.py`: IDRiD grading & lesion segmentation
  - `drive_dataset.py`: DRIVE vessel masks
  - `messidor_dataset.py`: Messidor-2 DR dataset

---

## 4. Debugging & Troubleshooting Guide

1. **Debugging API Requests:**
   - Every FastAPI response includes an `X-Request-ID` header.
   - Server logs print detailed execution steps tagged with `request_id`.
2. **Debugging PyTorch Model Inferences:**
   - Ensure input fundus image tensors are normalized with ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`.
   - Input shape: `(batch_size, 3, 384, 384)`.
3. **Debugging Next.js Frontend:**
   - If dynamic route errors occur on `/screening/[id]`, inspect `params.id` in `page.tsx`.
   - Check `syncEngine.isOnline()` in browser DevTools to test low-connectivity transitions.

---

## 5. Clinical Safety & Phrasing Reminders
- Never replace the retina specialist or claim autonomous medical diagnosis.
- Always use approved terminology: *"AI Decision Support Recommendation"*, *"Quality Gate Assessment"*, *"Refer for Ophthalmologist Evaluation"*.
