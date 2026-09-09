from typing import List, Optional
from datetime import datetime, timezone
import uuid
from app.schemas.screening import Screening, ImageQuality, DRGrade, Evidence, EvidenceItem, Confidence, ProcessingMetadata, LesionCandidate, AuditEvent

SAMPLE_SCREENINGS: List[Screening] = [
    # 1. Good Quality / No DR (ICDR Level 0, AUTO_SCREENED)
    Screening(
        screeningId="SCR-2026-001",
        createdAt="2026-09-08T10:15:00Z",
        operatorId="PHC-TECH-01",
        patientAlias="PAT-2026-8812",
        phcCenter="Primary Health Center - Rampur",
        district="Nanded",
        imageId="IMG-8812-RAW",
        imageUrl="/samples/fundus_normal.png",
        imageQuality=ImageQuality(
            qualityStatus="GRADABLE",
            overallScore=0.92,
            focusScore=0.91,
            illuminationScore=0.95,
            fieldOfViewScore=0.94,
            artifactScore=0.90,
            reasonCodes=[],
            humanReadableExplanation=["Image focus sharpness, illumination, and field-of-view are optimal."],
            recaptureInstructions=[],
            isPrototypeHeuristic=True
        ),
        drGrade=DRGrade(
            drGrade=0,
            drGradeLabel="Level 0 — No DR",
            referable=False,
            icdrDescription="No microaneurysms or retinal lesions detected."
        ),
        confidence=Confidence(
            rawConfidence=0.96,
            calibratedConfidence=0.94,
            uncertaintyStatus="HIGHER CONFIDENCE",
            uncertaintyEntropy=0.04,
            requiresHumanReview=False,
            decisionBannerState="AUTO_SCREENED",
            humanReviewReason="Clear, high-quality scan with no detectable DR lesions. Routine annual follow-up.",
            qualityWarning=None
        ),
        evidence=Evidence(
            rawImageUrl="/samples/fundus_normal.png",
            enhancedImageUrl="/samples/fundus_normal.png",
            vesselMapUrl="/samples/fundus_normal.png",
            gradcamUrl="/samples/fundus_normal.png",
            lesionOverlayUrl="/samples/fundus_normal.png",
            combinedEvidenceUrl="/samples/fundus_normal.png",
            items=[
                EvidenceItem(
                    id="EVD-01",
                    type="ATTENTION_REGION",
                    location="Macula & Optic Disc Central Axis",
                    severity="NONE",
                    source="MODEL_ATTENTION",
                    confidence=0.94,
                    description="Model spatial attention focused on normal foveal avascular zone and clear optic disc margins."
                ),
                EvidenceItem(
                    id="EVD-02",
                    type="VESSEL",
                    location="Superior & Inferior Vascular Arches",
                    severity="NONE",
                    source="VESSEL_SEGMENTATION",
                    confidence=0.96,
                    description="Vessel extraction confirms normal retinal vascular caliber and absence of neovascularization."
                ),
                EvidenceItem(
                    id="EVD-03",
                    type="IMAGE_QUALITY",
                    location="Full 45° Retinal Field",
                    severity="NONE",
                    source="QUALITY_GATE",
                    confidence=0.92,
                    description="High Laplacian sharpness (0.91) and uniform illumination across all 4 quadrants."
                )
            ],
            detectedLesions=[],
            opticDiscLocated=True,
            foveaLocated=True
        ),
        originalAiGrade=DRGrade(
            drGrade=0,
            drGradeLabel="Level 0 — No DR",
            referable=False,
            icdrDescription="No microaneurysms or retinal lesions detected."
        ),
        originalAiConfidence=Confidence(
            rawConfidence=0.96,
            calibratedConfidence=0.94,
            uncertaintyStatus="HIGHER CONFIDENCE",
            uncertaintyEntropy=0.04,
            requiresHumanReview=False,
            decisionBannerState="AUTO_SCREENED",
            humanReviewReason="Clear, high-quality scan with no detectable DR lesions. Routine annual follow-up.",
            qualityWarning=None
        ),
        reviewStatus="REVIEW_COMPLETED",
        auditTrail=[
            AuditEvent(id="AUD-001", timestamp="2026-09-08T10:15:00Z", actorId="PHC-TECH-01", actorRole="operator", action="UPLOADED", details="Uploaded raw fundus image fundus_normal.png"),
            AuditEvent(id="AUD-002", timestamp="2026-09-08T10:15:01Z", actorId="SYSTEM", actorRole="system", action="QUALITY_CHECKED", details="Quality Gate check passed (GRADABLE, score 0.92)"),
            AuditEvent(id="AUD-003", timestamp="2026-09-08T10:15:01Z", actorId="SYSTEM", actorRole="system", action="AI_ANALYZED", details="PyTorch ConvNeXt model graded Level 0 (No DR, Calibrated Conf: 94%)"),
            AuditEvent(id="AUD-004", timestamp="2026-09-08T10:20:00Z", actorId="DR-S-RAO", actorRole="reviewer", action="REVIEW_STARTED", details="Claimed case from review queue"),
            AuditEvent(id="AUD-005", timestamp="2026-09-08T10:22:00Z", actorId="DR-S-RAO", actorRole="reviewer", action="REVIEW_COMPLETED", details="Confirmed AI decision — Level 0 No DR")
        ],
        processingMetadata={
            "processingTimeMs": 1240,
            "modelVer": "DrishtiSetu-v1.0-PyTorch",
            "deviceUsed": "CPU/CUDA",
            "timestamp": "2026-09-08T10:15:01Z"
        }
    ),

    # 2. Good Quality / Referable (ICDR Level 2 Moderate NPDR, HUMAN_REVIEW_RECOMMENDED)
    Screening(
        screeningId="SCR-2026-002",
        createdAt="2026-09-08T11:30:00Z",
        operatorId="PHC-TECH-01",
        patientAlias="PAT-2026-4419",
        phcCenter="Primary Health Center - Rampur",
        district="Nanded",
        imageId="IMG-4419-RAW",
        imageUrl="/samples/fundus_moderate.png",
        imageQuality=ImageQuality(
            qualityStatus="GRADABLE",
            overallScore=0.88,
            focusScore=0.87,
            illuminationScore=0.86,
            fieldOfViewScore=0.90,
            artifactScore=0.89,
            reasonCodes=[],
            humanReadableExplanation=["Sufficient sharpness and contrast for structural lesion identification."],
            recaptureInstructions=[],
            isPrototypeHeuristic=True
        ),
        drGrade=DRGrade(
            drGrade=2,
            drGradeLabel="Level 2 — Moderate NPDR",
            referable=True,
            icdrDescription="Microaneurysms, intraretinal hemorrhages, or hard exudates present."
        ),
        confidence=Confidence(
            rawConfidence=0.89,
            calibratedConfidence=0.86,
            uncertaintyStatus="HIGHER CONFIDENCE",
            uncertaintyEntropy=0.11,
            requiresHumanReview=True,
            decisionBannerState="HUMAN_REVIEW_RECOMMENDED",
            humanReviewReason="Referable DR detected (Level 2+ Moderate NPDR). Mandatory specialist review for referral confirmation.",
            qualityWarning=None
        ),
        evidence=Evidence(
            rawImageUrl="/samples/fundus_moderate.png",
            enhancedImageUrl="/samples/fundus_moderate.png",
            vesselMapUrl="/samples/fundus_moderate.png",
            gradcamUrl="/samples/fundus_moderate.png",
            lesionOverlayUrl="/samples/fundus_moderate.png",
            combinedEvidenceUrl="/samples/fundus_moderate.png",
            items=[
                EvidenceItem(
                    id="EVD-10",
                    type="MICROANEURYSM",
                    location="Bounding Box [240, 310, 25, 25]",
                    severity="MILD",
                    source="LESION_SEGMENTATION",
                    confidence=0.85,
                    description="Microaneurysm candidate detected by U-Net segmentation. Contributes supporting structural evidence for DR grading."
                ),
                EvidenceItem(
                    id="EVD-11",
                    type="EXUDATE",
                    location="Bounding Box [450, 280, 40, 35]",
                    severity="MODERATE",
                    source="LESION_SEGMENTATION",
                    confidence=0.91,
                    description="Hard exudate cluster detected near temporal arc. Suggests lipid leakage from damaged capillaries."
                ),
                EvidenceItem(
                    id="EVD-12",
                    type="ATTENTION_REGION",
                    location="Superior Temporal Arc & Juxtafoveal Region",
                    severity="MODERATE",
                    source="MODEL_ATTENTION",
                    confidence=0.89,
                    description="Grad-CAM spatial heatmap shows high model receptive field concentration around temporal vascular arc."
                ),
                EvidenceItem(
                    id="EVD-13",
                    type="VESSEL",
                    location="Juxtafoveal Vascular Fringe",
                    severity="MILD",
                    source="VESSEL_SEGMENTATION",
                    confidence=0.88,
                    description="Vessel extraction identifies subtle capillary tortuosity."
                )
            ],
            detectedLesions=[
                LesionCandidate(id="LES-01", type="microaneurysm", confidence=0.85, bbox=[240, 310, 25, 25], severity="MILD"),
                LesionCandidate(id="LES-02", type="hard_exudate", confidence=0.91, bbox=[450, 280, 40, 35], severity="MODERATE")
            ],
            opticDiscLocated=True,
            foveaLocated=True
        ),
        originalAiGrade=DRGrade(
            drGrade=2,
            drGradeLabel="Level 2 — Moderate NPDR",
            referable=True,
            icdrDescription="Microaneurysms, intraretinal hemorrhages, or hard exudates present."
        ),
        originalAiConfidence=Confidence(
            rawConfidence=0.89,
            calibratedConfidence=0.86,
            uncertaintyStatus="HIGHER CONFIDENCE",
            uncertaintyEntropy=0.11,
            requiresHumanReview=True,
            decisionBannerState="HUMAN_REVIEW_RECOMMENDED",
            humanReviewReason="Referable DR detected (Level 2+ Moderate NPDR). Mandatory specialist review for referral confirmation.",
            qualityWarning=None
        ),
        reviewStatus="REVIEW_REQUIRED",
        auditTrail=[
            AuditEvent(id="AUD-010", timestamp="2026-09-08T11:30:00Z", actorId="PHC-TECH-01", actorRole="operator", action="UPLOADED", details="Uploaded raw fundus image fundus_moderate.png"),
            AuditEvent(id="AUD-011", timestamp="2026-09-08T11:30:01Z", actorId="SYSTEM", actorRole="system", action="QUALITY_CHECKED", details="Quality Gate check passed (GRADABLE, score 0.88)"),
            AuditEvent(id="AUD-012", timestamp="2026-09-08T11:30:02Z", actorId="SYSTEM", actorRole="system", action="AI_ANALYZED", details="PyTorch ConvNeXt model graded Level 2 Moderate NPDR (Referable, Calibrated Conf: 86%)"),
            AuditEvent(id="AUD-013", timestamp="2026-09-08T11:30:02Z", actorId="SYSTEM", actorRole="system", action="REVIEW_REQUESTED", details="Referable DR threshold met — Routed to specialist review queue")
        ],
        processingMetadata={
            "processingTimeMs": 1410,
            "modelVer": "DrishtiSetu-v1.0-PyTorch",
            "deviceUsed": "CPU/CUDA",
            "timestamp": "2026-09-08T11:30:02Z"
        }
    ),

    # 3. Ungradable Blur Scan (IMAGE_UNGRADABLE)
    Screening(
        screeningId="SCR-2026-003",
        createdAt="2026-09-08T12:05:00Z",
        operatorId="PHC-TECH-01",
        patientAlias="PAT-2026-1104",
        phcCenter="Primary Health Center - Rampur",
        district="Nanded",
        imageId="IMG-1104-RAW",
        imageUrl="/samples/fundus_blur.png",
        imageQuality=ImageQuality(
            qualityStatus="UNGRADABLE",
            overallScore=0.34,
            focusScore=0.28,
            illuminationScore=0.40,
            fieldOfViewScore=0.65,
            artifactScore=0.50,
            reasonCodes=["BLUR", "LOW_LIGHT", "INCOMPLETE_FOV"],
            humanReadableExplanation=[
                "Image focus sharpness is below minimum ISO threshold (0.28 vs 0.65 required).",
                "Severe motion blur caused by eye movement during capture.",
                "Inadequate illumination at temporal retinal boundary."
            ],
            recaptureInstructions=[
                "Hold camera steady and ask patient to fixate gaze before shutter release.",
                "Increase camera flash intensity or darken room ambient lighting.",
                "Re-align camera optical center with patient pupil."
            ],
            isPrototypeHeuristic=True
        ),
        drGrade=DRGrade(
            drGrade=0,
            drGradeLabel="Ungradable — Recapture Required",
            referable=False,
            icdrDescription="AI classification stopped due to ungradable image quality. Recapture required."
        ),
        confidence=Confidence(
            rawConfidence=0.0,
            calibratedConfidence=0.0,
            uncertaintyStatus="UNCERTAIN",
            uncertaintyEntropy=1.0,
            requiresHumanReview=True,
            decisionBannerState="IMAGE_UNGRADABLE",
            humanReviewReason="Quality Gate hard-blocked classification. Physical image recapture required.",
            qualityWarning="Image ungradable — AI classification stopped. Recapture required."
        ),
        evidence=Evidence(
            rawImageUrl="/samples/fundus_blur.png",
            enhancedImageUrl="/samples/fundus_blur.png",
            vesselMapUrl="/samples/fundus_blur.png",
            gradcamUrl="/samples/fundus_blur.png",
            lesionOverlayUrl="/samples/fundus_blur.png",
            combinedEvidenceUrl="/samples/fundus_blur.png",
            items=[
                EvidenceItem(
                    id="EVD-20",
                    type="IMAGE_QUALITY",
                    location="Full Retinal Frame",
                    severity="SEVERE",
                    source="QUALITY_GATE",
                    confidence=0.98,
                    description="Quality Gate assessment flagged Laplacian focus score of 0.28 (BLUR defect). AI inference stopped."
                )
            ],
            detectedLesions=[],
            opticDiscLocated=False,
            foveaLocated=False
        ),
        originalAiGrade=DRGrade(
            drGrade=0,
            drGradeLabel="Ungradable — Recapture Required",
            referable=False,
            icdrDescription="AI classification stopped due to ungradable image quality. Recapture required."
        ),
        originalAiConfidence=Confidence(
            rawConfidence=0.0,
            calibratedConfidence=0.0,
            uncertaintyStatus="UNCERTAIN",
            uncertaintyEntropy=1.0,
            requiresHumanReview=True,
            decisionBannerState="IMAGE_UNGRADABLE",
            humanReviewReason="Quality Gate hard-blocked classification. Physical image recapture required.",
            qualityWarning="Image ungradable — AI classification stopped. Recapture required."
        ),
        reviewStatus="UNGRADABLE",
        auditTrail=[
            AuditEvent(id="AUD-020", timestamp="2026-09-08T12:05:00Z", actorId="PHC-TECH-01", actorRole="operator", action="UPLOADED", details="Uploaded raw fundus image fundus_blur.png"),
            AuditEvent(id="AUD-021", timestamp="2026-09-08T12:05:01Z", actorId="SYSTEM", actorRole="system", action="QUALITY_CHECKED", details="Quality Gate check FAILED (UNGRADABLE, focus 0.28 < 0.65 threshold)"),
            AuditEvent(id="AUD-022", timestamp="2026-09-08T12:05:01Z", actorId="SYSTEM", actorRole="system", action="MARKED_UNGRADABLE", details="Classification stopped — Marked UNGRADABLE, recapture requested")
        ],
        processingMetadata={
            "processingTimeMs": 310,
            "modelVer": "DrishtiSetu-v1.0-QualityGate",
            "deviceUsed": "CPU",
            "timestamp": "2026-09-08T12:05:01Z"
        }
    ),

    # 4. Uncertain / Borderline Scan (HUMAN_REVIEW_RECOMMENDED)
    Screening(
        screeningId="SCR-2026-004",
        createdAt="2026-09-08T13:40:00Z",
        operatorId="PHC-TECH-02",
        patientAlias="PAT-2026-7730",
        phcCenter="Primary Health Center - Rampur",
        district="Nanded",
        imageId="IMG-7730-RAW",
        imageUrl="/samples/fundus_moderate.png",
        imageQuality=ImageQuality(
            qualityStatus="BORDERLINE",
            overallScore=0.52,
            focusScore=0.54,
            illuminationScore=0.48,
            fieldOfViewScore=0.60,
            artifactScore=0.55,
            reasonCodes=["LOW_LIGHT", "LOW_CONTRAST"],
            humanReadableExplanation=["Image illumination is sub-optimal with peripheral shadow gradients."],
            recaptureInstructions=["Re-align light source and darken ambient room lighting."],
            isPrototypeHeuristic=True
        ),
        drGrade=DRGrade(
            drGrade=1,
            drGradeLabel="Level 1 — Mild NPDR (Borderline Quality)",
            referable=False,
            icdrDescription="Subtle microaneurysms suspected, but borderline contrast prevents high-confidence grading."
        ),
        confidence=Confidence(
            rawConfidence=0.68,
            calibratedConfidence=0.58,
            uncertaintyStatus="LOWER CONFIDENCE",
            uncertaintyEntropy=0.64,
            requiresHumanReview=True,
            decisionBannerState="HUMAN_REVIEW_RECOMMENDED",
            humanReviewReason="Calibrated confidence (0.58) is below 0.65 threshold & quality is BORDERLINE. Specialist review recommended.",
            qualityWarning="Borderline image quality — human review recommended."
        ),
        evidence=Evidence(
            rawImageUrl="/samples/fundus_moderate.png",
            enhancedImageUrl="/samples/fundus_moderate.png",
            vesselMapUrl="/samples/fundus_moderate.png",
            gradcamUrl="/samples/fundus_moderate.png",
            lesionOverlayUrl="/samples/fundus_moderate.png",
            combinedEvidenceUrl="/samples/fundus_moderate.png",
            items=[
                EvidenceItem(
                    id="EVD-30",
                    type="MICROANEURYSM",
                    location="Juxtafoveal Zone",
                    severity="MILD",
                    source="LESION_SEGMENTATION",
                    confidence=0.62,
                    description="Suspected microaneurysm candidate detected with moderate segmentation confidence (0.62)."
                ),
                EvidenceItem(
                    id="EVD-31",
                    type="ATTENTION_REGION",
                    location="Temporal Retina",
                    severity="MILD",
                    source="MODEL_ATTENTION",
                    confidence=0.58,
                    description="Grad-CAM spatial heatmap shows diffuse model attention across temporal quadrant."
                ),
                EvidenceItem(
                    id="EVD-32",
                    type="IMAGE_QUALITY",
                    location="Peripheral Quadrants",
                    severity="MODERATE",
                    source="QUALITY_GATE",
                    confidence=0.85,
                    description="Quality Gate marked scan as BORDERLINE due to peripheral shadow gradient."
                )
            ],
            detectedLesions=[
                LesionCandidate(id="LES-30", type="microaneurysm", confidence=0.62, bbox=[310, 290, 20, 20], severity="MILD")
            ],
            opticDiscLocated=True,
            foveaLocated=True
        ),
        originalAiGrade=DRGrade(
            drGrade=1,
            drGradeLabel="Level 1 — Mild NPDR (Borderline Quality)",
            referable=False,
            icdrDescription="Subtle microaneurysms suspected, but borderline contrast prevents high-confidence grading."
        ),
        originalAiConfidence=Confidence(
            rawConfidence=0.68,
            calibratedConfidence=0.58,
            uncertaintyStatus="LOWER CONFIDENCE",
            uncertaintyEntropy=0.64,
            requiresHumanReview=True,
            decisionBannerState="HUMAN_REVIEW_RECOMMENDED",
            humanReviewReason="Calibrated confidence (0.58) is below 0.65 threshold & quality is BORDERLINE. Specialist review recommended.",
            qualityWarning="Borderline image quality — human review recommended."
        ),
        reviewStatus="REVIEW_REQUIRED",
        auditTrail=[
            AuditEvent(id="AUD-030", timestamp="2026-09-08T13:40:00Z", actorId="PHC-TECH-02", actorRole="operator", action="UPLOADED", details="Uploaded raw fundus image fundus_moderate.png"),
            AuditEvent(id="AUD-031", timestamp="2026-09-08T13:40:01Z", actorId="SYSTEM", actorRole="system", action="QUALITY_CHECKED", details="Quality Gate check completed (BORDERLINE quality)"),
            AuditEvent(id="AUD-032", timestamp="2026-09-08T13:40:02Z", actorId="SYSTEM", actorRole="system", action="AI_ANALYZED", details="PyTorch ConvNeXt graded Level 1 Mild NPDR (Calibrated Conf: 58%)"),
            AuditEvent(id="AUD-033", timestamp="2026-09-08T13:40:02Z", actorId="SYSTEM", actorRole="system", action="REVIEW_REQUESTED", details="High uncertainty entropy (0.64) — Routed to review queue")
        ],
        processingMetadata={
            "processingTimeMs": 1380,
            "modelVer": "DrishtiSetu-v1.0-PyTorch",
            "deviceUsed": "CPU",
            "timestamp": "2026-09-08T13:40:02Z"
        }
    ),

    # 5. DEMO 05 — Human Specialist Review & Override Case (OVERRIDDEN)
    Screening(
        screeningId="SCR-2026-005",
        createdAt="2026-09-08T14:15:00Z",
        operatorId="PHC-TECH-01",
        patientAlias="PAT-2026-9905",
        phcCenter="Primary Health Center - Rampur",
        district="Nanded",
        imageId="IMG-9905-RAW",
        imageUrl="/samples/fundus_moderate.png",
        imageQuality=ImageQuality(
            qualityStatus="GRADABLE",
            overallScore=0.86,
            focusScore=0.85,
            illuminationScore=0.87,
            fieldOfViewScore=0.88,
            artifactScore=0.84,
            reasonCodes=[],
            humanReadableExplanation=["Good sharpness and macular illumination."],
            recaptureInstructions=[],
            isPrototypeHeuristic=True
        ),
        drGrade=DRGrade(
            drGrade=3,
            drGradeLabel="Level 3 — Severe NPDR (Overridden by Specialist)",
            referable=True,
            icdrDescription="Overridden by retina specialist based on peripheral hemorrhages."
        ),
        confidence=Confidence(
            rawConfidence=0.74,
            calibratedConfidence=0.68,
            uncertaintyStatus="LOWER CONFIDENCE",
            uncertaintyEntropy=0.52,
            requiresHumanReview=True,
            decisionBannerState="HUMAN_REVIEW_RECOMMENDED",
            humanReviewReason="Overridden by specialist DR evaluation.",
            qualityWarning=None
        ),
        evidence=Evidence(
            rawImageUrl="/samples/fundus_moderate.png",
            enhancedImageUrl="/samples/fundus_moderate.png",
            vesselMapUrl="/samples/fundus_moderate.png",
            gradcamUrl="/samples/fundus_moderate.png",
            lesionOverlayUrl="/samples/fundus_moderate.png",
            combinedEvidenceUrl="/samples/fundus_moderate.png",
            items=[
                EvidenceItem(
                    id="EVD-50",
                    type="HEMORRHAGE",
                    location="Four Retinal Quadrants",
                    severity="SEVERE",
                    source="LESION_SEGMENTATION",
                    confidence=0.88,
                    description="Multiple intraretinal hemorrhages confirmed by retina specialist examination."
                )
            ],
            detectedLesions=[
                LesionCandidate(id="LES-50", type="hemorrhage", confidence=0.88, bbox=[180, 220, 30, 30], severity="SEVERE")
            ],
            opticDiscLocated=True,
            foveaLocated=True
        ),
        originalAiGrade=DRGrade(
            drGrade=1,
            drGradeLabel="Level 1 — Mild NPDR",
            referable=False,
            icdrDescription="Initial AI prediction detected microaneurysms only."
        ),
        originalAiConfidence=Confidence(
            rawConfidence=0.74,
            calibratedConfidence=0.68,
            uncertaintyStatus="LOWER CONFIDENCE",
            uncertaintyEntropy=0.52,
            requiresHumanReview=True,
            decisionBannerState="HUMAN_REVIEW_RECOMMENDED",
            humanReviewReason="Initial AI model prediction.",
            qualityWarning=None
        ),
        reviewStatus="OVERRIDDEN",
        reviewDecision={
            "reviewerId": "DR-S-RAO",
            "reviewerName": "Dr. S. Rao (Ophthalmologist)",
            "action": "OVERRIDDEN",
            "overrideGrade": 3,
            "comments": "Clinical override: Multiple intraretinal hemorrhages in all 4 quadrants visible on high-contrast vessel overlay.",
            "reviewedAt": "2026-09-08T14:30:00Z"
        },
        auditTrail=[
            AuditEvent(id="AUD-050", timestamp="2026-09-08T14:15:00Z", actorId="PHC-TECH-01", actorRole="operator", action="UPLOADED", details="Uploaded raw fundus image PAT-2026-9905"),
            AuditEvent(id="AUD-051", timestamp="2026-09-08T14:15:01Z", actorId="SYSTEM", actorRole="system", action="QUALITY_CHECKED", details="Quality Gate passed (GRADABLE, score 0.86)"),
            AuditEvent(id="AUD-052", timestamp="2026-09-08T14:15:02Z", actorId="SYSTEM", actorRole="system", action="AI_ANALYZED", details="Initial AI model graded Level 1 Mild NPDR (Calibrated Conf: 68%)"),
            AuditEvent(id="AUD-053", timestamp="2026-09-08T14:20:00Z", actorId="DR-S-RAO", actorRole="reviewer", action="REVIEW_STARTED", details="Claimed case for specialist evaluation"),
            AuditEvent(id="AUD-054", timestamp="2026-09-08T14:30:00Z", actorId="DR-S-RAO", actorRole="reviewer", action="OVERRIDDEN", details="Specialist overridden AI grade to Level 3 Severe NPDR. Reason: Multiple intraretinal hemorrhages in all 4 quadrants")
        ],
        processingMetadata={
            "processingTimeMs": 1390,
            "modelVer": "DrishtiSetu-v1.0-PyTorch",
            "deviceUsed": "CPU",
            "timestamp": "2026-09-08T14:15:02Z"
        }
    )
]

def get_all_screenings() -> List[Screening]:
    return SAMPLE_SCREENINGS

def get_screening_by_id(screening_id: str) -> Optional[Screening]:
    for s in SAMPLE_SCREENINGS:
        if s.screeningId == screening_id:
            return s
    return None
