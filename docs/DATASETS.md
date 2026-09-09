# Dataset References & Usage

DrishtiSetu draws upon four primary benchmark datasets:

1. **APTOS 2019 Blindness Detection:**
   - 3,662 labeled retinal fundus images.
   - Primary source for training and validating 5-class ICDR severity classification (Levels 0–4).

2. **IDRiD (Indian Diabetic Retinopathy Image Dataset):**
   - Labeled fundus images captured from an eye clinic in Nanded, Maharashtra.
   - Expert annotations for microaneurysms, hemorrhages, hard exudates, and cotton-wool spots.
   - Critical for validating explainable lesion overlays in the Indian population context.

3. **DRIVE (Digital Retinal Images for Vessel Extraction):**
   - 40 fundus photographs with manually segmented retinal blood vessel ground truth.
   - Used for training and benchmarking vessel extraction algorithms.

4. **Messidor-2:**
   - 1,748 fundus images paired with DR stage and macular edema risk scores.
   - Used as an independent validation set for referable DR identification.
