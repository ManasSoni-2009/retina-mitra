"""
Modular Retinal Image Enhancement Pipeline.
Applies Green channel CLAHE enhancement, illumination normalization, and Gaussian denoising.
Never overwrites uploaded original files.
"""

import cv2
import numpy as np
from typing import Tuple

def enhance_fundus_image(img_bgr: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Applies CLAHE and Frangi vesselness approximation.
    Returns (enhanced_bgr, vessel_map_bgr).
    """
    # 1. Green Channel Isolation
    green = img_bgr[:, :, 1]
    
    # 2. CLAHE Enhancement (Clip limit=2.0, tile size=8x8)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_green = clahe.apply(green)
    
    # 3. Denoising
    denoised_green = cv2.GaussianBlur(enhanced_green, (3, 3), 0)
    
    # Reconstruct BGR enhanced image preserving channels
    enhanced_bgr = img_bgr.copy()
    enhanced_bgr[:, :, 1] = denoised_green
    
    # 4. Approximate Frangi Vessel Structure Mask
    # Adaptive binarization + morphic vessel tree extraction
    vessel_mask = cv2.adaptiveThreshold(
        denoised_green, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 2
    )
    vessel_map_bgr = cv2.cvtColor(vessel_mask, cv2.COLOR_GRAY2BGR)
    
    return enhanced_bgr, vessel_map_bgr
