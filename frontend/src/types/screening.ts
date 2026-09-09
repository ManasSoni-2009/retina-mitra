export interface ImageQualityDetail {
  qualityStatus: 'GRADABLE' | 'BORDERLINE' | 'UNGRADABLE';
  overallScore?: number;
  score?: number; // 0 to 1
  focusScore?: number;
  illuminationScore?: number;
  contrastRatio?: number;
  fieldCoverageScore?: number;
  illumination?: number;
  contrast?: number;
  sharpness?: number;
  fovCoverage?: number;
  reasons?: string[];
  recaptureGuidance?: string;
  guidanceTips?: string[];
  humanReadableExplanation?: string[];
}

export interface DRGradeDetail {
  drGrade: 0 | 1 | 2 | 3 | 4;
  drGradeLabel: string;
  referable: boolean;
  icdrDescription?: string;
}

export type EvidenceType = 'MICROANEURYSM' | 'HEMORRHAGE' | 'EXUDATE' | 'VESSEL' | 'ATTENTION_REGION' | 'IMAGE_QUALITY';
export type EvidenceSource = 'MODEL_ATTENTION' | 'LESION_SEGMENTATION' | 'VESSEL_SEGMENTATION' | 'QUALITY_GATE';

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  location: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'NONE';
  source: EvidenceSource;
  confidence: number;
  description: string;
}

export interface LesionCandidate {
  id: string;
  type: 'microaneurysm' | 'hemorrhage' | 'hard_exudate' | 'cotton_wool_spot';
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, w, h]
  severity: string;
}

export interface VisualEvidence {
  rawImageUrl: string;
  enhancedImageUrl?: string;
  vesselMapUrl?: string;
  gradcamUrl?: string;
  lesionOverlayUrl?: string;
  combinedEvidenceUrl?: string;
  items?: EvidenceItem[];
  detectedLesions?: LesionCandidate[];
  opticDiscLocated?: boolean;
  foveaLocated?: boolean;
}

export interface ConfidenceDetail {
  rawConfidence: number;
  calibratedConfidence: number;
  uncertaintyStatus: 'HIGHER CONFIDENCE' | 'LOWER CONFIDENCE' | 'UNCERTAIN';
  uncertaintyEntropy: number;
  requiresHumanReview: boolean;
  decisionBannerState?: 'AUTO_SCREENED' | 'HUMAN_REVIEW_RECOMMENDED' | 'IMAGE_UNGRADABLE';
  humanReviewReason?: string;
  qualityWarning?: string;
  disclaimer?: string;
}

export interface ReviewDecision {
  reviewerId: string;
  action: 'PENDING' | 'CONFIRMED' | 'OVERRIDDEN' | 'RE_REVIEW' | 'UNGRADABLE';
  overrideGrade?: number;
  comments: string;
  reviewedAt: string;
}

export interface ProcessingMetadata {
  processingTimeMs: number;
  modelVer: string;
  deviceUsed?: string;
  engineUsed?: string;
  timestamp: string;
}

export interface ReportData {
  screeningId: string;
  createdAt: string;
  patientAlias: string;
  operatorId: string;
  phcCenter: string;
  district: string;
  qualityStatus: string;
  qualityFindings: string[];
  drGradeLabel: string;
  referable: boolean;
  rawConfidence: number;
  calibratedConfidence: number;
  uncertaintyStatus: string;
  evidenceItems: EvidenceItem[];
  humanReviewRecommendation: string;
  humanReviewReason: string;
  reviewStatus: string;
  reviewerDecision?: ReviewDecision | null;
  modelVer: string;
  disclaimer: string;
  isDemoResult?: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: 'operator' | 'reviewer' | 'admin' | 'system';
  action: 'UPLOADED' | 'QUALITY_CHECKED' | 'AI_ANALYZED' | 'REVIEW_REQUESTED' | 'REVIEW_STARTED' | 'REVIEW_COMPLETED' | 'OVERRIDDEN' | 'MARKED_UNGRADABLE';
  details: string;
}

export interface Screening {
  screeningId: string;
  createdAt: string;
  operatorId: string;
  patientAlias: string;
  phcCenter: string;
  district: string;
  imageId?: string;
  imageUrl?: string;
  imageQuality: ImageQualityDetail;
  qualityStatus: 'GRADABLE' | 'UNGRADABLE' | 'BORDERLINE';
  drGrade: DRGradeDetail | 0 | 1 | 2 | 3 | 4;
  drGradeLabel?: string;
  referable?: boolean;
  confidence: number | ConfidenceDetail;
  uncertainty?: number;
  requiresHumanReview?: boolean;
  originalAiGrade?: DRGradeDetail | null;
  originalAiConfidence?: number | ConfidenceDetail | null;
  reviewStatus: 'AI_COMPLETED' | 'REVIEW_REQUIRED' | 'IN_REVIEW' | 'REVIEW_COMPLETED' | 'REFERRED' | 'UNGRADABLE' | 'PENDING' | 'CONFIRMED' | 'OVERRIDDEN';
  reviewDecision?: ReviewDecision | null;
  auditTrail?: AuditEvent[];
  evidence: VisualEvidence;
  processingMetadata: ProcessingMetadata;
}
