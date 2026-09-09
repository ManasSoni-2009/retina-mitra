# DrishtiSetu — User Guide for Operators & Specialists

**Document Version:** 1.0.0  
**Updated:** September 8, 2026  

Welcome to **DrishtiSetu**, an explainable retinal image decision-support system for diabetic retinopathy (DR) screening.

---

## 1. Role-Based Overview

DrishtiSetu supports two primary user roles:

1. **PHC Screening Operator:** Captures and uploads retinal fundus scans at primary healthcare centers, checks quality assessment feedback, and reviews AI decision-support outputs.
2. **Ophthalmologist Specialist / Reviewer:** Examines cases flagged for human review, analyzes multi-layer visual evidence, and enters clinical review decisions.

---

## 2. Step-by-Step Screening Workflow

### Step 1: Start a Screening
1. Click **Screening** (`/screening/new`) in the top navigation bar.
2. Enter patient reference ID and clinical notes (optional).
3. Drag and drop a fundus photograph or click **Choose File**.
4. Click **Start Screening Assessment**.

### Step 2: Quality Assessment Gate
The system automatically evaluates image quality before running machine learning models:
- **Good Quality:** The image proceeds directly to DR screening and feature analysis.
- **Borderline Quality:** The image is analyzed, but confidence is adjusted and human review is recommended.
- **Ungradable:** The system prompts for recapture, providing specific guidance (e.g., *"Reduce glare", "Focus on retina centrum"*).

### Step 3: View Screening Results & Explainability
On the screening result page (`/screening/[id]`):
- **Severity Badge:** Displays calibrated screening result (e.g., *Level 0: No DR*, *Level 2: Moderate NPDR*).
- **Multi-Layer Retinal Viewer:** Toggle between 6 visual layers:
  1. *Original Image*
  2. *Enhanced Fundus (CLAHE)*
  3. *Retinal Vessel Overlay*
  4. *Lesion Candidates (Exudates/Microaneurysms)*
  5. *AI Model Attention (Grad-CAM)*
  6. *Combined Evidence View*
- **Calibrated Certainty:** View system confidence and uncertainty rationale.

### Step 4: Specialist Human-in-the-Loop Review
Cases flagged with low confidence or referable severity appear in the **Reviews** workspace (`/review`):
- The specialist reviews the 3-column workspace (Fundus Scan | AI Evidence | Decision Panel).
- Select a decision: **Accept AI Screening**, **Request Recapture**, **Mark Ungradable**, or **Recommend Referral**.
- Enter mandatory override rationale if altering the AI result.
- Click **Submit Clinical Review**.

### Step 5: Export Clinical Report
Click **View Clinical Report** on any completed screening to inspect the bilingual (English / Marathi) report card, print, or download PDF documentation.
