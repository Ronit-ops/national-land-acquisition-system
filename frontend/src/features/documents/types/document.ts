export type DocumentType =
  | "LAND_RECORD"
  | "OWNERSHIP_RECORD"
  | "RIGHT_HOLDER_RECORD"
  | "PRELIMINARY_NOTIFICATION"
  | "HEARING_NOTICE"
  | "HEARING_RECORD"
  | "DECLARATION"
  | "VALUATION_REPORT"
  | "AWARD"
  | "COMPENSATION_RECORD"
  | "R_AND_R_RECORD"
  | "POSSESSION_NOTICE"
  | "POSSESSION_RECORD"
  | "FIELD_EVIDENCE"
  | "OTHER";

export type DocumentStatus =
  | "AVAILABLE"
  | "PROCESSING"
  | "UNDER_VERIFICATION"
  | "VERIFIED"
  | "DISPUTED"
  | "NOT_AVAILABLE"
  | "WITHHELD";

export type DocumentSource =
  | "REVENUE_RECORD"
  | "ACQUISITION_DEPARTMENT"
  | "PROJECT_AUTHORITY"
  | "COURT_RECORD"
  | "FIELD_VERIFICATION"
  | "SYSTEM_GENERATED"
  | "CITIZEN_SUBMISSION"
  | "OTHER";

export type DocumentVerificationStatus =
  | "NOT_VERIFIED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "DISPUTED";

export type DocumentSensitivity =
  | "PUBLIC"
  | "OFFICER_ONLY"
  | "RESTRICTED"
  | "HIGHLY_RESTRICTED";

export type DocumentVersionStatus =
  | "CURRENT"
  | "SUPERSEDED"
  | "ARCHIVED";

export type DocumentRecord = {
  id: string;

  documentNumber: string;
  title: string;
  type: DocumentType;

  acquisitionCaseId: string | null;
  parcelId: string | null;
  surveyNumber: string | null;

  recordedRightHolder: string | null;

  district: string;
  village: string;

  source: DocumentSource;
  sourceReference: string | null;

  status: DocumentStatus;
  verificationStatus: DocumentVerificationStatus;

  sensitivity: DocumentSensitivity;

  versionNumber: number;
  versionStatus: DocumentVersionStatus;
  previousVersionId: string | null;

  issueDate: string | null;
  receivedDate: string | null;

  uploadedBy: string | null;
  uploadedAt: string | null;

  fileName: string | null;
  fileReference: string | null;
  fileSizeBytes: number | null;
  mimeType: string | null;

  citizenVisible: boolean;

  description: string;

  createdAt: string;
  updatedAt: string;
};