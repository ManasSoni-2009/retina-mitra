"""
Strict Pydantic Schemas for DrishtiSetu Quality & Screening Pipeline.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ImageQuality(BaseModel):
    qualityStatus: str = Field(..., description="GRADABLE (GOOD), BORDERLINE, or UNGRADABLE")
    overallScore: float = Field(..., ge=0.0, le=1.0, description="Overall quality index [0-1]")
    focusScore: float = Field(..., ge=0.0, le=1.0, description="Laplacian focus/sharpness score")
    illuminationScore: float = Field(..., ge=0.0, le=1.0, description="HSV V-channel illumination score")
    fieldOfViewScore: float = Field(..., ge=0.0, le=1.0, description="Retinal circular mask coverage score")
    artifactScore: float = Field(..., ge=0.0, le=1.0, description="Glare and clipping artifact score")
    contrastScore: float = Field(default=0.85, ge=0.0, le=1.0, description="Contrast range score")
    reasonCodes: List[str] = Field(default_factory=list, description="BLUR, LOW_LIGHT, OVEREXPOSURE, INCOMPLETE_FOV, GLARE, LOW_CONTRAST, INSUFFICIENT_RETINAL_AREA")
    humanReadableExplanation: List[str] = Field(default_factory=list)
    recaptureInstructions: List[str] = Field(default_factory=list)
    isPrototypeHeuristic: bool = Field(default=True, description="Labeled heuristic score prior to clinical validation")

class DRGrade(BaseModel):
    drGrade: int = Field(..., ge=0, le=4, description="ICDR DR Scale: 0=No DR, 1=Mild, 2=Mod, 3=Severe, 4=PDR")
    drGradeLabel: str
    referable: bool
    icdrDescription: str

class EvidenceItem(BaseModel):
    id: str
    type: str = Field(..., description="MICROANEURYSM, HEMORRHAGE, EXUDATE, VESSEL, ATTENTION_REGION, IMAGE_QUALITY")
    location: str = Field(..., description="Bounding box [x,y,w,h] or spatial quadrant name")
    severity: str = Field(default="MODERATE", description="MILD, MODERATE, SEVERE, NONE")
    source: str = Field(..., description="MODEL_ATTENTION, LESION_SEGMENTATION, VESSEL_SEGMENTATION, QUALITY_GATE")
    confidence: float = Field(..., ge=0.0, le=1.0)
    description: str = Field(..., description="Human-readable explanation of findings and pipeline contribution")

class LesionCandidate(BaseModel):
    id: str
    type: str = Field(..., description="microaneurysm, hemorrhage, hard_exudate, cotton_wool_spot")
    confidence: float
    bbox: List[int] = Field(..., description="[x, y, width, height]")
    severity: str = Field(default="MODERATE")

class Evidence(BaseModel):
    rawImageUrl: str
    enhancedImageUrl: Optional[str] = None
    vesselMapUrl: Optional[str] = None
    gradcamUrl: Optional[str] = None
    lesionOverlayUrl: Optional[str] = None
    combinedEvidenceUrl: Optional[str] = None
    items: List[EvidenceItem] = Field(default_factory=list)
    detectedLesions: List[LesionCandidate] = Field(default_factory=list)
    opticDiscLocated: bool = True
    foveaLocated: bool = True

class Confidence(BaseModel):
    rawConfidence: float = Field(default=0.0, ge=0.0, le=1.0)
    calibratedConfidence: float = Field(default=0.0, ge=0.0, le=1.0)
    uncertaintyStatus: str = Field(default="UNCERTAIN", description="HIGHER CONFIDENCE, LOWER CONFIDENCE, UNCERTAIN")
    uncertaintyEntropy: float = Field(default=1.0, ge=0.0, le=1.0)
    requiresHumanReview: bool = Field(default=True)
    decisionBannerState: str = Field(default="HUMAN_REVIEW_RECOMMENDED", description="AUTO_SCREENED, HUMAN_REVIEW_RECOMMENDED, IMAGE_UNGRADABLE")
    humanReviewReason: str = Field(default="Routine screening protocol")
    qualityWarning: Optional[str] = None
    disclaimer: str = Field(default="System confidence and uncertainty labels are algorithm estimates, not clinical guarantees.")

class ReviewDecision(BaseModel):
    reviewerId: str
    action: str = Field(..., description="CONFIRMED, OVERRIDDEN, RE_REVIEW, UNGRADABLE")
    overrideGrade: Optional[int] = Field(default=None, ge=0, le=4)
    comments: str = Field(default="")
    reviewedAt: str

class ProcessingMetadata(BaseModel):
    processingTimeMs: int = Field(default=1240)
    modelVer: str = Field(default="DrishtiSetu-v1.0-Demo")
    deviceUsed: str = Field(default="CPU")
    timestamp: str

class Report(BaseModel):
    screeningId: str
    createdAt: str
    patientAlias: str
    operatorId: str
    phcCenter: str
    district: str
    qualityStatus: str
    qualityFindings: List[str]
    drGradeLabel: str
    referable: bool
    rawConfidence: float
    calibratedConfidence: float
    uncertaintyStatus: str
    evidenceItems: List[EvidenceItem]
    humanReviewRecommendation: str
    humanReviewReason: str
    reviewStatus: str = Field(default="PENDING")
    reviewerDecision: Optional[ReviewDecision] = None
    modelVer: str = Field(default="DrishtiSetu-v1.0")
    disclaimer: str = Field(default="DrishtiSetu is an AI decision-support assistant. Not an autonomous medical diagnostic device.")
    bilingualMarathiAdvice: str = Field(default="कृपया आवश्यकतेनुसार नेत्रतज्ज्ञांचा सल्ला घ्या / Consult ophthalmologist as advised.")
    isDemoResult: bool = Field(default=False)

class ScreeningCreateRequest(BaseModel):
    patientAlias: str = Field(..., description="Anonymized patient ID e.g. PAT-2026-1042")
    operatorId: str = Field(default="PHC-TECH-01")
    phcCenter: str = Field(default="Primary Health Center - Rampur")
    district: str = Field(default="Nanded")

class AuditEvent(BaseModel):
    id: str
    timestamp: str
    actorId: str
    actorRole: str = Field(..., description="operator, reviewer, admin, system")
    action: str = Field(..., description="UPLOADED, QUALITY_CHECKED, AI_ANALYZED, REVIEW_REQUESTED, REVIEW_STARTED, REVIEW_COMPLETED, OVERRIDDEN, MARKED_UNGRADABLE")
    details: str

class Screening(BaseModel):
    screeningId: str
    createdAt: str
    operatorId: str
    patientAlias: str
    phcCenter: str
    district: str
    imageId: str
    imageUrl: str
    imageQuality: ImageQuality
    drGrade: DRGrade
    confidence: Confidence
    evidence: Evidence
    originalAiGrade: Optional[DRGrade] = Field(default=None, description="Immutable baseline AI prediction grade")
    originalAiConfidence: Optional[Confidence] = Field(default=None, description="Immutable baseline AI confidence")
    reviewStatus: str = Field(default="AI_COMPLETED", description="AI_COMPLETED, REVIEW_REQUIRED, IN_REVIEW, REVIEW_COMPLETED, REFERRED, UNGRADABLE")
    reviewDecision: Optional[ReviewDecision] = None
    auditTrail: List[AuditEvent] = Field(default_factory=list, description="Auditable timeline of pipeline actions")
    processingMetadata: Dict[str, Any]
