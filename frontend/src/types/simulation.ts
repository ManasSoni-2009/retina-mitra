export interface SimulationInputParams {
  annualPatientVolume: number;
  patientsPerDay: number;
  arrivalRatePerHour: number;
  imageAcquisitionTimeMin: number;
  imageUploadTimeSec: number;
  networkBandwidthMbps: number;
  imageSizeMb: number;
  qualityFailurePct: number;
  aiProcessingTimeSec: number;
  aiThroughputPerMin: number;
  humanReviewPct: number;
  reviewTimeMin: number;
  numberOfReviewers: number;
  workingHoursPerDay: number;
  workingDaysPerYear: number;
  scenarioName?: string;
}

export interface ThroughputPoint {
  day: number;
  screenedAtPhc: number;
  transferredToCloud: number;
  aiProcessed: number;
  escalatedToHuman: number;
  finalCompleted: number;
}

export interface SimulationResult {
  simulationId: string;
  executedAt: string;
  scenarioName: string;
  params: SimulationInputParams;
  engineLabel: string;
  isSimulinkDirectModel: boolean;
  illustrativeNotice: string;
  throughputDaily: number;
  throughputAnnual: number;
  estimatedAnnualCapacity: number;
  averageQueueLength: number;
  maxQueueLength: number;
  averageProcessingDelayHours: number;
  reviewerUtilizationPct: number;
  aiUtilizationPct: number;
  humanReviewPct: number;
  transmissionBacklogMb: number;
  estimatedCompletionTimeDays: number;
  bottleneckAlerts: string[];
  timeline: ThroughputPoint[];
}
