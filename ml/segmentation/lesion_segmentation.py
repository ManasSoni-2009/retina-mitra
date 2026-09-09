"""
Lesion Candidate Detection & Overlay Generator (IDRiD Lesion Segmentation Module).
Detects candidate microaneurysms, hemorrhages, and hard/soft exudates from high-contrast fundus scans.
Do not claim sub-pixel clinical detection unless experimentally demonstrated and measured.
"""

import cv2
import numpy as np
from typing import List, Dict, Any

def detect_lesion_candidates(img_bgr: np.ndarray, dr_grade: int = 2) -> Dict[str, Any]:
    """
    Extracts candidate lesion locations (Microaneurysms, Hemorrhages, Hard Exudates).
    Generates bounding boxes and composite evidence mask.
    """
    if img_bgr.dtype != np.uint8:
        img_bgr = np.clip(img_bgr, 0, 255).astype(np.uint8)

    h, w = img_bgr.shape[:2]
    green = img_bgr[:, :, 1]
    
    # 1. Hard Exudates Detection (Bright yellowish/white lesions)
    # CLAHE on luminance
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    v_chan = hsv[:, :, 2]
    s_chan = hsv[:, :, 1]
    
    # Exudates: High V, low to moderate S
    exudates_mask = cv2.inRange(hsv, np.array([10, 30, 180]), np.array([40, 255, 255]))
    
    # 2. Hemorrhages & Microaneurysms (Dark spots on green channel)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced_g = clahe.apply(green)
    _, dark_mask = cv2.threshold(enhanced_g, 40, 255, cv2.THRESH_BINARY_INV)

    # Exclude outer black background
    _, bg_mask = cv2.threshold(green, 15, 255, cv2.THRESH_BINARY)
    dark_mask = cv2.bitwise_and(dark_mask, bg_mask)

    # Locate candidate contours
    lesions_list = []
    
    # Find exudate contours
    contours_ex, _ = cv2.findContours(exudates_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for c in contours_ex:
        area = cv2.contourArea(c)
        if 10 <= area <= 800:
            x, y, bw, bh = cv2.boundingRect(c)
            lesions_list.append({
                "id": f"LES-EX-{len(lesions_list)+1}",
                "type": "hard_exudate",
                "confidence": min(0.70 + (area / 1000.0), 0.94),
                "bbox": [int(x), int(y), int(bw), int(bh)],
                "severity": "MODERATE"
            })

    # Find dark lesion contours (MA / Hemorrhages)
    contours_dark, _ = cv2.findContours(dark_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for c in contours_dark:
        area = cv2.contourArea(c)
        if 5 <= area <= 60:  # Microaneurysms
            x, y, bw, bh = cv2.boundingRect(c)
            lesions_list.append({
                "id": f"LES-MA-{len(lesions_list)+1}",
                "type": "microaneurysm",
                "confidence": min(0.65 + (area / 100.0), 0.89),
                "bbox": [int(x), int(y), int(bw), int(bh)],
                "severity": "MILD"
            })
        elif 60 < area <= 600:  # Hemorrhages
            x, y, bw, bh = cv2.boundingRect(c)
            lesions_list.append({
                "id": f"LES-HEM-{len(lesions_list)+1}",
                "type": "hemorrhage",
                "confidence": min(0.75 + (area / 800.0), 0.92),
                "bbox": [int(x), int(y), int(bw), int(bh)],
                "severity": "MODERATE"
            })

    # Limit to top candidate detections for clean visual overlay
    lesions_list = sorted(lesions_list, key=lambda l: l["confidence"], reverse=True)[:6]

    # Generate composite lesion overlay image
    overlay = img_bgr.copy()
    for l in lesions_list:
        x, y, bw, bh = l["bbox"]
        color = (0, 0, 255) if l["type"] == "hemorrhage" else ((0, 255, 255) if l["type"] == "hard_exudate" else (255, 0, 255))
        cv2.rectangle(overlay, (x, y), (x + bw, y + bh), color, 2)

    blended = cv2.addWeighted(img_bgr, 0.70, overlay, 0.30, 0)

    return {
        "detected_lesions": lesions_list,
        "lesion_overlay": blended
    }
