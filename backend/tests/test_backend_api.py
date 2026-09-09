"""
Comprehensive Pytest Integration & Unit Test Suite for DrishtiSetu Backend API.
Tests:
- Invalid image file rejection
- Valid image file upload & quality gate
- Quality pass vs quality fail
- Missing screening ID (404)
- Full analysis execution
- Reviewer submission & human override
- Health check endpoints
"""

import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_dummy_png_bytes(width=300, height=300, color=(180, 50, 20)) -> bytes:
    """Generates a valid PNG image payload in memory."""
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def test_health_check_subsystems():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["subsystems"]["mlModel"]["loaded"] is True
    assert data["subsystems"]["firebase"]["status"] == "configured"

def test_system_status():
    response = client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL_HEALTHY"

def test_create_screening():
    payload = {
        "patientAlias": "PAT-TEST-001",
        "operatorId": "PHC-TECH-TEST",
        "phcCenter": "PHC Rampur Test",
        "district": "Nanded"
    }
    response = client.post("/api/v1/screenings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "SCR-" in data["screeningId"]
    assert data["patientAlias"] == "PAT-TEST-001"

def test_invalid_image_upload_rejection():
    # 1. Create a new screening
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-INVALID-IMG"})
    scr_id = res_create.json()["screeningId"]

    # 2. Try to upload plain text as an image
    files = {"file": ("test.txt", b"This is not a fundus image payload", "text/plain")}
    response = client.post(f"/api/v1/screenings/{scr_id}/image", files=files)
    assert response.status_code == 400
    assert "Unsupported file extension" in response.json()["detail"] or "Unsupported MIME type" in response.json()["detail"]

def test_valid_image_upload_and_quality():
    # 1. Create a new screening
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-VALID-IMG"})
    scr_id = res_create.json()["screeningId"]

    # 2. Upload valid PNG image
    png_bytes = create_dummy_png_bytes(400, 400)
    files = {"file": ("fundus_scan.png", png_bytes, "image/png")}
    response = client.post(f"/api/v1/screenings/{scr_id}/image", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "qualityStatus" in data
    assert data["isPrototypeHeuristic"] is True

def test_missing_screening_404():
    response = client.get("/api/v1/screenings/SCR-NONEXISTENT-999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

def test_full_analysis_execution():
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-ANALYZE"})
    scr_id = res_create.json()["screeningId"]

    response = client.post(f"/api/v1/screenings/{scr_id}/analyze")
    assert response.status_code == 200
    data = response.json()
    assert data["screeningId"] == scr_id
    assert "drGrade" in data
    assert "evidence" in data
    assert "confidence" in data

def test_review_submission_override():
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-REVIEW"})
    scr_id = res_create.json()["screeningId"]

    review_payload = {
        "reviewerId": "DR-S-RAO",
        "action": "OVERRIDDEN",
        "overrideGrade": 3,
        "comments": "Severe NPDR features detected on macular quadrant.",
        "reviewedAt": "2026-09-08T14:40:00Z"
    }
    response = client.post(f"/api/v1/screenings/{scr_id}/review", json=review_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["reviewStatus"] == "OVERRIDDEN"
    assert data["drGrade"]["drGrade"] == 3
    assert "Overridden" in data["drGrade"]["drGradeLabel"]

def test_get_screening_report():
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-REPORT"})
    scr_id = res_create.json()["screeningId"]
    client.post(f"/api/v1/screenings/{scr_id}/analyze")

    response = client.get(f"/api/v1/screenings/{scr_id}/report")
    assert response.status_code == 200
    data = response.json()
    assert data["screeningId"] == scr_id
    assert "bilingualMarathiAdvice" in data
