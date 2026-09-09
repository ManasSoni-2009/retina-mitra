/**
 * RETINA-MITRA Prototype Case Engine
 *
 * Preconfigured clinical screening cases demonstrating the complete
 * retinal tele-ophthalmology workflow:
 * - RM-001: Normal Retina (No Apparent DR)
 * - RM-002: Mild DR (Microaneurysms Detected)
 * - RM-003: Moderate DR (Referable - Hemorrhages & Exudates)
 * - RM-004: Severe DR (Urgent Specialist Triage)
 * - RM-005: Poor Quality / Motion Blur (Quality Gate Rejection)
 */

import { Screening, EvidenceItem, AuditEvent } from '@/types/screening';

export interface DemoCaseConfig {
  demoNumber: string;
  code: string;
  screeningId: string;
  patientAlias: string;
  title: string;
  description: string;
  category: string;
  drGrade: 0 | 1 | 2 | 3 | 4;
  drGradeLabel: string;
  referable: boolean;
  qualityStatus: 'GRADABLE' | 'UNGRADABLE' | 'BORDERLINE';
  qualityScore: number;
  focusScore: number;
  illuminationScore: number;
  fovScore: number;
  contrastScore: number;
  qualityReasons: string[];
  recaptureInstructions: string[];
  confidenceRating: 'High' | 'Moderate' | 'Low';
  confidenceExplanation: string;
  confidenceValue: number;
  confidenceStatus: 'HIGHER CONFIDENCE' | 'LOWER CONFIDENCE' | 'UNCERTAIN';
  decisionBannerState: 'AUTO_SCREENED' | 'HUMAN_REVIEW_RECOMMENDED' | 'IMAGE_UNGRADABLE';
  requiresHumanReview: boolean;
  humanReviewReason: string;
  reviewStatus: 'REVIEW_COMPLETED' | 'REVIEW_REQUIRED' | 'OVERRIDDEN' | 'UNGRADABLE';
  reviewDecision?: {
    reviewerId: string;
    reviewerName: string;
    action: 'CONFIRMED' | 'OVERRIDDEN' | 'RE_REVIEW' | 'UNGRADABLE';
    overrideGrade?: number;
    comments: string;
    reviewedAt: string;
  };
  recommendation: string;
  evidence: EvidenceItem[];
  rawImageUrl: string;
  enhancedImageUrl: string;
  vesselMapUrl: string;
  gradcamUrl: string;
  lesionOverlayUrl: string;
  combinedEvidenceUrl: string;
  auditTrail: AuditEvent[];
}

export const DEMO_CASES: DemoCaseConfig[] = [
  // ---------------------------------------------------------------------------
  // RM-001: Normal Retina (No DR)
  // ---------------------------------------------------------------------------
  {
    demoNumber: 'RM-001',
    code: 'RM-001',
    screeningId: 'RM-001',
    patientAlias: 'PAT-8812',
    title: 'Normal Retinal Examination',
    description: 'Clear foveal avascular zone and normal vascular caliber without microaneurysms.',
    category: 'No DR',
    drGrade: 0,
    drGradeLabel: 'No DR',
    referable: false,
    qualityStatus: 'GRADABLE',
    qualityScore: 0.94,
    focusScore: 0.93,
    illuminationScore: 0.96,
    fovScore: 0.94,
    contrastScore: 0.92,
    qualityReasons: [],
    recaptureInstructions: [],
    confidenceRating: 'High',
    confidenceExplanation: 'Clear vascular margins and uniform macular clarity support this routine screening result.',
    confidenceValue: 0.95,
    confidenceStatus: 'HIGHER CONFIDENCE',
    decisionBannerState: 'AUTO_SCREENED',
    requiresHumanReview: false,
    humanReviewReason: 'Clear scan with zero microvascular lesions. Routine annual follow-up recommended.',
    reviewStatus: 'REVIEW_COMPLETED',
    reviewDecision: {
      reviewerId: 'DR-S-RAO',
      reviewerName: 'Dr. S. Rao (Consultant Ophthalmologist)',
      action: 'CONFIRMED',
      comments: 'Normal fundus examination confirmed. Routine annual follow-up.',
      reviewedAt: '2026-09-08T10:22:00Z',
    },
    recommendation: 'Routine annual retinal screening recommended in 12 months at primary health center.',
    rawImageUrl: '/prototype-cases/rm-001/original.jpg',
    enhancedImageUrl: '/prototype-cases/rm-001/enhanced.jpg',
    vesselMapUrl: '/prototype-cases/rm-001/vessels.png',
    gradcamUrl: '/prototype-cases/rm-001/gradcam.png',
    lesionOverlayUrl: '/prototype-cases/rm-001/evidence.png',
    combinedEvidenceUrl: '/prototype-cases/rm-001/combined.png',
    evidence: [
      {
        id: 'EVD-01',
        type: 'ATTENTION_REGION',
        location: 'Optic Disc & Foveal Axis',
        severity: 'NONE',
        source: 'MODEL_ATTENTION',
        confidence: 0.95,
        description: 'Spatial attention focused on normal foveal avascular zone and sharp optic disc margins.',
      },
      {
        id: 'EVD-02',
        type: 'VESSEL',
        location: 'Superior & Inferior Arcades',
        severity: 'NONE',
        source: 'VESSEL_SEGMENTATION',
        confidence: 0.96,
        description: 'Vessel extraction confirms physiological retinal arteriolar caliber with no neovascularization.',
      },
      {
        id: 'EVD-03',
        type: 'IMAGE_QUALITY',
        location: '45° Posterior Pole',
        severity: 'NONE',
        source: 'QUALITY_GATE',
        confidence: 0.94,
        description: 'High sharpness metric (Laplacian 842) and uniform illumination across all quadrants.',
      },
    ],
    auditTrail: [
      { id: 'AUD-001', timestamp: '2026-09-08T10:15:00Z', actorId: 'TECH-01', actorRole: 'operator', action: 'UPLOADED', details: 'Fundus scan uploaded for patient PAT-8812' },
      { id: 'AUD-002', timestamp: '2026-09-08T10:15:01Z', actorId: 'SYSTEM', actorRole: 'system', action: 'QUALITY_CHECKED', details: 'Quality Gate: GRADABLE (Sharpness 93%, Illumination 96%)' },
      { id: 'AUD-003', timestamp: '2026-09-08T10:15:02Z', actorId: 'SYSTEM', actorRole: 'system', action: 'AI_ANALYZED', details: 'Screening result: No DR (Confidence: High)' },
      { id: 'AUD-004', timestamp: '2026-09-08T10:22:00Z', actorId: 'DR-S-RAO', actorRole: 'reviewer', action: 'REVIEW_COMPLETED', details: 'Confirmed screening decision: No DR' },
    ],
  },

  // ---------------------------------------------------------------------------
  // RM-002: Mild DR
  // ---------------------------------------------------------------------------
  {
    demoNumber: 'RM-002',
    code: 'RM-002',
    screeningId: 'RM-002',
    patientAlias: 'PAT-7730',
    title: 'Mild Non-Proliferative Retinal Changes',
    description: 'Isolated microaneurysms detected in macular perimeter with clear foveal center.',
    category: 'Mild DR',
    drGrade: 1,
    drGradeLabel: 'Mild DR',
    referable: false,
    qualityStatus: 'GRADABLE',
    qualityScore: 0.91,
    focusScore: 0.90,
    illuminationScore: 0.92,
    fovScore: 0.92,
    contrastScore: 0.89,
    qualityReasons: [],
    recaptureInstructions: [],
    confidenceRating: 'High',
    confidenceExplanation: 'Discrete microaneurysms clearly resolved on enhanced vessel views with absence of diffuse exudates.',
    confidenceValue: 0.88,
    confidenceStatus: 'HIGHER CONFIDENCE',
    decisionBannerState: 'AUTO_SCREENED',
    requiresHumanReview: false,
    humanReviewReason: 'Mild microaneurysms detected without maculopathy. Scheduled for non-urgent routine follow-up.',
    reviewStatus: 'REVIEW_COMPLETED',
    recommendation: 'Repeat retinal screening in 6–12 months with glycemic optimization at primary health center.',
    rawImageUrl: '/prototype-cases/rm-002/original.jpg',
    enhancedImageUrl: '/prototype-cases/rm-002/enhanced.jpg',
    vesselMapUrl: '/prototype-cases/rm-002/vessels.png',
    gradcamUrl: '/prototype-cases/rm-002/gradcam.png',
    lesionOverlayUrl: '/prototype-cases/rm-002/evidence.png',
    combinedEvidenceUrl: '/prototype-cases/rm-002/combined.png',
    evidence: [
      {
        id: 'EVD-10',
        type: 'MICROANEURYSM',
        location: 'Juxtafoveal Temporal Zone',
        severity: 'MILD',
        source: 'LESION_SEGMENTATION',
        confidence: 0.88,
        description: 'Isolated focal microaneurysms localized 500μm temporal to the foveal border.',
      },
      {
        id: 'EVD-11',
        type: 'ATTENTION_REGION',
        location: 'Temporal Microaneurysm Bed',
        severity: 'MILD',
        source: 'MODEL_ATTENTION',
        confidence: 0.86,
        description: 'Spatial attention heatmap peaks directly over the candidate microaneurysm cluster.',
      },
      {
        id: 'EVD-12',
        type: 'VESSEL',
        location: 'Central Retinal Vessels',
        severity: 'NONE',
        source: 'VESSEL_SEGMENTATION',
        confidence: 0.93,
        description: 'Normal primary vessel branching without venous caliber changes.',
      },
    ],
    auditTrail: [
      { id: 'AUD-010', timestamp: '2026-09-08T11:00:00Z', actorId: 'TECH-01', actorRole: 'operator', action: 'UPLOADED', details: 'Fundus scan uploaded for patient PAT-7730' },
      { id: 'AUD-011', timestamp: '2026-09-08T11:00:01Z', actorId: 'SYSTEM', actorRole: 'system', action: 'QUALITY_CHECKED', details: 'Quality Gate passed: GRADABLE (Sharpness 90%)' },
      { id: 'AUD-012', timestamp: '2026-09-08T11:00:02Z', actorId: 'SYSTEM', actorRole: 'system', action: 'AI_ANALYZED', details: 'Screening result: Mild DR (Confidence: High)' },
    ],
  },

  // ---------------------------------------------------------------------------
  // RM-003: Moderate DR (Referable)
  // ---------------------------------------------------------------------------
  {
    demoNumber: 'RM-003',
    code: 'RM-003',
    screeningId: 'RM-003',
    patientAlias: 'PAT-4419',
    title: 'Moderate Retinal Findings (Specialist Evaluation Recommended)',
    description: 'Intraretinal blot hemorrhages and hard lipid exudates visible along the inferior temporal arcade.',
    category: 'Moderate DR',
    drGrade: 2,
    drGradeLabel: 'Moderate DR',
    referable: true,
    qualityStatus: 'GRADABLE',
    qualityScore: 0.89,
    focusScore: 0.88,
    illuminationScore: 0.90,
    fovScore: 0.91,
    contrastScore: 0.87,
    qualityReasons: [],
    recaptureInstructions: [],
    confidenceRating: 'High',
    confidenceExplanation: 'Several consistent visual features support this prototype screening result.',
    confidenceValue: 0.91,
    confidenceStatus: 'HIGHER CONFIDENCE',
    decisionBannerState: 'HUMAN_REVIEW_RECOMMENDED',
    requiresHumanReview: true,
    humanReviewReason: 'Potential retinal findings requiring clinical review were identified. Specialist evaluation recommended.',
    reviewStatus: 'REVIEW_REQUIRED',
    recommendation: 'Specialist evaluation recommended within 30 days for comprehensive dilated examination.',
    rawImageUrl: '/prototype-cases/rm-003/original.jpg',
    enhancedImageUrl: '/prototype-cases/rm-003/enhanced.jpg',
    vesselMapUrl: '/prototype-cases/rm-003/vessels.png',
    gradcamUrl: '/prototype-cases/rm-003/gradcam.png',
    lesionOverlayUrl: '/prototype-cases/rm-003/evidence.png',
    combinedEvidenceUrl: '/prototype-cases/rm-003/combined.png',
    evidence: [
      {
        id: 'EVD-20',
        type: 'HEMORRHAGE',
        location: 'Inferior Temporal Arcade',
        severity: 'MODERATE',
        source: 'LESION_SEGMENTATION',
        confidence: 0.91,
        description: 'Multiple intraretinal dot-and-blot hemorrhages segmented along the inferior arcade.',
      },
      {
        id: 'EVD-21',
        type: 'EXUDATE',
        location: 'Circinate Pattern Near Macula',
        severity: 'MODERATE',
        source: 'LESION_SEGMENTATION',
        confidence: 0.89,
        description: 'Hard lipid exudate rings located 1.5 disc diameters from the central fovea.',
      },
      {
        id: 'EVD-22',
        type: 'ATTENTION_REGION',
        location: 'Inferior Arcade Hemorrhage Cluster',
        severity: 'MODERATE',
        source: 'MODEL_ATTENTION',
        confidence: 0.92,
        description: 'Prominent attention concentration over vascular lesions and hard exudate boundaries.',
      },
    ],
    auditTrail: [
      { id: 'AUD-020', timestamp: '2026-09-08T11:30:00Z', actorId: 'TECH-01', actorRole: 'operator', action: 'UPLOADED', details: 'Fundus scan uploaded for patient PAT-4419' },
      { id: 'AUD-021', timestamp: '2026-09-08T11:30:01Z', actorId: 'SYSTEM', actorRole: 'system', action: 'QUALITY_CHECKED', details: 'Quality Gate passed: GRADABLE (Sharpness 88%)' },
      { id: 'AUD-022', timestamp: '2026-09-08T11:30:02Z', actorId: 'SYSTEM', actorRole: 'system', action: 'AI_ANALYZED', details: 'Screening result: Moderate DR (Specialist evaluation recommended)' },
      { id: 'AUD-023', timestamp: '2026-09-08T11:30:03Z', actorId: 'SYSTEM', actorRole: 'system', action: 'REVIEW_REQUESTED', details: 'Queued for specialist evaluation' },
    ],
  },

  // ---------------------------------------------------------------------------
  // RM-004: Severe DR (Urgent Triage)
  // ---------------------------------------------------------------------------
  {
    demoNumber: 'RM-004',
    code: 'RM-004',
    screeningId: 'RM-004',
    patientAlias: 'PAT-9905',
    title: 'Severe Retinal Findings (Immediate Specialist Triage)',
    description: 'Extensive multi-quadrant hemorrhages and microvascular abnormalities requiring prioritized clinical intervention.',
    category: 'Severe DR',
    drGrade: 3,
    drGradeLabel: 'Severe DR',
    referable: true,
    qualityStatus: 'GRADABLE',
    qualityScore: 0.88,
    focusScore: 0.86,
    illuminationScore: 0.89,
    fovScore: 0.90,
    contrastScore: 0.85,
    qualityReasons: [],
    recaptureInstructions: [],
    confidenceRating: 'High',
    confidenceExplanation: 'Widespread multi-quadrant retinal hemorrhages and vascular abnormalities clearly demonstrated across all views.',
    confidenceValue: 0.94,
    confidenceStatus: 'HIGHER CONFIDENCE',
    decisionBannerState: 'HUMAN_REVIEW_RECOMMENDED',
    requiresHumanReview: true,
    humanReviewReason: 'Severe retinal findings detected across multiple quadrants. Immediate specialist evaluation recommended.',
    reviewStatus: 'REVIEW_REQUIRED',
    recommendation: 'Immediate specialist evaluation recommended within 2 weeks at District Eye Care Center.',
    rawImageUrl: '/prototype-cases/rm-004/original.jpg',
    enhancedImageUrl: '/prototype-cases/rm-004/enhanced.jpg',
    vesselMapUrl: '/prototype-cases/rm-004/vessels.png',
    gradcamUrl: '/prototype-cases/rm-004/gradcam.png',
    lesionOverlayUrl: '/prototype-cases/rm-004/evidence.png',
    combinedEvidenceUrl: '/prototype-cases/rm-004/combined.png',
    evidence: [
      {
        id: 'EVD-30',
        type: 'HEMORRHAGE',
        location: 'All 4 Retinal Quadrants',
        severity: 'SEVERE',
        source: 'LESION_SEGMENTATION',
        confidence: 0.95,
        description: 'Extensive intraretinal blot hemorrhages fulfilling the 4-quadrant criteria.',
      },
      {
        id: 'EVD-31',
        type: 'VESSEL',
        location: 'Superior Temporal Arcade',
        severity: 'SEVERE',
        source: 'VESSEL_SEGMENTATION',
        confidence: 0.90,
        description: 'Venous caliber irregularity and intraretinal microvascular abnormalities (IRMA).',
      },
      {
        id: 'EVD-32',
        type: 'ATTENTION_REGION',
        location: 'Multi-quadrant Lesion Beds',
        severity: 'SEVERE',
        source: 'MODEL_ATTENTION',
        confidence: 0.94,
        description: 'High-intensity multi-focal spatial attention across temporal and nasal arcades.',
      },
    ],
    auditTrail: [
      { id: 'AUD-030', timestamp: '2026-09-08T12:00:00Z', actorId: 'TECH-01', actorRole: 'operator', action: 'UPLOADED', details: 'Fundus scan uploaded for patient PAT-9905' },
      { id: 'AUD-031', timestamp: '2026-09-08T12:00:01Z', actorId: 'SYSTEM', actorRole: 'system', action: 'QUALITY_CHECKED', details: 'Quality Gate passed: GRADABLE (Sharpness 86%)' },
      { id: 'AUD-032', timestamp: '2026-09-08T12:00:02Z', actorId: 'SYSTEM', actorRole: 'system', action: 'AI_ANALYZED', details: 'Screening result: Severe DR (Immediate specialist triage recommended)' },
    ],
  },

  // ---------------------------------------------------------------------------
  // RM-005: Poor Quality (Ungradable Rejection)
  // ---------------------------------------------------------------------------
  {
    demoNumber: 'RM-005',
    code: 'RM-005',
    screeningId: 'RM-005',
    patientAlias: 'PAT-1104',
    title: 'Image Quality Assessment: Ungradable',
    description: 'Motion blur and illumination falloff preventing reliable clinical feature extraction.',
    category: 'Ungradable',
    drGrade: 0,
    drGradeLabel: 'Image Ungradable',
    referable: false,
    qualityStatus: 'UNGRADABLE',
    qualityScore: 0.28,
    focusScore: 0.22,
    illuminationScore: 0.35,
    fovScore: 0.38,
    contrastScore: 0.25,
    qualityReasons: [
      'Focus sharpness score is below clinical diagnostic threshold due to camera motion blur.',
      'Illumination glare artifact obscuring central macular field.',
      'Field coverage incomplete: temporal arcade margins clipped.',
    ],
    recaptureInstructions: [
      'Stabilize fundus camera mount and guide patient to maintain gaze on fixation target.',
      'Re-adjust illumination ring to prevent corneal glare.',
      'Re-center optic disc and macula to achieve standard 45° field of view.',
    ],
    confidenceRating: 'Low',
    confidenceExplanation: 'Diagnostic focus and illumination thresholds not met. Image quality gate intercepted before classification to prevent false reassurance.',
    confidenceValue: 0.25,
    confidenceStatus: 'UNCERTAIN',
    decisionBannerState: 'IMAGE_UNGRADABLE',
    requiresHumanReview: false,
    humanReviewReason: 'Quality Gate intercept: Image is ungradable. DR interpretation blocked to maintain clinical safety.',
    reviewStatus: 'UNGRADABLE',
    recommendation: 'Recapture recommended: Image quality is insufficient for screening. Retake fundus photograph following recapture guidance.',
    rawImageUrl: '/prototype-cases/rm-005/original.jpg',
    enhancedImageUrl: '/prototype-cases/rm-005/enhanced.jpg',
    vesselMapUrl: '/prototype-cases/rm-005/vessels.png',
    gradcamUrl: '/prototype-cases/rm-005/gradcam.png',
    lesionOverlayUrl: '/prototype-cases/rm-005/evidence.png',
    combinedEvidenceUrl: '/prototype-cases/rm-005/combined.png',
    evidence: [
      {
        id: 'EVD-40',
        type: 'IMAGE_QUALITY',
        location: 'Central Retinal Field',
        severity: 'SEVERE',
        source: 'QUALITY_GATE',
        confidence: 0.98,
        description: 'Focus variance = 48.2 (Threshold > 120.0). Image fails diagnostic sharpness requirements.',
      },
      {
        id: 'EVD-41',
        type: 'IMAGE_QUALITY',
        location: 'Macular Vicinity',
        severity: 'SEVERE',
        source: 'QUALITY_GATE',
        confidence: 0.95,
        description: 'Illumination falloff and anterior glare obscuring foveal fine detail.',
      },
    ],
    auditTrail: [
      { id: 'AUD-040', timestamp: '2026-09-08T12:30:00Z', actorId: 'TECH-01', actorRole: 'operator', action: 'UPLOADED', details: 'Fundus scan uploaded for patient PAT-1104' },
      { id: 'AUD-041', timestamp: '2026-09-08T12:30:01Z', actorId: 'SYSTEM', actorRole: 'system', action: 'QUALITY_CHECKED', details: 'Quality Gate HALTED pipeline: UNGRADABLE (Score 0.28). AI classification aborted.' },
    ],
  },
];

// Helper to convert DemoCaseConfig to standard Screening
export function demoCaseToScreening(c: DemoCaseConfig): Screening {
  return {
    screeningId: c.screeningId,
    createdAt: c.auditTrail[0]?.timestamp || new Date().toISOString(),
    operatorId: 'TECH-01',
    patientAlias: c.patientAlias,
    phcCenter: 'Primary Health Center — Nanded Division',
    district: 'Nanded',
    imageId: `IMG-${c.screeningId}`,
    imageUrl: c.rawImageUrl,
    imageQuality: {
      qualityStatus: c.qualityStatus,
      overallScore: c.qualityScore,
      score: c.qualityScore,
      focusScore: c.focusScore,
      illuminationScore: c.illuminationScore,
      contrastRatio: c.contrastScore,
      fieldCoverageScore: c.fovScore,
      reasons: c.qualityReasons.length > 0 ? c.qualityReasons : undefined,
      humanReadableExplanation: c.qualityReasons.length > 0 ? c.qualityReasons : ['Image quality meets diagnostic screening standards.'],
      guidanceTips: c.recaptureInstructions,
    },
    qualityStatus: c.qualityStatus,
    drGrade: {
      drGrade: c.drGrade,
      drGradeLabel: c.drGradeLabel,
      referable: c.referable,
      icdrDescription: c.description,
    },
    drGradeLabel: c.drGradeLabel,
    referable: c.referable,
    confidence: {
      rawConfidence: c.confidenceValue,
      calibratedConfidence: c.confidenceValue,
      uncertaintyStatus: c.confidenceStatus,
      uncertaintyEntropy: c.confidenceRating === 'High' ? 0.08 : c.confidenceRating === 'Moderate' ? 0.35 : 0.72,
      requiresHumanReview: c.requiresHumanReview,
      decisionBannerState: c.decisionBannerState,
      humanReviewReason: c.humanReviewReason,
      disclaimer: 'RETINA-MITRA is an AI-assisted retinal screening and decision-support prototype. This result is intended for demonstration and research purposes and is not a medical diagnosis.',
    },
    requiresHumanReview: c.requiresHumanReview,
    reviewStatus: c.reviewStatus,
    reviewDecision: c.reviewDecision,
    evidence: {
      rawImageUrl: c.rawImageUrl,
      enhancedImageUrl: c.enhancedImageUrl,
      vesselMapUrl: c.vesselMapUrl,
      gradcamUrl: c.gradcamUrl,
      lesionOverlayUrl: c.lesionOverlayUrl,
      combinedEvidenceUrl: c.combinedEvidenceUrl,
      items: c.evidence,
      opticDiscLocated: c.qualityStatus !== 'UNGRADABLE',
      foveaLocated: c.qualityStatus !== 'UNGRADABLE',
    },
    auditTrail: c.auditTrail,
    processingMetadata: {
      processingTimeMs: 1240,
      modelVer: 'RETINA-MITRA-v2.4',
      engineUsed: 'EfficientNet-B0 + Multi-task Explainability',
      timestamp: c.auditTrail[0]?.timestamp || new Date().toISOString(),
    },
  };
}

export function getDemoCase(idOrCode: string): DemoCaseConfig | undefined {
  const norm = idOrCode.trim().toUpperCase().replace(/\s+/g, '-');
  return DEMO_CASES.find(
    (c) =>
      c.screeningId.toUpperCase() === norm ||
      c.code.toUpperCase() === norm ||
      c.demoNumber.toUpperCase().replace(/\s+/g, '-') === norm ||
      (norm.includes('1') && c.screeningId.endsWith('001')) ||
      (norm.includes('2') && c.screeningId.endsWith('002')) ||
      (norm.includes('3') && c.screeningId.endsWith('003')) ||
      (norm.includes('4') && c.screeningId.endsWith('004')) ||
      (norm.includes('5') && c.screeningId.endsWith('005')) ||
      (norm.includes('SCR-2026-001') && c.screeningId === 'RM-001') ||
      (norm.includes('SCR-2026-002') && c.screeningId === 'RM-002') ||
      (norm.includes('SCR-2026-003') && c.screeningId === 'RM-003') ||
      (norm.includes('SCR-2026-004') && c.screeningId === 'RM-004') ||
      (norm.includes('SCR-2026-005') && c.screeningId === 'RM-005')
  );
}
