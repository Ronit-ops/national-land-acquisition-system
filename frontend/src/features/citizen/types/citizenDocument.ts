export type CitizenDocumentType =
  | "NOTICE"
  | "DECLARATION"
  | "HEARING_NOTICE"
  | "AWARD"
  | "COMPENSATION_RECORD"
  | "RR_RECORD"
  | "POSSESSION_NOTICE";

export type CitizenDocumentStatus =
  | "AVAILABLE"
  | "PROCESSING"
  | "NOT_AVAILABLE";

export type CitizenDocument = {
  id: string;
  caseReference: string;
  type: CitizenDocumentType;
  title: string;
  referenceNumber: string;
  issueDate: string | null;
  status: CitizenDocumentStatus;
  description: string;
  citizenVisible: boolean;
  fileReference: string | null;
};