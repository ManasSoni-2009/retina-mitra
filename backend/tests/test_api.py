"""
Backend unit tests for FastAPI endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_list_screenings():
    response = client.get("/api/v1/screenings")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_single_screening():
    res_create = client.post("/api/v1/screenings", json={"patientAlias": "PAT-API-TEST"})
    scr_id = res_create.json()["screeningId"]
    client.post(f"/api/v1/screenings/{scr_id}/analyze")

    response = client.get(f"/api/v1/screenings/{scr_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["screeningId"] == scr_id
    assert "drGrade" in data
    assert "imageQuality" in data

def test_run_simulation():
    payload = {
        "annualPatientVolume": 10000,
        "patientsPerDay": 35,
        "imageSizeMb": 4.0,
        "networkBandwidthMbps": 2.0,
        "aiProcessingTimeSec": 3.0,
        "ophthalmologistReviewTimeMin": 10.0,
        "numberOfReviewers": 2,
        "percentageUngradable": 8.0,
        "percentageReferred": 15.0,
        "percentageRequiringHumanReview": 20.0
    }
    response = client.post("/api/v1/simulation/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "simulationId" in data
    assert data["estimatedAnnualCapacity"] > 0
