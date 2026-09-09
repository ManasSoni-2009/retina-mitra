# RETINA-MITRA System Architecture

## Overview
RETINA-MITRA is an AI-assisted retinal tele-ophthalmology decision support system designed to screen diabetic retinopathy at primary health centers, verify image gradability, and streamline specialist triage.

---

## 1. Current Prototype Architecture (Client-Side Case Engine)
The current prototype runs as a deterministic, high-fidelity client-side application. It demonstrates the complete end-to-end clinical workflow without relying on unstable backend services or remote network connectivity.

```text
User / Clinician
      ↓
Next.js 16 (App Router + React 19)
      ↓
Prototype Case Engine (RM-001 to RM-005)
      ↓
OpenCV Quality Gate (Sharpness & Glare Intercept)
      ↓
Screening Result (Non-Diagnostic ICDR Classification)
      ↓
Multimodal Explainability (Grad-CAM + Lesion Overlays)
      ↓
Human Specialist Review & Audit Logging
      ↓
Vector PDF Report Export (jsPDF v4.2 with Embedded Fundus Imagery)
```

### Key Advantages for Demonstration:
- **Zero Cloud Latency**: Immediate, deterministic response (<1.5s analysis sequence).
- **Offline Reliability**: Guaranteed execution in rural or low-connectivity environments.
- **Explainability Transparency**: Pre-computed backward-hook Grad-CAM heatmaps and morphological vessel segmentation layers for each clinical case.
- **Safe Clinical Safeguards**: Hard Quality Gate rejection for motion-blurred or ungradable scans before interpretation.

---

## 2. Intended Full Production System Architecture
In a full hospital network deployment, the system connects edge screening nodes to high-throughput inference servers and centralized health records:

```text
User / PHC Health Worker
      ↓
Next.js Tele-Ophthalmology Web Application
      ↓ (REST API / gRPC)
FastAPI Production Gateway
      ↓
Quality Assessment Microservice (OpenCV Laplacian / Illumination Gate)
      ↓
Deep Learning Inference Pipeline (PyTorch EfficientNet-B0 + ConvNeXt)
      ↓
Explainability Engine (Grad-CAM Hooks + Frangi Vessel Extraction)
      ↓
Confidence Calibration Engine (Post-Hoc Temperature Scaling)
      ↓
Firebase / Cloud Healthcare API (Encrypted EMR & Audit Logs)
      ↓
Specialist Tele-Ophthalmology Portal (Review & PDF Report Dispatch)
```

---

## 3. Data Flow & Security
- **Patient Privacy**: All fundus scans in the prototype are fully anonymized with de-identified patient aliases (`PAT-8812`, etc.).
- **Clinical Governance**: The system operates strictly as decision-support software. No diagnostic label is issued without specialist verification pathways.
