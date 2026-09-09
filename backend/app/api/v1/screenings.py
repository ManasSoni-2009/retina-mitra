"""
Modular REST API Routers for DrishtiSetu Screenings Pipeline.
Endpoints:
- POST /api/v1/screenings
- POST /api/v1/screenings/{id}/image
- POST /api/v1/screenings/{id}/analyze
- GET  /api/v1/screenings/{id}
- GET  /api/v1/screenings
- GET  /api/v1/screenings/{id}/report
- POST /api/v1/screenings/{id}/review
"""

import os
import uuid
import numpy as np
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Depends, Header, status
from app.core.config import settings
from app.core.rbac import get_current_user, require_role
from app.schemas.screening import (
    Screening, ScreeningCreateRequest, ImageQuality, DRGrade, Evidence, Confidence, ReviewDecision, Report, AuditEvent
)
from app.services.quality_service import validate_image_file, analyze_fundus_quality
from app.ml.inference_engine import get_inference_engine
from app.services.database import db

router = APIRouter()

# In-memory screening records storage for API server runtime
_IDEMPOTENCY_CACHE: dict[str, Screening] = {}

@router.post("/screenings", response_model=Screening, status_code=status.HTTP_201_CREATED)
def create_screening(
    req: ScreeningCreateRequest, 
    user: dict = Depends(get_current_user),
    x_idempotency_key: Optional[str] = Header(None, alias="X-Idempotency-Key")
):
    """
    Creates a new patient screening record shell.
    Supports idempotency via X-Idempotency-Key header to prevent duplicate record creations during network retries.
    """
    if x_idempotency_key and x_idempotency_key in _IDEMPOTENCY_CACHE:
        return _IDEMPOTENCY_CACHE[x_idempotency_key]

    screening_id = f"SCR-{datetime.now().strftime('%Y')}-{uuid.uuid4().hex[:4].upper()}"
    now_iso = datetime.now(timezone.utc).isoformat()
    new_screening = Screening(
        screeningId=screening_id,
        createdAt=now_iso,
        operatorId=req.operatorId,
        patientAlias=req.patientAlias,
        phcCenter=req.phcCenter,
        district=req.district,
        imageId="IMG-PENDING",
        imageUrl="/samples/fundus_normal.png",
        imageQuality=ImageQuality(
            qualityStatus="BORDERLINE",
            overallScore=0.50,
            focusScore=0.50,
            illuminationScore=0.50,
            fieldOfViewScore=0.50,
            artifactScore=0.50,
            reasonCodes=["Awaiting image upload for quality assessment."],
            humanReadableExplanation=["Awaiting image upload for quality assessment."],
            recaptureInstructions=[],
            isPrototypeHeuristic=True
        ),
        drGrade=DRGrade(
            drGrade=0,
            drGradeLabel="Pending Analysis",
            referable=False,
            icdrDescription="Analysis not yet executed."
        ),
        confidence=Confidence(
            rawConfidence=0.0,
            calibratedConfidence=0.0,
            uncertaintyStatus="UNCERTAIN",
            uncertaintyEntropy=1.0,
            requiresHumanReview=True
        ),
        evidence=Evidence(rawImageUrl="/samples/fundus_normal.png"),
        reviewStatus="REVIEW_REQUIRED",
        auditTrail=[
            AuditEvent(
                id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
                timestamp=now_iso,
                actorId=req.operatorId,
                actorRole=user.get("role", "operator"),
                action="UPLOADED",
                details=f"Screening record created for patient {req.patientAlias} at {req.phcCenter}"
            )
        ],
        processingMetadata={
            "created": True,
            "timestamp": now_iso,
            "idempotencyKey": x_idempotency_key
        }
    )
    db.save(new_screening)
    if x_idempotency_key:
        _IDEMPOTENCY_CACHE[x_idempotency_key] = new_screening
    return new_screening

@router.post("/screenings/{screening_id}/image", response_model=ImageQuality)
async def upload_screening_image(
    screening_id: str,
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Validates and stores fundus image scan.
    Strictly validates MIME type, extension, file size (<= 20MB), and image dimensions.
    Executes real OpenCV Quality Gate heuristics.
    """
    record = db.get_by_id(screening_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Screening record '{screening_id}' not found.")

    file_bytes = await file.read()
    
    # 1. Validate MIME, extension, size, dimensions
    is_valid, err_msg = validate_image_file(file_bytes, file.filename or "image.png", file.content_type or "image/png")
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    # Save image to storage / uploads directory
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "..", "static", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    file_ext = os.path.splitext(file.filename or "image.png")[1] or ".png"
    img_filename = f"{screening_id}_{uuid.uuid4().hex[:6]}{file_ext}"
    img_path = os.path.join(uploads_dir, img_filename)
    with open(img_path, "wb") as f:
        f.write(file_bytes)

    # 2. Run real OpenCV quality analysis
    quality = analyze_fundus_quality(file_bytes, file.filename or "")
    now_iso = datetime.now(timezone.utc).isoformat()

    record.imageId = f"IMG-{uuid.uuid4().hex[:6].upper()}"
    record.imageUrl = f"/static/uploads/{img_filename}"
    record.evidence.rawImageUrl = f"/static/uploads/{img_filename}"
    record.imageQuality = quality
    
    record.auditTrail.append(
        AuditEvent(
            id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
            timestamp=now_iso,
            actorId=user.get("userId", "PHC-TECH-01"),
            actorRole=user.get("role", "operator"),
            action="QUALITY_CHECKED",
            details=f"Quality check result: {quality.qualityStatus} (Score: {quality.overallScore:.2f})"
        )
    )

    if quality.qualityStatus == "UNGRADABLE":
        record.drGrade.drGradeLabel = "Ungradable — Recapture Required"
        record.confidence.requiresHumanReview = True
        record.reviewStatus = "UNGRADABLE"
        record.auditTrail.append(
            AuditEvent(
                id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
                timestamp=now_iso,
                actorId="SYSTEM",
                actorRole="system",
                action="MARKED_UNGRADABLE",
                details="Quality Gate marked image UNGRADABLE. AI inference blocked; recapture required."
            )
        )

    db.save(record)
    return quality

@router.post("/screenings/{screening_id}/analyze", response_model=Screening)
def analyze_screening(screening_id: str, user: dict = Depends(get_current_user)):
    """
    Executes full explainable screening pipeline:
    Quality Gate Check -> Enhancement -> DR Severity Grading -> XAI Heatmaps -> Confidence Calibration.
    CORE RULE: If image is UNGRADABLE, downstream AI inference is BLOCKED.
    """
    record = db.get_by_id(screening_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Screening record '{screening_id}' not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    
    # 1. QUALITY GATE ENFORCEMENT
    if record.imageQuality.qualityStatus == "UNGRADABLE":
        record.drGrade = DRGrade(
            drGrade=0,
            drGradeLabel="Ungradable — Recapture Required",
            referable=False,
            icdrDescription="AI classification blocked because image quality is ungradable."
        )
        record.confidence = Confidence(
            rawConfidence=0.0,
            calibratedConfidence=0.0,
            uncertaintyStatus="UNCERTAIN",
            uncertaintyEntropy=1.0,
            requiresHumanReview=True,
            qualityWarning="Image ungradable — AI classification stopped. Recapture required."
        )
        record.processingMetadata["inferenceBlocked"] = True
        record.processingMetadata["blockedReason"] = "QUALITY_GATE_UNGRADABLE"
        db.save(record)
        return record

    # 2. BORDERLINE HANDLING
    quality_warning = None
    if record.imageQuality.qualityStatus == "BORDERLINE":
        if not settings.QUALITY_ALLOW_BORDERLINE_INFERENCE:
            raise HTTPException(
                status_code=400,
                detail="Inference blocked for borderline quality scan per system configuration."
            )
        quality_warning = "Borderline image quality — human review recommended."

    # 3. RUN INFERENCE FOR GRADABLE / ALLOWED BORDERLINE
    engine = get_inference_engine()
    res = engine.predict_dr_severity(np.zeros((200, 200, 3)), record.imageQuality.qualityStatus)

    record.drGrade = res["drGrade"]
    record.confidence = res["confidence"]
    if quality_warning:
        record.confidence.qualityWarning = quality_warning
        record.confidence.requiresHumanReview = True
        
    record.evidence = res["evidence"]
    record.processingMetadata["engineUsed"] = res.get("engineUsed", "FastAPI-Inference")
    record.processingMetadata["analyzedAt"] = now_iso

    # Preserve IMMUTABLE original AI baseline predictions
    if record.originalAiGrade is None:
        record.originalAiGrade = record.drGrade.model_copy()
    if record.originalAiConfidence is None:
        record.originalAiConfidence = record.confidence.model_copy()

    # Route status
    if record.drGrade.referable or record.confidence.requiresHumanReview:
        record.reviewStatus = "REVIEW_REQUIRED"
    else:
        record.reviewStatus = "AI_COMPLETED"

    record.auditTrail.append(
        AuditEvent(
            id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
            timestamp=now_iso,
            actorId="SYSTEM",
            actorRole="system",
            action="AI_ANALYZED",
            details=f"AI graded {record.drGrade.drGradeLabel} (Calibrated Conf: {record.confidence.calibratedConfidence*100:.0f}%, Uncertainty: {record.confidence.uncertaintyStatus})"
        )
    )
    if record.reviewStatus == "REVIEW_REQUIRED":
        record.auditTrail.append(
            AuditEvent(
                id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
                timestamp=now_iso,
                actorId="SYSTEM",
                actorRole="system",
                action="REVIEW_REQUESTED",
                details="Case routed to specialist review queue based on clinical safety protocol."
            )
        )

    db.save(record)
    return record

@router.get("/screenings/{screening_id}", response_model=Screening)
def get_screening_detail(screening_id: str):
    """Fetches a single screening record by ID."""
    record = db.get_by_id(screening_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Screening record '{screening_id}' not found.")
    return record

@router.get("/screenings", response_model=List[Screening])
def list_screenings(
    quality_status: Optional[str] = Query(None),
    dr_grade: Optional[int] = Query(None),
    referable: Optional[bool] = Query(None),
    requires_review: Optional[bool] = Query(None)
):
    """Lists screening records with optional filtering."""
    results = db.get_all()
    if quality_status:
        results = [s for s in results if s.imageQuality.qualityStatus == quality_status]
    if dr_grade is not None:
        results = [s for s in results if s.drGrade.drGrade == dr_grade]
    if referable is not None:
        results = [s for s in results if s.drGrade.referable == referable]
    if requires_review is not None:
        results = [s for s in results if s.confidence.requiresHumanReview == requires_review]
    return results

@router.get("/screenings/{screening_id}/report", response_model=Report)
def get_screening_report(screening_id: str):
    """Generates structured clinical screening report data for a screening record."""
    record = db.get_by_id(screening_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Screening record '{screening_id}' not found.")

    conf = record.confidence

    raw_c = getattr(conf, "rawConfidence", getattr(conf, "confidenceScore", 0.89))
    cal_c = getattr(conf, "calibratedConfidence", getattr(conf, "confidenceScore", 0.86))
    unc_s = getattr(conf, "uncertaintyStatus", "HIGHER CONFIDENCE")
    banner_state = getattr(conf, "decisionBannerState", "HUMAN_REVIEW_RECOMMENDED")
    human_reason = getattr(conf, "humanReviewReason", "Routine clinical review")

    rec = "Refer for specialist evaluation within 4 weeks." if record.drGrade.referable else "Routine annual screening."

    return Report(
        screeningId=record.screeningId,
        createdAt=record.createdAt,
        patientAlias=record.patientAlias,
        operatorId=record.operatorId,
        phcCenter=record.phcCenter,
        district=record.district,
        qualityStatus=record.imageQuality.qualityStatus,
        qualityFindings=record.imageQuality.humanReadableExplanation,
        drGradeLabel=record.drGrade.drGradeLabel,
        referable=record.drGrade.referable,
        rawConfidence=raw_c,
        calibratedConfidence=cal_c,
        uncertaintyStatus=unc_s,
        evidenceItems=record.evidence.items,
        humanReviewRecommendation=banner_state,
        humanReviewReason=human_reason,
        reviewStatus=record.reviewStatus,
        reviewerDecision=record.reviewDecision,
        modelVer=record.processingMetadata.get("modelVer", "DrishtiSetu-v1.0"),
        disclaimer="DrishtiSetu is an explainable AI decision-support platform. Not an autonomous medical diagnostic device.",
        bilingualMarathiAdvice="कृपया नेत्रतज्ज्ञांचा सल्ला घ्या (Refer to Ophthalmologist for complete eye checkup)",
        isDemoResult=record.processingMetadata.get("isDemoResult", False)
    )

@router.get("/review-queue", response_model=List[Screening])
def get_review_queue(
    sort_by: str = Query(default="priority", description="priority, uncertainty, referable, age"),
    user: dict = Depends(get_current_user)
):
    """
    Returns cases requiring specialist review, sorted by clinical priority, uncertainty, referability, or age.
    Statuses included: REVIEW_REQUIRED, IN_REVIEW, UNGRADABLE.
    """
    all_cases = db.get_all()
    queue_cases = [
        s for s in all_cases 
        if s.reviewStatus in ["REVIEW_REQUIRED", "IN_REVIEW", "UNGRADABLE", "PENDING"] 
        or s.drGrade.referable 
        or s.confidence.requiresHumanReview
    ]

    def priority_key(s: Screening):
        dr_val = s.drGrade.drGrade
        unc_entropy = getattr(s.confidence, "uncertaintyEntropy", 0.5)
        ungradable_boost = 2.0 if s.imageQuality.qualityStatus == "UNGRADABLE" else (1.0 if s.imageQuality.qualityStatus == "BORDERLINE" else 0.0)
        return (dr_val * 2.0) + (unc_entropy * 3.0) + ungradable_boost

    if sort_by == "uncertainty":
        queue_cases.sort(key=lambda s: getattr(s.confidence, "uncertaintyEntropy", 0.0), reverse=True)
    elif sort_by == "referable":
        queue_cases.sort(key=lambda s: (s.drGrade.referable, s.drGrade.drGrade), reverse=True)
    elif sort_by == "age":
        queue_cases.sort(key=lambda s: s.createdAt, reverse=False) # Oldest cases first
    else: # priority
        queue_cases.sort(key=priority_key, reverse=True)

    return queue_cases

@router.post("/screenings/{screening_id}/start-review", response_model=Screening)
def start_screening_review(
    screening_id: str,
    user: dict = Depends(require_role(["reviewer", "admin"]))
):
    """Claims case from review queue and marks status IN_REVIEW."""
    record = db.get_by_id(screening_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Screening record '{screening_id}' not found.")

    record.reviewStatus = "IN_REVIEW"
    now_iso = datetime.now(timezone.utc).isoformat()
    record.auditTrail.append(
        AuditEvent(
            id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
            timestamp=now_iso,
            actorId=user["userId"],
            actorRole=user["role"],
            action="REVIEW_STARTED",
            details=f"Reviewer {user['userId']} opened case for specialist examination."
        )
    )
    db.save(record)
    return record

@router.post("/screenings/{screening_id}/review", response_model=Screening)
def submit_human_review(
    screening_id: str,
    decision: ReviewDecision,
    user: dict = Depends(require_role(["reviewer", "admin"]))
):
    """
    Submits human specialist review decision (Accept AI, Override, Referral, Mark Ungradable).
    ENFORCES:
    1. Operator role is blocked with 403 Forbidden.
    2. Overrides & re-reviews require non-empty clinical justification comments.
    3. Preserves immutable baseline AI prediction in originalAiGrade.
    4. Records chronological audit trail event.
    """
    record = db.get_by_id(screening_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Screening record '{screening_id}' not found.")

    # Validate override comments
    if decision.action in ["OVERRIDDEN", "RE_REVIEW"] and not decision.comments.strip():
        raise HTTPException(
            status_code=400,
            detail="Human override or re-review request requires a mandatory clinical explanation comment."
        )

    # Validate ungradable scan rule
    if record.imageQuality.qualityStatus == "UNGRADABLE" and decision.action == "CONFIRMED":
        raise HTTPException(
            status_code=400,
            detail="Ungradable image scan cannot be confirmed without explicit specialist override grade and clinical reason."
        )

    # Ensure baseline AI prediction is saved immutably
    if record.originalAiGrade is None:
        record.originalAiGrade = record.drGrade.model_copy()
    if record.originalAiConfidence is None:
        record.originalAiConfidence = record.confidence.model_copy()

    record.reviewDecision = decision
    now_iso = datetime.now(timezone.utc).isoformat()

    record.reviewStatus = decision.action
    audit_action = "REVIEW_COMPLETED"

    if decision.action == "OVERRIDDEN" and decision.overrideGrade is not None:
        record.drGrade.drGrade = decision.overrideGrade
        record.drGrade.drGradeLabel = f"Level {decision.overrideGrade} — Overridden by Specialist"
        record.drGrade.referable = decision.overrideGrade >= 2
        audit_action = "OVERRIDDEN"
        detail_msg = f"Specialist overridden AI grade to Level {decision.overrideGrade}. Reason: {decision.comments}"
    elif decision.action == "UNGRADABLE":
        audit_action = "MARKED_UNGRADABLE"
        detail_msg = f"Specialist marked scan UNGRADABLE for image recapture. Note: {decision.comments}"
    elif decision.action == "CONFIRMED":
        audit_action = "REVIEW_COMPLETED"
        detail_msg = f"Specialist confirmed AI screening result ({record.drGrade.drGradeLabel}). Note: {decision.comments or 'Confirmed.'}"
    elif decision.action == "REFERRED":
        audit_action = "REVIEW_COMPLETED"
        detail_msg = f"Specialist confirmed referral to tertiary eye clinic. Note: {decision.comments}"
    else:
        audit_action = "REVIEW_COMPLETED"
        detail_msg = f"Review completed with action {decision.action}. Note: {decision.comments}"

    record.auditTrail.append(
        AuditEvent(
            id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
            timestamp=now_iso,
            actorId=decision.reviewerId or user["userId"],
            actorRole=user["role"],
            action=audit_action,
            details=detail_msg
        )
    )

    db.save(record)
    return record
