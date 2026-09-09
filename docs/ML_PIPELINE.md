# Machine Learning Pipeline Architecture

The DrishtiSetu machine learning pipeline is structured into 6 modular processing stages:

```
Raw Fundus Image
       |
       v
[ 1. Quality Assessment Gate ] ---> (Ungradable -> Physical Recapture Guidance)
       | (Gradable / Borderline)
       v
[ 2. Preprocessing & Enhancement ] (CLAHE, Ben Graham Normalization, Green Channel)
       |
       v
[ 3. Retinal Structure Extraction ] (Frangi Vesselness, Optic Disc / Fovea Localization)
       |
       v
[ 4. DR Severity Classification ] (ICDR 0-4 Scale & Referable DR Flagging)
       |
       v
[ 5. Visual Explainability ] (Grad-CAM Activation Heatmaps & Lesion Overlays)
       |
       v
[ 6. Calibrated Uncertainty & Abstention ] ---> (High Uncertainty -> Ophthalmologist Escalation)
```

---

## 1. Image-Quality Assessment Stage (Quality Gate)

Core Principle: **BAD IMAGE → DO NOT TRUST AI CLASSIFICATION → EXPLAIN WHY → ASK FOR RECAPTURE**.

Downstream DR classification is **hard-blocked** when quality assessment determines an image is `UNGRADABLE`.

### Heuristic Quality Measurements

| Feature | Method / Formula | Purpose / Diagnostic Value |
|---|---|---|
| **Sharpness / Focus** | Laplacian Variance ($\sigma^2_{\text{Laplacian}}$) | Detects lens defocus or motion blur. |
| **Illumination / Brightness** | HSV Color Space (Mean V-Channel Value) | Identifies underexposed (dark) or overexposed scans. |
| **Contrast** | Standard Deviation / RMS of Luminance | Evaluates separation between vessels/macula and background. |
| **Field-of-View (FOV) Coverage** | Circular Mask Fitting & Contour Area Ratio | Measures percentage of image occupied by valid retinal tissue. |
| **Clipping & Glare** | Bright Pixel Percentage ($V > 245$) | Flags lens reflections, corneal glare, or severe overexposure. |
| **Fundus Resemblance Detection** | Red/Green Channel Dominance & Saturation | Validates that uploaded file is a retinal fundus scan vs arbitrary photo. |

> [!NOTE]
> All heuristic quality scores are labeled with `isPrototypeHeuristic: True`. These algorithmic metrics serve as baseline prototype filters and are **not clinically validated medical device diagnostics**.

---

## Quality States & Configurable Thresholds

The quality gate evaluates an aggregate score ($Q \in [0.0, 1.0]$) computed via weighted heuristic fusion:

$$Q = 0.35 \cdot S_{\text{sharpness}} + 0.25 \cdot S_{\text{illumination}} + 0.20 \cdot S_{\text{contrast}} + 0.20 \cdot S_{\text{fov}}$$

### Quality States

* **`GOOD`** ($Q \ge 0.65$): High-quality retinal image. Passed to downstream classification without warnings.
* **`BORDERLINE`** ($0.45 \le Q < 0.65$): Sub-optimal quality scan. Inference is permitted only if `QUALITY_ALLOW_BORDERLINE_INFERENCE = True`, but flagged with `"Borderline image quality — human review recommended."`
* **`UNGRADABLE`** ($Q < 0.45$): Unusable image quality. Downstream ML inference is **fully blocked**. System outputs specific reason codes and recapture guidance.

### System Configuration Defaults (`app/core/config.py`)
```python
QUALITY_THRESHOLD_GRADABLE = 0.65
QUALITY_THRESHOLD_BORDERLINE = 0.45
QUALITY_ALLOW_BORDERLINE_INFERENCE = True
```

---

## Reason Codes & Actionable Recapture Guidance

When image defects are identified, internal reason codes map directly to human-readable explanations and operator instructions:

| Internal Code | Human-Readable Explanation | Recapture Guidance |
|---|---|---|
| `BLUR` | Image sharpness is below threshold. Excessive motion or focus blur detected. | Hold the camera steady and re-focus on the retinal plane before shooting. |
| `LOW_LIGHT` | Image is severely underexposed. Retinal details are hidden in darkness. | Increase illumination intensity or re-align light source with pupil. |
| `OVEREXPOSURE` | Image brightness is excessive. High luminance causes detail loss. | Reduce illumination / flash intensity or re-position camera angle. |
| `INCOMPLETE_FOV` | Retinal field of view coverage is insufficient (<50%). | Center the optics on patient's pupil to capture full 45-degree field of view. |
| `GLARE` | Optical reflection or glare artifact detected on retinal surface. | Adjust camera tilt angle to eliminate reflections from cornea/lens. |
| `LOW_CONTRAST` | Retinal contrast is insufficient for reliable feature extraction. | Re-focus and optimize lighting to distinguish blood vessels from retina background. |
| `INSUFFICIENT_RETINAL_AREA` | Retinal tissue coverage is too low for reliable diagnostic screening. | Re-center image on optic disc and macula regions. |

---

## ICDR Severity Scale Mapping
- **Level 0 (No DR):** No abnormalities detected.
- **Level 1 (Mild NPDR):** Microaneurysms only.
- **Level 2 (Moderate NPDR):** Microaneurysms, hemorrhages, hard exudates.
- **Level 3 (Severe NPDR):** >20 intraretinal hemorrhages in 4 quadrants, venous beading in 2+ quadrants, or IRMA in 1+ quadrant.
- **Level 4 (Proliferative DR):** Neovascularization, vitreous/preretinal hemorrhage.

## Referable DR Definition
Any scan graded **Level 2 (Moderate NPDR) or higher**, or any scan presenting vision-threatening macular edema candidate lesions, is flagged as **Referable DR**.

