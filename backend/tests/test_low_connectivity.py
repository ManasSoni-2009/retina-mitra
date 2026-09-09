"""
Automated Pytest Suite for DrishtiSetu Rural Low-Connectivity & Idempotency Workflow.
Tests:
- Idempotent screening record creation (X-Idempotency-Key)
- Prevention of duplicate record generation during retries
- Screening status consistency
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_screening_idempotency():
    """Verify that duplicate requests with the same X-Idempotency-Key return the exact same screening record."""
    idempotency_key = "IDEM-TEST-1001-A4B2"
    payload = {
        "patientAlias": "PAT-RURAL-001",
        "operatorId": "PHC-TECH-01",
        "phcCenter": "Primary Health Center - Rampur",
        "district": "Nanded"
    }

    # First request
    res1 = client.post(
        "/api/v1/screenings",
        json=payload,
        headers={"X-Idempotency-Key": idempotency_key}
    )
    assert res1.status_code == 201
    data1 = res1.json()
    screening_id_1 = data1["screeningId"]
    assert data1["patientAlias"] == "PAT-RURAL-001"

    # Second request with IDENTICAL idempotency key
    res2 = client.post(
        "/api/v1/screenings",
        json=payload,
        headers={"X-Idempotency-Key": idempotency_key}
    )
    assert res2.status_code == 201
    data2 = res2.json()
    screening_id_2 = data2["screeningId"]

    # Must match EXACTLY to avoid duplicate records on low-connectivity retries
    assert screening_id_1 == screening_id_2
    assert data1["createdAt"] == data2["createdAt"]

def test_create_screening_without_idempotency_key():
    """Verify that separate requests without idempotency header create distinct screening records."""
    payload = {
        "patientAlias": "PAT-RURAL-002",
        "operatorId": "PHC-TECH-01",
        "phcCenter": "Primary Health Center - Rampur",
        "district": "Nanded"
    }

    res1 = client.post("/api/v1/screenings", json=payload)
    res2 = client.post("/api/v1/screenings", json=payload)

    assert res1.status_code == 201
    assert res2.status_code == 201
    assert res1.json()["screeningId"] != res2.json()["screeningId"]

def test_offline_queued_screening_analysis_pipeline():
    """Verify that a screening record created via offline sync engine can execute full analysis."""
    idempotency_key = "IDEM-TEST-1002-C8D9"
    payload = {
        "patientAlias": "PAT-RURAL-003",
        "operatorId": "PHC-TECH-01",
        "phcCenter": "PHC Rampur",
        "district": "Nanded"
    }

    create_res = client.post(
        "/api/v1/screenings",
        json=payload,
        headers={"X-Idempotency-Key": idempotency_key}
    )
    assert create_res.status_code == 201
    screening_id = create_res.json()["screeningId"]

    # Trigger analyze
    analyze_res = client.post(
        f"/api/v1/screenings/{screening_id}/analyze",
        headers={"X-Idempotency-Key": idempotency_key}
    )
    assert analyze_res.status_code == 200
    data = analyze_res.json()
    assert data["screeningId"] == screening_id
    assert "drGrade" in data
    assert "confidence" in data
