export type NotificationType =
  | "PRELIMINARY_NOTIFICATION"
  | "DECLARATION"
  | "AWARD_NOTICE"
  | "POSSESSION_NOTICE";

export type NotificationStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "SERVED"
  | "ACKNOWLEDGED";

export type ObjectionStatus =
  | "NOT_RECEIVED"
  | "RECEIVED"
  | "UNDER_SCRUTINY"
  | "HEARING_SCHEDULED"
  | "HEARD"
  | "DISPOSED"
  | "PENDING_ACTION";

export type HearingStatus =
  | "NOT_SCHEDULED"
  | "SCHEDULED"
  | "COMPLETED"
  | "ADJOURNED"
  | "CANCELLED";

export type HearingOutcome =
  | "PENDING"
  | "ACCEPTED"
  | "PARTIALLY_ACCEPTED"
  | "NOT_ACCEPTED"
  | "REQUIRES_FURTHER_REVIEW"
  | null;

export type ProceedingsPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ProceedingsRecord = {
  id: string;

  acquisitionCaseId: string;
  parcelId: string;
  surveyNumber: string;

  recordedRightHolder: string;

  district: string;
  village: string;

  notification: {
    id: string;
    type: NotificationType;
    title: string;
    publicationDate: string | null;
    effectiveDate: string | null;
    serviceDate: string | null;
    status: NotificationStatus;
    documentReference: string | null;
  };

  objection: {
    id: string | null;
    objectorName: string | null;
    submissionDate: string | null;
    category: string | null;
    description: string | null;
    status: ObjectionStatus;
    supportingDocumentCount: number;
  };

  hearing: {
    id: string | null;
    hearingDate: string | null;
    venue: string | null;
    mode: "IN_PERSON" | "VIRTUAL" | "HYBRID" | null;
    assignedOfficer: string | null;
    status: HearingStatus;
    attendanceRecorded: boolean;
    proceedingsRemarks: string | null;
    outcome: HearingOutcome;
  };

  priority: ProceedingsPriority;

  officerRemarks: string;

  nextAction: string;

  nextActionDueDate: string | null;

  legalDecisionRecorded: boolean;

  createdAt: string;
  updatedAt: string;
};
