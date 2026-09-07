export type FieldVerificationStatus =
  | "PENDING"
  | "ASSIGNED"
  | "VISIT_SCHEDULED"
  | "IN_FIELD"
  | "EVIDENCE_SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "NOT_CONFIRMED"
  | "REQUIRES_FURTHER_REVIEW";

export type VerificationOutcome =
  | "VERIFIED"
  | "NOT_CONFIRMED"
  | "REQUIRES_FURTHER_REVIEW"
  | null;

export type EvidenceType =
  | "SITE_PHOTO"
  | "GPS_CAPTURE"
  | "DOCUMENT"
  | "OFFICER_NOTE";

export type FieldEvidence = {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  capturedAt: string;
  capturedBy: string;
  available: boolean;
};

export type FieldFinding = {
  observedChange: string;
  siteCondition: string;
  boundaryObservation: string;
  officerRemarks: string;
};

export type FieldVerificationRecord = {
  id: string;
  aiAlertId: string;
  parcelId: string;
  surveyNumber: string;
  acquisitionCaseId: string;
  district: string;
  village: string;
  recordedRightHolder: string;
  changeType: string;
  aiConfidence: number;
  aiSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignedOfficer: string;
  visitDate: string | null;
  verificationStatus: FieldVerificationStatus;
  gpsCaptured: boolean;
  gpsLatitude: number | null;
  gpsLongitude: number | null;
  photoCount: number;
  documentCount: number;
  findings: FieldFinding;
  outcome: VerificationOutcome;
  reviewRemarks: string;
  evidence: FieldEvidence[];
  createdAt: string;
  updatedAt: string;
};
