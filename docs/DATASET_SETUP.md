# DrishtiSetu Dataset Setup & Acquisition Guide

> [!IMPORTANT]
> **Ethical & Licensing Compliance Notice:**
> DrishtiSetu does **not** automatically scrape dataset repositories or bypass authentication prompts. Team members must manually request access or download datasets from official repositories in accordance with their respective open science / research license terms.

---

## 1. Supported Retinal Datasets

| Dataset | Primary Use | Size / Scans | Classes / Annotations | Official Source |
|---|---|---|---|---|
| **APTOS 2019 Blindness Detection** | 5-Class DR Grading | 3,662 train scans | ICDR Scale (0-4) | [Kaggle APTOS 2019](https://www.kaggle.com/c/aptos2019-blindness-detection) |
| **IDRiD (Indian Diabetic Retinopathy Image Dataset)** | DR Grading & Lesion Segmentation | 516 scans | ICDR Scale (0-4) + Microaneurysms, Hemorrhages, Hard/Soft Exudates masks | [IEEE Dataport IDRiD](https://idrid.grand-challenge.org/) |
| **DRIVE (Digital Retinal Images for Vessel Extraction)** | Vessel Segmentation Baseline | 40 scans (20 train / 20 test) | Binary Retinal Vessel Masks | [DRIVE Repository](https://drive.grand-challenge.org/) |
| **Messidor-2** | DR Grading & Referable DR Validation | 1,748 scans | ICDR Scale (0-4) + Macular Edema risk | [Messidor-2 Dataset](https://www.adameddec.com/dataset/) |

---

## 2. Expected Local Directory Hierarchy

Place downloaded datasets under `ml/datasets/data/` as follows:

```
ml/datasets/data/
├── aptos2019/
│   ├── train.csv                      # columns: id_code, diagnosis
│   └── train_images/                  # <id_code>.png
├── idrid/
│   ├── B._Header_Files/
│   ├── 1. Disease Grading/
│   │   ├── 1. Original Images/        # IDRiD_001.jpg ...
│   │   └── 2. Groundtruths/           # IDRiD_Disease_Grading_Training_Labels.csv
│   └── 2. Lesion Segmentation/
│       ├── 1. Microaneurysms/         # IDRiD_01_MA.tif
│       ├── 2. Haemorrhages/           # IDRiD_01_HE.tif
│       ├── 3. Hard Exudates/          # IDRiD_01_EX.tif
│       └── 4. Soft Exudates/          # IDRiD_01_SE.tif
├── drive/
│   ├── training/
│   │   ├── images/                    # 21_training.tif ...
│   │   ├── 1st_manual/                # 21_manual1.gif ...
│   │   └── mask/                      # 21_training_mask.gif ...
│   └── test/
│       ├── images/                    # 01_test.tif ...
│       ├── 1st_manual/                # 01_manual1.gif ...
│       └── mask/                      # 01_test_mask.gif ...
└── messidor2/
    ├── messidor_data.csv              # columns: image_id, adamed_dr_grade
    └── images/                        # 20051020_43808_0100_PP.png ...
```

---

## 3. Data Split Strategy & Patient Leakage Prevention

To maintain strict scientific validity and prevent data leakage:

1. **Patient-Grouped Splitting (`GroupKFold` / `GroupShuffleSplit`):**
   - For datasets containing multiple scans per patient (e.g., left and right eyes in Messidor-2 or IDRiD), scans are grouped by **Patient ID**.
   - All scans belonging to a single patient are strictly assigned to either `train`, `val`, or `test` — never split across splits.

2. **Default Split Ratios:**
   - **Train:** 70%
   - **Validation:** 15%
   - **Test (Holdout):** 15%

3. **Stratified Distribution:**
   - Splits enforce class balance preservation for all 5 ICDR severity levels ($0, 1, 2, 3, 4$) across train/val/test sets.

---

## 4. Initializing Dataset Verification Scripts

Verify local dataset presence and integrity using the built-in loader check:

```bash
cd ml
python -m datasets.splits --verify-data
```
