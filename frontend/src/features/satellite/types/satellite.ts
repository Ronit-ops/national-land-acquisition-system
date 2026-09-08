export type SatelliteSource =
  | "SENTINEL_2"
  | "LANDSAT_8"
  | "LANDSAT_9"
  | "DEMO";

export type SatelliteObservationStatus =
  | "AVAILABLE"
  | "PROCESSING"
  | "FAILED";

export type ChangeDetectionType =
  | "LAND_USE_CHANGE"
  | "BOUNDARY_CHANGE"
  | "CONSTRUCTION"
  | "VEGETATION_CHANGE"
  | "WATER_CHANGE"
  | "SURFACE_CHANGE";

export type ChangeSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type ChangeDetectionStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "FIELD_VERIFICATION_REQUIRED"
  | "VERIFIED"
  | "DISMISSED";

export type VerificationStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "IN_PROGRESS"
  | "VERIFIED"
  | "DISMISSED";

export type SatelliteObservation = {
  id: string;

  source: SatelliteSource;

  acquisitionDate: string;

  processingDate: string;

  cloudCoveragePercentage: number;

  resolutionMeters: number;

  tileReference: string;

  status: SatelliteObservationStatus;

  projectId?: string;

  projectName?: string;

  district?: string;

  parcelId?: string;

  thumbnailLabel: string;
};

export type SatelliteComparison = {
  id: string;

  beforeObservationId: string;

  afterObservationId: string;

  beforeDate: string;

  afterDate: string;

  areaAnalyzedHectares: number;

  changePercentage: number;

  processingStatus: "COMPLETED" | "PROCESSING" | "FAILED";
};

export type AIChangeAlert = {
  id: string;

  title: string;

  description: string;

  changeType: ChangeDetectionType;

  severity: ChangeSeverity;

  confidencePercentage: number;

  status: ChangeDetectionStatus;

  verificationStatus: VerificationStatus;

  detectedDate: string;

  projectId?: string;

  projectName?: string;

  district?: string;

  parcelId?: string;

  beforeObservationId?: string;

  afterObservationId?: string;

  changedAreaHectares?: number;

  explanation: string[];

  recommendedAction: string;

  route: string;
};

export type SatelliteProjectSummary = {
  projectId: string;

  projectName: string;

  district: string;

  observationsAvailable: number;

  activeAlerts: number;

  highPriorityAlerts: number;

  lastObservationDate: string;

  monitoringStatus:
    | "MONITORED"
    | "ATTENTION"
    | "NO_RECENT_DATA";
};

export type SatelliteDataset = {
  generatedAt: string;

  dataMode: "DEMO";

  observations: SatelliteObservation[];

  comparisons: SatelliteComparison[];

  alerts: AIChangeAlert[];

  projectSummaries: SatelliteProjectSummary[];
};