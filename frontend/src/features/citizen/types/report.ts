export type ReportScopeType =
  | "STATE"
  | "DISTRICT"
  | "PROJECT";

export type ReportPeriod =
  | "CURRENT"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "YEAR_TO_DATE";

export type ReportStatus =
  | "ON_TRACK"
  | "ATTENTION_REQUIRED"
  | "DELAYED"
  | "CRITICAL";

export type AcquisitionStage =
  | "PROJECT_REGISTERED"
  | "LAND_IDENTIFICATION"
  | "PRELIMINARY_NOTIFICATION"
  | "OBJECTION"
  | "HEARING"
  | "DECLARATION"
  | "VALUATION"
  | "AWARD"
  | "COMPENSATION"
  | "R_AND_R"
  | "POSSESSION"
  | "CLOSED";

export type ReportScope = {
  type: ReportScopeType;
  state: string;
  district: string | null;
  projectId: string | null;
  projectName: string | null;
};

export type ReportFilter = {
  scope: ReportScope;
  period: ReportPeriod;
  status: ReportStatus | "ALL";
  acquisitionStage: AcquisitionStage | "ALL";
};

export type ReportMetric = {
  id: string;
  label: string;
  value: number;
  unit: "COUNT" | "HECTARES" | "CURRENCY";
  status: ReportStatus;
  changePercentage: number | null;
  comparisonLabel: string | null;
  description: string;
};

export type AcquisitionStageMetric = {
  stage: AcquisitionStage;
  label: string;
  caseCount: number;
  percentageOfCases: number;
  averageDaysInStage: number | null;
  delayedCases: number;
  status: ReportStatus;
};

export type CompensationMetric = {
  totalAwarded: number;
  totalPaid: number;
  totalPending: number;
  casesWithPendingPayment: number;
  paymentCompletionPercentage: number;
};

export type RAndRMetric = {
  totalCases: number;
  completedCases: number;
  pendingCases: number;
  assistanceAmount: number;
  relocationPending: number;
  rehabilitationPending: number;
};

export type PossessionMetric = {
  totalCases: number;
  possessionCompleted: number;
  possessionPending: number;
  possessionScheduled: number;
  overdueCases: number;
};

export type FieldVerificationMetric = {
  totalAssignments: number;
  pendingAssignments: number;
  completedAssignments: number;
  escalatedAssignments: number;
  averageCompletionDays: number | null;
};

export type BottleneckItem = {
  id: string;
  caseReference: string;
  projectName: string;
  district: string;
  stage: AcquisitionStage;
  stageLabel: string;
  daysInStage: number;
  expectedDays: number;
  delayDays: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
  lastUpdated: string;
};

export type ProjectReportSummary = {
  projectId: string;
  projectName: string;
  department: string;
  district: string;

  totalLandRequiredHectares: number;
  acquiredLandHectares: number;
  pendingLandHectares: number;

  totalParcels: number;
  totalAcquisitionCases: number;

  activeCases: number;
  completedCases: number;
  delayedCases: number;

  currentStageDistribution: AcquisitionStageMetric[];

  compensation: CompensationMetric;
  rAndR: RAndRMetric;
  possession: PossessionMetric;
  fieldVerification: FieldVerificationMetric;

  bottlenecks: BottleneckItem[];

  overallStatus: ReportStatus;
  generatedAt: string;
};

export type DistrictReportSummary = {
  district: string;

  totalProjects: number;
  totalParcels: number;
  totalAcquisitionCases: number;

  totalLandRequiredHectares: number;
  acquiredLandHectares: number;
  pendingLandHectares: number;

  activeCases: number;
  completedCases: number;
  delayedCases: number;

  compensationPending: number;
  rAndRPending: number;
  possessionPending: number;
  fieldVerificationPending: number;

  overallStatus: ReportStatus;
};

export type DecisionSupportIndicator = {
  id: string;
  title: string;
  category:
    | "DELAY"
    | "COMPENSATION"
    | "R_AND_R"
    | "POSSESSION"
    | "FIELD_VERIFICATION"
    | "WORKLOAD"
    | "DATA_QUALITY";

  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";

  value: number;
  unit: "COUNT" | "DAYS" | "CURRENCY" | "PERCENTAGE";

  description: string;

  recommendedAction: string;

  sourceReferences: string[];

  requiresHumanReview: boolean;
};

export type ReportSnapshot = {
  id: string;
  generatedAt: string;
  generatedBy: string;
  scope: ReportScope;
  period: ReportPeriod;

  metrics: ReportMetric[];

  projectSummaries: ProjectReportSummary[];

  districtSummaries: DistrictReportSummary[];

  decisionSupportIndicators: DecisionSupportIndicator[];
};