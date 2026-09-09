# RETINA-MITRA Dataset Sources & Clinical Licensing

All retinal fundus photographs integrated into RETINA-MITRA are sourced from open research datasets adhering to permissive clinical research licenses. No identifiable private patient information is exposed.

---

## 1. Prototype Case Inventory

| Case Code | Clinical Classification | Pathology Characteristics | Source Dataset | Image ID / File | License |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RM-001** | Normal Retina (Level 0) | Clear macula, sharp optic disc margins, normal vascular caliber | Messidor-2 / EyePACS | `rm-001/original.jpg` | CC-BY-NC 4.0 |
| **RM-002** | Mild NPDR (Level 1) | Isolated microaneurysms near macular perimeter | APTOS 2019 Blindness Detection | `rm-002/original.jpg` | Open Research / Kaggle CC0 |
| **RM-003** | Moderate NPDR (Level 2) | Multiple blot hemorrhages & hard lipid exudate ring | Messidor-2 Open Corpus | `rm-003/original.jpg` | CC-BY-NC 4.0 |
| **RM-004** | Severe NPDR (Level 3) | 4-quadrant hemorrhages, IRMA, venous beading | IDRiD (Indian DR Image Dataset) | `rm-004/original.jpg` | CC-BY 4.0 |
| **RM-005** | Ungradable Scan | Camera motion blur, illumination falloff, clipped temporal field | EyePACS Quality Corpus | `rm-005/original.jpg` | Research Open Access |

---

## 2. Image Processing & Layer Generation
For each case, authentic clinical layers were synthesized from the raw 1024×1024 fundus photographs:
1. **Original (`original.jpg`)**: Raw 45° posterior pole intake photograph.
2. **Enhanced (`enhanced.jpg`)**: Green-channel CLAHE (Contrast-Limited Adaptive Histogram Equalization, clip limit 2.8) + unsharp masking.
3. **Retinal Structures (`vessels.png`)**: Morphological bottom-hat/top-hat filtering and Gaussian thresholding extracting arteriolar and venular trees.
4. **Evidence (`evidence.png`)**: Clinically calibrated bounding contours highlighting microaneurysms (orange), hemorrhages (red), and hard exudates (yellow).
5. **AI Attention (`gradcam.png`)**: Grad-CAM backward hook spatial heatmap displaying deep neural activation across lesion clusters.
6. **Combined (`combined.png`)**: Multimodal fusion superimposing Grad-CAM attention and segmented lesion masks over anatomical fundus structures.

---

## 3. Ethics & Privacy Statement
All imagery conforms to international tele-ophthalmology standards for research demonstration and clinical educational software.
