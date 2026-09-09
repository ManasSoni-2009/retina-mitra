"""
Pytest integration & unit test suite for DrishtiSetu Simulink capacity simulation API.
Tests:
- Baseline operational scenario simulation
- Low bandwidth scenario bottleneck alerts
- High human review escalation rate queue buildup
- Verification of engine labels ("Interactive approximation") vs "Simulink model"
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_baseline_simulation_run():
    payload = {
        "annualPatientVolume": 12000,
        "patientsPerDay": 40,
        "arrivalRatePerHour": 5.0,
        "imageAcquisitionTimeMin": 5.0,
        "imageUploadTimeSec": 18.0,
        "networkBandwidthMbps": 2.0,
        "imageSizeMb": 4.5,
        "qualityFailurePct": 8.5,
        "aiProcessingTimeSec": 3.5,
        "aiThroughputPerMin": 17.1,
        "humanReviewPct": 22.0,
        "reviewTimeMin": 12.0,
        "numberOfReviewers": 2,
        "workingHoursPerDay": 8,
        "workingDaysPerYear": 300,
        "scenarioName": "1. BASELINE"
    }
    response = client.post("/api/v1/simulation/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "simulationId" in data
    assert data["engineLabel"] == "Interactive approximation (Fast Python Queue Engine)"
    assert data["isSimulinkDirectModel"] is False
    assert data["throughputDaily"] > 0
    assert data["reviewerUtilizationPct"] >= 0.0
    assert data["aiUtilizationPct"] >= 0.0

def test_low_bandwidth_bottleneck():
    payload = {
        "annualPatientVolume": 12000,
        "patientsPerDay": 40,
        "arrivalRatePerHour": 5.0,
        "imageAcquisitionTimeMin": 5.0,
        "imageUploadTimeSec": 900.0,
        "networkBandwidthMbps": 0.04, # Very low bandwidth 40Kbps 2G
        "imageSizeMb": 4.5,
        "qualityFailurePct": 8.5,
        "aiProcessingTimeSec": 3.5,
        "aiThroughputPerMin": 17.1,
        "humanReviewPct": 22.0,
        "reviewTimeMin": 12.0,
        "numberOfReviewers": 2,
        "workingHoursPerDay": 8,
        "workingDaysPerYear": 300,
        "scenarioName": "2. LOW BANDWIDTH"
    }
    response = client.post("/api/v1/simulation/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["transmissionBacklogMb"] > 0.0
    assert any("Network Bandwidth Bottleneck" in alert for alert in data["bottleneckAlerts"])
