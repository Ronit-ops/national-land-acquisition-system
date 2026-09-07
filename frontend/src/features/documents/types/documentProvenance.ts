export type ProvenanceSourceType =
  | "REVENUE_RECORD"
  | "ACQUISITION_DEPARTMENT"
  | "PROJECT_AUTHORITY"
  | "COURT_RECORD"
  | "FIELD_VERIFICATION"
  | "SYSTEM_GENERATED"
  | "CITIZEN_SUBMISSION"
  | "OTHER";

export type ProvenanceRecordStatus =
  | "SOURCE_RECORD"
  | "RECORDED"
  | "VERIFIED"
  | "DISPUTED"
  | "FIELD_VERIFIED"
  | "OFFICER_DECISION";

export type ProvenanceLinkType =
  | "CASE"
  | "PARCEL"
  | "RECORDED_RIGHT_HOLDER"
  | "SOURCE_RECORD"
  | "PREVIOUS_VERSION"
  | "RELATED_DOCUMENT"
  | "FIELD_VERIFICATION";

export type DocumentProvenance = {
  documentId: string;

  sourceType: ProvenanceSourceType;
  sourceReference: string | null;

  recordStatus: ProvenanceRecordStatus;

  acquisitionCaseId: string | null;
  parcelId: string | null;
  surveyNumber: string | null;
  recordedRightHolder: string | null;

  sourceRecordedAt: string | null;
  receivedAt: string | null;

  verifiedAt: string | null;
  verifiedBy: string | null;

  disputedAt: string | null;
  disputeReference: string | null;

  fieldVerifiedAt: string | null;
  fieldVerifiedBy: string | null;
  fieldVerificationReference: string | null;

  officerDecisionAt: string | null;
  officerDecisionBy: string | null;
  officerDecisionReference: string | null;

  notes: string | null;
};

export type DocumentProvenanceLink = {
  id: string;
  documentId: string;
  linkType: ProvenanceLinkType;
  targetId: string;
  targetReference: string | null;
  label: string;
};