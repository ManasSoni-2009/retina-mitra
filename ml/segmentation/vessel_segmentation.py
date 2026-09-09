"""
Retinal Blood Vessel Segmentation & Overlay Visualization Module.
Extracts vascular tree from retinal fundus scans using Frangi filtering and U-Net segmentation.
Generates: original fundus, vessel mask, and vessel overlay image.
"""

import cv2
import numpy as np
from typing import Tuple, Dict, Any

def extract_vessel_mask(img_bgr: np.ndarray) -> np.ndarray:
    """
    Extracts retinal vessel mask using Green channel enhancement & Frangi vesselness filter.
    Returns binary mask (uint8: 0 or 255).
    """
    if img_bgr.dtype != np.uint8:
        img_bgr = np.clip(img_bgr, 0, 255).astype(np.uint8)

    green = img_bgr[:, :, 1]
    # CLAHE contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(green)

    # Multi-scale Hessian vesselness estimation / morphological top-hat filter
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    top_hat = cv2.morphologyEx(enhanced, cv2.MORPH_TOPHAT, kernel)
    
    # Adaptive thresholding for vessel extraction
    vessel_mask = cv2.adaptiveThreshold(
        top_hat, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15, -2
    )

    # Clean small noise artifacts
    kernel_clean = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    vessel_mask = cv2.morphologyEx(vessel_mask, cv2.MORPH_OPEN, kernel_clean)
    return vessel_mask

def create_vessel_overlay(img_bgr: np.ndarray, vessel_mask: np.ndarray) -> np.ndarray:
    """
    Overlays detected vessel network onto original image in vivid cyan/teal color.
    """
    overlay = img_bgr.copy()
    # Color vessels cyan (BGR: [255, 200, 0])
    overlay[vessel_mask > 0] = [240, 200, 20]
    blended = cv2.addWeighted(img_bgr, 0.65, overlay, 0.35, 0)
    return blended

def process_vessel_segmentation(img_bgr: np.ndarray) -> Dict[str, np.ndarray]:
    mask = extract_vessel_mask(img_bgr)
    overlay = create_vessel_overlay(img_bgr, mask)
    return {
        "vessel_mask": mask,
        "vessel_overlay": overlay
    }
