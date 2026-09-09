# DrishtiSetu — ML Model Architecture & Setup Guide

**Document Version:** 1.0.0  
**Updated:** September 8, 2026  

This document details the Machine Learning pipeline architecture, model loading mechanism, PyTorch weight checkpoints, and explainability overlay engines in DrishtiSetu.

---

## 1. Pipeline Overview

The DrishtiSetu ML pipeline executes sequentially:

```
INPUT FUNDUS IMAGE
       │
       ▼
1. OPENCV QUALITY GATE (Laplacian variance, contrast, lighting, artifacts)
       │
       ├─────────────────────────────────┐
       ▼ (If UNGRADABLE)                 ▼ (If PASS / BORDERLINE)
ABSTAIN / RECAPTURE PROMPT       2. ENHANCEMENT (Green Channel, CLAHE)
                                         │
                                         ▼
                                 3. STRUCTURE & LESION SEGMENTATION
                                    (Frangi filter, exudates/microaneurysms)
                                         │
                                         ▼
                                 4. PYTORCH DR SEVERITY CLASSIFIER
                                    (EfficientNet-B0 / ConvNeXt 5-class)
                                         │
                                         ▼
                                 5. TEMPERATURE SCALING & UNCERTAINTY
                                         │
                                         ▼
                                 6. GRAD-CAM ATTENTION MAP GENERATION
                                         │
                                         ▼
                                 7. CALIBRATED SCREENING RESULT & EVIDENCE
```

---

## 2. Model Checkpoints & Directories

Model weight files are placed in the `ml/checkpoints/` directory:

```
drishtisetu/
└── ml/
    └── checkpoints/
        ├── efficientnet_dr_v1.pth     # PyTorch DR Severity Classifier
        └── unet_lesions_v1.pth        # Lesion Segmentation Network (Optional)
```

### Configuration Variables (`backend/.env`):
- `MODEL_PATH=ml/checkpoints/efficientnet_dr_v1.pth`
- `SEGMENTATION_MODEL_PATH=ml/checkpoints/unet_lesions_v1.pth`
- `MODEL_VERSION=2.4.0`

---

## 3. PyTorch Model Architecture

The core DR severity classifier utilizes an **EfficientNet-B0** feature backbone fine-tuned for 5-class diabetic retinopathy severity grading:

- **Classes:**
  - `0`: No DR (Healthy retina)
  - `1`: Mild NPDR (Microaneurysms only)
  - `2`: Moderate NPDR (Exudates, hemorrhages)
  - `3`: Severe NPDR (Intraretinal microvascular abnormalities, venous beading)
  - `4`: Proliferative DR (Neovascularization, vitreous hemorrhage)
- **Input Dimensions:** `3 x 512 x 512` normalized RGB tensors (ImageNet mean/std).
- **Inference Latency:** ~180ms on standard CPU, ~25ms on NVIDIA GPU.

---

## 4. Temperature Scaling & Uncertainty

To prevent overconfident wrong predictions, logits are calibrated using Temperature Scaling:

$$\hat{P}(Y=c \mid X) = \frac{\exp(z_c / T)}{\sum_j \exp(z_j / T)}$$

Where:
- $T$ is the learned temperature parameter (typically $T \approx 1.25$).
- **Abstention Rule:** If top calibrated probability is below `REFERABLE_PROB_THRESHOLD` ($0.45$) or uncertainty entropy exceeds `UNCERTAINTY_ABSTAIN_THRESHOLD` ($0.35$), the case is automatically tagged as `HUMAN_REVIEW_RECOMMENDED`.

---

## 5. Explainability Engines

1. **Grad-CAM Attention (`ml/explainability/gradcam.py`):** Calculates spatial gradients from the final convolutional layer of EfficientNet to highlight visual regions driving the model's prediction.
2. **Lesion Candidate Segmentation (`ml/segmentation/`):** Utilizes adaptive thresholding and Frangi vesselness filtering to isolate optic disc, blood vessels, exudates, and microaneurysm candidates.

---

## 6. Graceful Degradation (No Fake Fallbacks)

If PyTorch model weights are missing or uninitialized:
- The backend logs a clear system notification.
- The pipeline executes OpenCV visual structural analysis and sets the screening status to `UNGRADABLE / REVIEW_REQUIRED`.
- **Absolute Rule:** The backend **never** returns fake hardcoded DR grades.
