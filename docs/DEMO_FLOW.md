# DrishtiSetu — Smart India Hackathon (SIH26038) Live Demo Guide

**Presentation Timing:** 3 to 5 Minutes  
**Demo Mode Status:** Active (All controlled sample cases clearly labeled as `DEMONSTRATION DATA`)

---

## 1. Core Presentation Narrative & Principles

When presenting DrishtiSetu to the hackathon jury, structure the presentation around these **6 core operational principles**:

1. **Trust Gate:** *"First we decide whether the image is trustworthy."*
2. **Analysis Engine:** *"Then we analyze it with calibrated deep learning backbones."*
3. **Explainable Evidence:** *"Then we explain the evidence using separated Model Attention and Clinical Lesion Segmentation."*
4. **Uncertainty Quantification:** *"Then we quantify uncertainty via Temperature Scaling and entropy metrics."*
5. **Human-in-the-Loop Safeguard:** *"Then we escalate uncertain and referable cases to specialist review queues."*
6. **District Scale:** *"And finally we simulate whether the entire screening program can scale across rural PHCs."*

---

## 2. Mandatory Presenter Language Guidelines

> [!IMPORTANT]
> **Strict Clinical Compliance Rules for Presenters:**

| ❌ DO NOT SAY | ✅ ALWAYS SAY |
| :--- | :--- |
| *"Our AI diagnoses diabetic retinopathy."* | *"Our prototype performs explainable AI-assisted screening and routes uncertain cases for human review."* |
| *"We achieved 95% accuracy."* | *"The SIH target is >90% sensitivity and >85% specificity for referable DR; our measured performance will be reported only after clinical validation."* |
| *"This replaces the ophthalmologist."* | *"DrishtiSetu acts as a force multiplier for retina specialists by triaging clear scans and accelerating specialist review."* |
| *"This offline mode does full AI diagnosis."* | *"Our offline engine safely queues screening drafts locally with idempotency protection without falsely claiming AI completion."* |

---

## 3. Step-by-Step 3-Minute Live Demo Flow

### STEP 1: Open Dashboard (0:00 - 0:25)
- **Exact Action:** Navigate to `http://localhost:3000/dashboard`.
- **What Presenter Says:**  
  *"Welcome to DrishtiSetu. This dashboard provides real-time visibility across the rural tele-ophthalmology network. Notice our SIH26038 Live Demo Launchpad at the top, showing today's screened volume, active review queue depth, and operational health metrics."*
- **What Screen Demonstrates:** Top KPI cards (42 images screened, 2 awaiting review, 3 ungradable, 8 referable cases) and system latency telemetry.

---

### STEP 2: Initiate New Patient Screening (0:25 - 0:40)
- **Exact Action:** Click **"New Patient Screening"** button or navigate to `/screening/new`.
- **What Presenter Says:**  
  *"In a rural PHC, an operator enters the patient ID and selects a fundus scan. Let's first test what happens when an operator captures a blurry, low-quality image."*
- **What Screen Demonstrates:** Anonymized patient ID intake form (`PAT-2026-9901`) and fundus acquisition dropzone.

---

### STEP 3: Quality Gate Hard-Rejection (0:40 - 1:05)
- **Exact Action:** Click **"Select Ungradable Blur Scan (DEMO 03)"**.
- **What Presenter Says:**  
  *"Notice our Quality Gate instantly intercepts the image before any DR classification occurs. The system status clearly displays: **IMAGE UNGRADABLE**. It pinpoints the exact failure reasons: focus sharpness of 0.28 below our 0.65 threshold, motion blur, and peripheral shadow gradient. Most importantly, it gives the technician step-by-step physical recapture guidance."*
- **What Screen Demonstrates:** Red Quality Badge `UNGRADABLE`, metrics breakdown (sharpness 28%, illumination 40%), failure reasons, and recapture instructions.

---

### STEP 4: Execution of 6-Stage AI Pipeline (1:05 - 1:30)
- **Exact Action:** Click **"Select Moderate NPDR Scan (DEMO 02)"**.
- **What Presenter Says:**  
  *"Now we load a high-quality scan. Watch the 6-stage pipeline execute: Image Quality Assessment, CLAHE Enhancement, Retinal Vessel Segmentation, Deep Learning Severity Classification, Grad-CAM Heatmap Generation, and Temperature Scaling Calibration."*
- **What Screen Demonstrates:** Animated 6-stage processing pipeline progress bar transitioning to `GRADABLE` result.

---

### STEP 5 & STEP 6: Screening Results & Visual Explainability (1:30 - 2:15)
- **Exact Action:** Click **"View Explainable Screening Results"** to open `/screening/SCR-2026-002`.
- **What Presenter Says:**  
  *"Here is our Explainability Workspace. The AI identifies **Level 2 — Moderate NPDR** with a calibrated confidence of 86%. Look at our 6-layer visual canvas. We explicitly separate **Model Attention** (Grad-CAM receptive field) from **Clinical Lesion Segmentation** (U-Net microaneurysm and hard exudate bounding boxes). This prevents misleading the clinician."*
- **What Screen Demonstrates:** Prominent decision banner `HUMAN_REVIEW_RECOMMENDED`, multi-layer canvas viewer (Raw, CLAHE, Vessels, Lesions, Grad-CAM, Combined), and structured Evidence attribution list (`MODEL_ATTENTION` vs `LESION_SEGMENTATION`).

---

### STEP 7 & STEP 8: Human-In-The-Loop Specialist Review & Audit Trail (2:15 - 2:45)
- **Exact Action:** Navigate to `/review` and open **DEMO 05 (`SCR-2026-005`)**.
- **What Presenter Says:**  
  *"Because this case is referable, it is automatically routed to our Specialist Review Queue. Notice our RBAC security: operators are blocked with 403 Forbidden. Only an authenticated retina specialist can review the case. Here, Dr. Rao overrides the AI grade from Level 1 to Level 3 Severe NPDR with a mandatory clinical comment. Notice that the original AI prediction remains preserved immutably in the audit trail."*
- **What Screen Demonstrates:** 3-column Specialist Review Workspace, override submission modal with mandatory comment requirement, and chronological audit trail logging (`UPLOADED` $\rightarrow$ `QUALITY_CHECKED` $\rightarrow$ `AI_ANALYZED` $\rightarrow$ `REVIEW_STARTED` $\rightarrow$ `OVERRIDDEN`).

---

### STEP 9: Clinical Referral Report Generation (2:45 - 3:05)
- **Exact Action:** Click **"Generate Clinical Report"** button on screening workspace.
- **What Presenter Says:**  
  *"The system generates a standardized, printable clinical referral report complete with bilingual English/Marathi patient advice, quality metrics, and clear disclaimers stating that this is decision-support software."*
- **What Screen Demonstrates:** Structured report modal with print/PDF export support.

---

### STEP 10: District Capacity & Simulink Simulation (3:05 - 3:30)
- **Exact Action:** Navigate to `/simulation`. Click **"Poor Connectivity (2G)"** preset and adjust `Patients / Day` to 100.
- **What Presenter Says:**  
  *"Finally, how does this scale across an entire district? Our Simulink discrete-event queue model simulates patient arrival rates, network bandwidth, and reviewer workloads. As we reduce bandwidth to 0.2 Mbps and increase intake, we instantly see the real-time impact on network upload backlog MB and specialist review queue delay hours."*
- **What Screen Demonstrates:** 15 input parameter controls, Connectivity Selector presets, 10 capacity output metrics, and 30-day queue state timeline.

---

## 4. SIH26038 Demonstration Final Checklist

- [x] **Dashboard:** Real-time KPI metrics, visual workflow pipeline, and Hackathon Demo Mode Bar.
- [x] **Image Upload:** Drag-and-drop dropzone supporting PNG/JPG fundus scans with patient alias intake.
- [x] **Quality Rejection:** OpenCV Quality Gate intercepting ungradable scans with explicit failure reasons & recapture guidance.
- [x] **Enhancement:** Contrast-Limited Adaptive Histogram Equalization (CLAHE) green-channel contrast generator.
- [x] **Segmentation:** Frangi vessel filter and U-Net lesion candidate overlay detection.
- [x] **DR Grade:** 5-class ICDR severity classification (Level 0 No DR to Level 4 Proliferative DR).
- [x] **Grad-CAM:** Spatial model attention heatmaps strictly labeled as `MODEL_ATTENTION`.
- [x] **Lesion Evidence:** Bounding boxes strictly attributed to `LESION_SEGMENTATION`.
- [x] **Confidence:** Temperature Scaling post-processing calibration & uncertainty entropy calculation.
- [x] **Human Review:** Specialist queue sorting, 3-column workspace, RBAC 403 enforcement, and immutable audit trail.
- [x] **Report:** Printable bilingual (English/Marathi) clinical referral slip.
- [x] **Simulation:** 15-parameter Simulink discrete-event queue model with 6 scenario presets and 10 output metrics.
- [x] **Firebase:** `firestore.rules` and `storage.rules` enforcing authenticated RBAC and append-only audit logs.
- [x] **Security:** No hardcoded credentials; request ID logging middleware catching unhandled exceptions.
- [x] **Error Handling:** Graceful ML fallback returning `"Analysis unavailable"` on model runtime errors.
- [x] **Demo Data Labeling:** Prominent `DEMONSTRATION DATA` badges rendered across all demo UI views and report templates.
