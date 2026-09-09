"""
Unit Tests for DrishtiSetu Real Image-Quality Stage & Quality Gate Enforcement.
"""

import io
import cv2
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
from app.services.quality_service import analyze_fundus_quality, validate_image_file

client = TestClient(app)

def create_synthetic_image(mode: str) -> bytes:
    """Generates synthetic test images simulating different camera degradation modes."""
    # Base fundus-colored circular image (width=400, height=400)
    img_bgr = np.zeros((400, 400, 3), dtype=np.uint8)
    cv2.circle(img_bgr, (200, 200), 160, (20, 50, 180), -1)  # Retinal orange circle
    cv2.circle(img_bgr, (280, 200), 30, (80, 220, 255), -1)  # Optic disc yellow circle

    if mode == "blur":
        img_bgr = cv2.GaussianBlur(img_bgr, (35, 35), 0)
    elif mode == "dark":
        img_bgr = (img_bgr * 0.2).astype(np.uint8)
    elif mode == "bright":
        img_bgr = cv2.circle(img_bgr, (200, 200), 150, (255, 255, 255), -1)
    elif mode == "cropped":
        img_cropped = np.zeros((400, 400, 3), dtype=np.uint8)
        img_cropped[150:250, 150:250] = img_bgr[150:250, 150:250]
        img_bgr = img_cropped

    _, buf = cv2.imencode(".png", img_bgr)
    return buf.tobytes()

def test_valid_image_passes_quality_gate():
    valid_bytes = create_synthetic_image("valid")
    quality = analyze_fundus_quality(valid_bytes, "synthetic_valid.png")
    assert quality.isPrototypeHeuristic is True
    assert quality.qualityStatus in ["GRADABLE", "BORDERLINE"]
    assert quality.overallScore >= 0.45

def test_blurred_image_triggers_blur_reason_code():
    blur_bytes = create_synthetic_image("blur")
    quality = analyze_fundus_quality(blur_bytes, "synthetic_blur.png")
    assert "BLUR" in quality.reasonCodes or quality.focusScore < 0.45
    assert len(quality.recaptureInstructions) > 0

def test_dark_image_triggers_low_light_reason_code():
    dark_bytes = create_synthetic_image("dark")
    quality = analyze_fundus_quality(dark_bytes, "synthetic_dark.png")
    assert "LOW_LIGHT" in quality.reasonCodes or quality.illuminationScore < 0.40

def test_bright_image_triggers_glare_reason_code():
    bright_bytes = create_synthetic_image("bright")
    quality = analyze_fundus_quality(bright_bytes, "synthetic_bright.png")
    assert "OVEREXPOSURE" in quality.reasonCodes or "GLARE" in quality.reasonCodes

def test_cropped_image_triggers_incomplete_fov_code():
    cropped_bytes = create_synthetic_image("cropped")
    quality = analyze_fundus_quality(cropped_bytes, "synthetic_cropped.png")
    assert "INCOMPLETE_FOV" in quality.reasonCodes or quality.fieldOfViewScore < 0.45

def test_ungradable_image_blocks_downstream_ai_inference():
    # 1. Create screening
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-BLOCKED-INFERENCE"})
    scr_id = res_create.json()["screeningId"]

    # 2. Upload ungradable blur image
    blur_bytes = create_synthetic_image("blur")
    files = {"file": ("synthetic_blur.png", blur_bytes, "image/png")}
    res_upload = client.post(f"/api/v1/screenings/{scr_id}/image", files=files)
    assert res_upload.status_code == 200
    assert res_upload.json()["qualityStatus"] == "UNGRADABLE"

    # 3. Trigger analyze endpoint
    res_analyze = client.post(f"/api/v1/screenings/{scr_id}/analyze")
    assert res_analyze.status_code == 200
    data = res_analyze.json()
    
    # Verify downstream AI classification was BLOCKED
    assert data["processingMetadata"].get("inferenceBlocked") is True
    assert "Ungradable" in data["drGrade"]["drGradeLabel"]
    assert data["confidence"]["requiresHumanReview"] is True
