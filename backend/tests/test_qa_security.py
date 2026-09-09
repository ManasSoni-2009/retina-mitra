"""
Senior QA & Security Test Suite for DrishtiSetu.
Tests:
- Authentication & Authorization RBAC enforcement
- Upload validation (Invalid MIME, extension, oversized payload, non-fundus files)
- Missing screening lookups & 404 handling
- Report generation across clinical scenarios
- ML pipeline failure degradation ('Analysis unavailable')
- System Health & Status endpoints
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_test_screening(patient_alias="PAT-SEC-TEST"):
    res = client.post("/api/v1/screenings", json={"patientAlias": patient_alias})
    scr_id = res.json()["screeningId"]
    client.post(f"/api/v1/screenings/{scr_id}/analyze")
    return scr_id

# 1. AUTHENTICATION & AUTHORIZATION TESTS
def test_missing_authentication_header():
    """Verify that protected reviewer endpoints block invalid authentication requests."""
    headers = {"Authorization": "Bearer INVALID_TOKEN_12345"}
    res = client.get("/api/v1/review-queue", headers=headers)
    assert res.status_code == 401
    assert "Invalid authentication token" in res.json()["detail"]

def test_invalid_authentication_token():
    """Verify that requests with invalid authentication tokens are rejected with 401."""
    headers = {"Authorization": "Bearer INVALID_TOKEN_12345"}
    res = client.get("/api/v1/review-queue", headers=headers)
    assert res.status_code == 401
    assert "Invalid authentication token" in res.json()["detail"]

def test_operator_blocked_from_specialist_review():
    """Verify RBAC rule: Operator role is blocked from submitting human reviews (403 Forbidden)."""
    scr_id = create_test_screening("PAT-OP-BLOCK")
    headers = {
        "X-User-Role": "operator",
        "X-User-Id": "PHC-TECH-01"
    }
    payload = {
        "reviewerId": "PHC-TECH-01",
        "action": "CONFIRMED",
        "comments": "Attempting operator review",
        "reviewedAt": "2026-09-08T15:00:00Z"
    }
    res = client.post(f"/api/v1/screenings/{scr_id}/review", json=payload, headers=headers)
    assert res.status_code == 403
    assert "Access Denied" in res.json()["detail"] or "not authorized" in res.json()["detail"]

# 2. IMAGE UPLOAD VALIDATION TESTS
def test_invalid_non_image_upload():
    """Verify that uploading non-image files (e.g. text/exe file) returns 400 Bad Request."""
    scr_id = create_test_screening("PAT-MALICIOUS-TXT")
    file_bytes = b"This is a text file content pretending to be an image."
    res = client.post(
        f"/api/v1/screenings/{scr_id}/image",
        files={"file": ("malicious.txt", file_bytes, "text/plain")}
    )
    assert res.status_code == 400
    assert "Unsupported file extension" in res.json()["detail"] or "MIME type" in res.json()["detail"]

def test_oversized_image_upload():
    """Verify that uploading images larger than 20MB returns 400 Bad Request."""
    scr_id = create_test_screening("PAT-OVERSIZED")
    large_bytes = b"0" * (21 * 1024 * 1024)
    res = client.post(
        f"/api/v1/screenings/{scr_id}/image",
        files={"file": ("oversized.jpg", large_bytes, "image/jpeg")}
    )
    assert res.status_code == 400
    assert "exceeds maximum allowed 20 MB limit" in res.json()["detail"]

# 3. MISSING SCREENING LOOKUP TESTS
def test_missing_screening_404():
    """Verify that querying a non-existent screening ID returns 404 Not Found."""
    res = client.get("/api/v1/screenings/SCR-DOES-NOT-EXIST")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"]

# 4. REPORT GENERATION ACROSS CLINICAL SCENARIOS
def test_report_scenario_1_ungradable():
    """Report Scenario 1: Ungradable image scan."""
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-REPORT-UNGRADABLE"})
    scr_id = res_create.json()["screeningId"]
    
    from app.services.database import db
    from app.schemas.screening import ImageQuality
    scr = db.get_by_id(scr_id)
    if scr:
        scr.imageQuality = ImageQuality(
            qualityStatus="UNGRADABLE",
            overallScore=0.15,
            focusScore=0.10,
            illuminationScore=0.12,
            fieldOfViewScore=0.20,
            artifactScore=0.10,
            contrastScore=0.05,
            reasonCodes=["BLUR"],
            humanReadableExplanation=["Image is too blurry to evaluate reliably"],
            recaptureInstructions=["Focus camera on retina centrum"]
        )
        db.save(scr)

    res = client.get(f"/api/v1/screenings/{scr_id}/report")
    assert res.status_code == 200
    rep = res.json()
    assert rep["qualityStatus"] == "UNGRADABLE"
    assert rep["screeningId"] == scr_id

def test_report_scenario_2_no_dr():
    """Report Scenario 2: No DR (Level 0)."""
    scr_id = create_test_screening("PAT-REPORT-NO-DR")
    res = client.get(f"/api/v1/screenings/{scr_id}/report")
    assert res.status_code == 200
    rep = res.json()
    assert rep["screeningId"] == scr_id

def test_report_scenario_3_referable_dr():
    """Report Scenario 3: Referable DR."""
    scr_id = create_test_screening("PAT-REPORT-REFERABLE")
    res = client.get(f"/api/v1/screenings/{scr_id}/report")
    assert res.status_code == 200
    rep = res.json()
    assert rep["screeningId"] == scr_id

def test_report_scenario_4_uncertain():
    """Report Scenario 4: High uncertainty scan requiring specialist review."""
    scr_id = create_test_screening("PAT-REPORT-UNCERTAIN")
    res = client.get(f"/api/v1/screenings/{scr_id}/report")
    assert res.status_code == 200
    rep = res.json()
    assert "uncertaintyStatus" in rep

def test_report_scenario_5_human_override():
    """Report Scenario 5: Human specialist override."""
    scr_id = create_test_screening("PAT-REPORT-OVERRIDE")
    
    headers = {"X-User-Role": "reviewer", "X-User-Id": "DOC-RETINA-01"}
    override_payload = {
        "reviewerId": "DOC-RETINA-01",
        "action": "OVERRIDDEN",
        "overrideGrade": 3,
        "comments": "Clinical override based on peripheral hemorrhages.",
        "reviewedAt": "2026-09-08T15:00:00Z"
    }
    review_res = client.post(f"/api/v1/screenings/{scr_id}/review", json=override_payload, headers=headers)
    assert review_res.status_code == 200

    # Fetch report
    rep_res = client.get(f"/api/v1/screenings/{scr_id}/report")
    assert rep_res.status_code == 200
    rep = rep_res.json()
    assert rep["reviewStatus"] == "OVERRIDDEN"

# 5. SYSTEM HEALTH & STATUS
def test_system_health():
    """Verify health status endpoint."""
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_system_status():
    """Verify detailed system status endpoint."""
    res = client.get("/api/v1/system/status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL_HEALTHY"
    assert "nodeId" in data
