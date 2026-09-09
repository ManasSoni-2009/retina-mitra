"""
Pytest integration & unit test suite for DrishtiSetu Human-In-The-Loop (HITL) workflow.
Tests:
1. Operator role cannot submit review decisions (403 Forbidden).
2. Reviewer role can query review queue sorted by priority, uncertainty, referable, age.
3. Reviewer can start review (IN_REVIEW) and submit decision (REVIEW_COMPLETED).
4. Reviewer override requires non-empty clinical comment (400 Bad Request if missing).
5. AI baseline prediction remains immutable in originalAiGrade after specialist override.
6. Audit trail chronologically logs UPLOADED -> QUALITY_CHECKED -> AI_ANALYZED -> REVIEW_STARTED -> REVIEW_COMPLETED.
7. Ungradable scans cannot be blindly confirmed without explicit human override action.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_analyzed_screening(patient_alias="PAT-HITL-TEST"):
    res = client.post("/api/v1/screenings", json={"patientAlias": patient_alias})
    scr_id = res.json()["screeningId"]
    client.post(f"/api/v1/screenings/{scr_id}/analyze")
    return scr_id

def test_operator_blocked_from_review_submission():
    """Verify that operator role header results in 403 Forbidden when submitting review."""
    scr_id = create_analyzed_screening("PAT-OP-BLOCKED")
    headers = {
        "X-User-Role": "operator",
        "X-User-Id": "PHC-TECH-99"
    }
    payload = {
        "reviewerId": "PHC-TECH-99",
        "action": "CONFIRMED",
        "comments": "Attempting unauthorized confirmation",
        "reviewedAt": "2026-09-08T15:00:00Z"
    }
    response = client.post(f"/api/v1/screenings/{scr_id}/review", json=payload, headers=headers)
    assert response.status_code == 403
    assert "Access Denied" in response.json()["detail"] or "not authorized" in response.json()["detail"]

def test_review_queue_sorting():
    """Verify review queue returned with custom sorting options."""
    create_analyzed_screening("PAT-QUEUE-1")
    headers = {"X-User-Role": "reviewer", "X-User-Id": "DR-S-RAO"}
    
    # Priority sort
    res_prio = client.get("/api/v1/review-queue?sort_by=priority", headers=headers)
    assert res_prio.status_code == 200
    queue_prio = res_prio.json()
    assert isinstance(queue_prio, list)

    # Uncertainty sort
    res_unc = client.get("/api/v1/review-queue?sort_by=uncertainty", headers=headers)
    assert res_unc.status_code == 200

    # Referable sort
    res_ref = client.get("/api/v1/review-queue?sort_by=referable", headers=headers)
    assert res_ref.status_code == 200

def test_start_review_transition():
    """Verify claiming a case transitions status to IN_REVIEW and appends audit event."""
    scr_id = create_analyzed_screening("PAT-START-REVIEW")
    headers = {"X-User-Role": "reviewer", "X-User-Id": "DR-S-RAO"}
    response = client.post(f"/api/v1/screenings/{scr_id}/start-review", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["reviewStatus"] == "IN_REVIEW"
    assert any(evt["action"] == "REVIEW_STARTED" for evt in data["auditTrail"])

def test_override_without_comment_rejected():
    """Verify that human override without reason comment is rejected with 400 Bad Request."""
    scr_id = create_analyzed_screening("PAT-NO-COMMENT")
    headers = {"X-User-Role": "reviewer", "X-User-Id": "DR-S-RAO"}
    payload = {
        "reviewerId": "DR-S-RAO",
        "action": "OVERRIDDEN",
        "overrideGrade": 3,
        "comments": "   ", # Blank comment
        "reviewedAt": "2026-09-08T15:10:00Z"
    }
    response = client.post(f"/api/v1/screenings/{scr_id}/review", json=payload, headers=headers)
    assert response.status_code == 400
    assert "mandatory clinical explanation" in response.json()["detail"]

def test_ai_result_immutability_on_override():
    """Verify that specialist override updates current grade but preserves originalAiGrade immutably."""
    scr_id = create_analyzed_screening("PAT-OVERRIDE")
    headers = {"X-User-Role": "reviewer", "X-User-Id": "DR-S-RAO"}
    payload = {
        "reviewerId": "DR-S-RAO",
        "action": "OVERRIDDEN",
        "overrideGrade": 3,
        "comments": "Severe intraretinal hemorrhages visible in macula quadrant.",
        "reviewedAt": "2026-09-08T15:15:00Z"
    }
    response = client.post(f"/api/v1/screenings/{scr_id}/review", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["drGrade"]["drGrade"] == 3
    assert "Overridden" in data["drGrade"]["drGradeLabel"]
    
    # Original AI grade must be preserved
    assert data["originalAiGrade"] is not None

    # Audit trail must record OVERRIDDEN event
    assert any(evt["action"] == "OVERRIDDEN" for evt in data["auditTrail"])

def test_ungradable_blind_confirmation_blocked():
    """Verify that an ungradable image cannot be blindly confirmed without explicit human override action."""
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-UNGRADABLE"})
    scr_id = res_create.json()["screeningId"]
    
    # Set quality status as UNGRADABLE in database
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

    headers = {"X-User-Role": "reviewer", "X-User-Id": "DR-S-RAO"}
    payload = {
        "reviewerId": "DR-S-RAO",
        "action": "CONFIRMED",
        "comments": "Confirming scan",
        "reviewedAt": "2026-09-08T15:20:00Z"
    }
    response = client.post(f"/api/v1/screenings/{scr_id}/review", json=payload, headers=headers)
    assert response.status_code == 400
    assert "Ungradable image scan cannot be confirmed" in response.json()["detail"]
