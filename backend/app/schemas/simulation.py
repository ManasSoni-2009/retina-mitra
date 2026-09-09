"""
Pydantic schemas for Simulink discrete-event queue capacity simulation.
"""

from typing import List, Dict, Any
from pydantic import BaseModel, Field

class SimulationInputParams(BaseModel):
    annualPatientVolume: int = Field(default=12000, ge=100, le=1000000)
    patientsPerDay: int = Field(default=40, ge=1, le=1000)
    arrivalRatePerHour: float = Field(default=5.0, ge=0.5, le=100.0)
    imageAcquisitionTimeMin: float = Field(default=5.0, ge=1.0, le=30.0)
    imageUploadTimeSec: float = Field(default=18.0, ge=0.5, le=3600.0)
    networkBandwidthMbps: float = Field(default=2.0, ge=0.01, le=100.0)
    imageSizeMb: float = Field(default=4.5, ge=0.5, le=50.0)
    qualityFailurePct: float = Field(default=8.5, ge=0.0, le=50.0)
    aiProcessingTimeSec: float = Field(default=3.5, ge=0.5, le=60.0)
    aiThroughputPerMin: float = Field(default=17.1, ge=1.0, le=600.0)
    humanReviewPct: float = Field(default=22.0, ge=0.0, le=100.0)
    reviewTimeMin: float = Field(default=12.0, ge=1.0, le=60.0)
    numberOfReviewers: int = Field(default=2, ge=1, le=50)
    workingHoursPerDay: int = Field(default=8, ge=1, le=24)
    workingDaysPerYear: int = Field(default=300, ge=100, le=365)
    scenarioName: str = Field(default="BASELINE")

class ThroughputPoint(BaseModel):
    day: int
    screenedAtPhc: int
    transferredToCloud: int
    aiProcessed: int
    escalatedToHuman: int
    finalCompleted: int

class SimulationResult(BaseModel):
    simulationId: str
    executedAt: str
    scenarioName: str = Field(default="BASELINE")
    params: SimulationInputParams
    engineLabel: str = Field(default="Interactive approximation (Fast Python Queue Engine)")
    isSimulinkDirectModel: bool = Field(default=False, description="False for Web UI interactive approximation; True when executed directly in MATLAB SimEvents")
    illustrativeNotice: str = Field(default="Illustrative scenario values used for decision support modeling.")
    throughputDaily: int
    throughputAnnual: int
    estimatedAnnualCapacity: int
    averageQueueLength: float
    maxQueueLength: float
    averageProcessingDelayHours: float
    reviewerUtilizationPct: float
    aiUtilizationPct: float
    humanReviewPct: float
    transmissionBacklogMb: float
    estimatedCompletionTimeDays: float
    bottleneckAlerts: List[str]
    timeline: List[ThroughputPoint]
