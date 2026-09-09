# DrishtiSetu Machine Learning Model Card

## Model Overview
- **Model Name:** DrishtiSetu Dual-Stage Quality-Aware Retinal AI
- **Model Architecture:** EfficientNet-B0 / ConvNeXt-Tiny (5-class ICDR classifier) + U-Net (vessel/lesion segmentation)
- **Model Version:** 1.0.0 (Prototype Baseline)
- **Release Date:** September 2026
- **Developer:** DrishtiSetu Development Team (SIH26038)

---

## 1. Intended Use & Clinical Scope

### Primary Intended Use
DrishtiSetu is designed as an **explainable AI decision-support platform** to assist healthcare workers and optometrists in Primary Health Centers (PHCs) across rural India. It pre-screens 45° color retinal fundus photographs for signs of Diabetic Retinopathy (DR) and flags cases requiring ophthalmologist evaluation.

### Out-of-Scope & Prohibited Use
- **Autonomous Diagnosis:** This model is **NOT** an autonomous diagnostic medical device and must never replace qualified clinical judgement.
- **Non-Fundus Images:** Uploading non-retinal photographs (skin, external eye, text documents) is invalid and stopped by the Quality Gate.
- **Direct Treatment Prescription:** Screening outputs do not constitute a direct prescription for medication or surgery.

---

## 2. Clinical Limitations & Safety Boundaries

> [!CAUTION]
> **Important Safety & Clinical Disclaimer:**
> DrishtiSetu provides artificial intelligence screening predictions derived from mathematical heuristics and deep learning convolutional features. All predictions must be reviewed by a certified ophthalmologist before clinical intervention.

1. **Quality Gate Abstention:** Downstream deep learning classification is strictly **blocked** when image quality is graded `UNGRADABLE`.
2. **Ocular Co-morbidities:** Scans with severe cataracts, vitreous hemorrhage, or corneal opacities may produce low-confidence predictions.
3. **Hardware Variations:** Models are validated primarily on 45° field-of-view fundus cameras. Extremely wide-field or handheld smartphone lenses may require re-calibration.

---

## 3. Dataset Origins & Training Setup

| Dataset | Sample Count | Task / Label Type | Splitting Strategy |
|---|---|---|---|
| **APTOS 2019** | 3,662 scans | 5-Class ICDR DR Severity | Patient-Grouped (70% train / 15% val / 15% test) |
| **IDRiD** | 516 scans | DR Severity & Lesion Masks (MA, HE, EX, SE) | Patient-Grouped Stratified |
| **DRIVE** | 40 scans | Retinal Vessel Segmentation | 20 Train / 20 Test Standard Split |
| **Messidor-2** | 1,748 scans | DR Severity & Referable DR | Patient-Grouped (Left/Right eye grouping) |

### Hyperparameters (`ml/config/config.yaml`)
- **Input Resolution:** $384 \times 384$ pixels
- **Batch Size:** 16
- **Optimizer:** AdamW ($\text{lr} = 3\cdot 10^{-4}$, $\text{weight\_decay} = 1\cdot 10^{-4}$)
- **Loss Function:** Class-Weighted Cross-Entropy (weights: $[1.0, 2.5, 1.8, 3.0, 3.5]$)

---

## 4. Evaluation & Performance Benchmarks

### Referable DR Definition
Scans graded **Level 2 (Moderate NPDR) or higher** are defined as **Referable DR**.

### SIH Target Benchmarks vs Evaluated Results
- **Target Sensitivity:** $> 90.0\%$
- **Target Specificity:** $> 85.0\%$

> [!NOTE]
> Performance metrics reported in `ml/evaluation/reports/metrics.json` are evaluated strictly on holdout test datasets without patient leakage. Target numbers are benchmark goals and not claimed as achieved without dataset verification.

---

## 5. Model Attention vs Clinical Lesion Evidence

DrishtiSetu enforces explicit structural separation in all user interfaces and API outputs:
- **Grad-CAM Attention Heatmaps:** Highlights image regions where the classification model's receptive fields focused during inference. It represents **Model Attention**, not verified pathology.
- **UNet Lesion Candidate Overlays:** Highlights localized candidate microaneurysms, hemorrhages, and exudates. Represents **Clinical Structural Evidence**.

---

## 6. Model Versioning & Provenance Metadata

Every trained model artifact (`.pth` checkpoint) is bundled with a JSON provenance file (`model_metadata.json`) recording:
- Architecture name & PyTorch version
- Training timestamp & random seed
- Full hyperparameter configuration
- Dataset hash & evaluation metric summary
