# DrishtiSetu System Architecture

DrishtiSetu is an end-to-end explainable AI decision-support platform designed for Diabetic Retinopathy (DR) screening in rural primary healthcare centers (PHCs).

## High-Level Component Diagram

```
+-------------------------------------------------------------------------+
|                          Next.js Frontend UI                             |
|  - PHC Operator Workspace     - Visual Explainability (Grad-CAM/Overlays)|
|  - Quality Assessment Gate    - Ophthalmologist Escalation Portal       |
|  - Simulink Capacity Planner  - Printable Bilingual Screening Reports    |
+------------------------------------+------------------------------------+
                                     |
                +--------------------+--------------------+
                |                                         |
                v                                         v
+-------------------------------+       +-----------------------------------+
|      FastAPI REST Server      |       |        Firebase Services          |
|  - Auth & Role Verification   |       |  - Auth (PHC, Reviewer, Admin)    |
|  - Image Processing Engine    |       |  - Firestore (Screenings, Patients)|
|  - ML Inference Orchestrator  |       |  - Storage (Fundus Images, XAI)   |
|  - Discrete Simulink Engine   |       +-----------------------------------+
+---------------+---------------+
                |
                v
+-------------------------------------------------------------------------+
|                           ML Pipeline Engine                            |
|  1. Quality Gate (Blur, Illumination, FOV -> Reject/Guide)             |
|  2. Enhancement (CLAHE, Ben Graham Normalization)                       |
|  3. Structure Extraction (Blood Vessels, Optic Disc, Fovea)             |
|  4. DR Severity Grading (ICDR Scale 0-4: No DR -> Proliferative DR)     |
|  5. Explainability (Grad-CAM Attention Heatmaps & Lesion Overlays)      |
|  6. Calibration & Abstention (Softmax Entropy -> Human Escalation)      |
+-------------------------------------------------------------------------+
```

## Core Principles
1. **Human-in-the-Loop:** High uncertainty or ungradable scans are immediately routed for human review.
2. **Explainability First:** Predictions are accompanied by structural lesion highlights and attention maps.
3. **Low-Bandwidth Resilience:** Designed to handle intermittent connectivity with local queuing and optimized image compression.
