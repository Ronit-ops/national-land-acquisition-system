export type AIAlertReviewDecision =
  | "PENDING"
  | "CONFIRMED_CHANGE"
  | "NO_CHANGE_CONFIRMED"
  | "INCONCLUSIVE"
  | "DISMISSED";

export type AIAlertReviewAction =
  | "REVIEW_COMPARISON"
  | "REQUEST_FIELD_VERIFICATION"
  | "OPEN_PARCEL"
  | "OPEN_ACQUISITION_CASE"
  | "VIEW_EVIDENCE"
  | "DISMISS_ALERT";

export type AIAlertReviewPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type AIAlertReviewEvidenceType =
  | "SATELLITE_COMPARISON"
  | "SATELLITE_OBSERVATION"
  | "PARCEL_RECORD"
  | "FIELD_EVIDENCE"
  | "DOCUMENT"
  | "OFFICER_NOTE";

export interface AIAlertReviewEvidence {
  id: string;
  type: AIAlertReviewEvidenceType;
  title: string;
  description: string;
  referenceId?: string;
  available: boolean;
}

export interface AIAlertReviewNote {
  id: string;
  authorId: string;
  authorName: string;
  authorDesignation: string;
  note: string;
  createdAt: string;
}

export interface AIAlertReview {
  id: string;

  alertId: string;

  decision: AIAlertReviewDecision;

  priority: AIAlertReviewPriority;

  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerDesignation?: string;

  reviewedAt?: string;

  reviewSummary?: string;

  officerDetermination?: string;

  nextAction?: AIAlertReviewAction;

  fieldVerificationRequired: boolean;

  fieldVerificationId?: string;

  evidence: AIAlertReviewEvidence[];

  notes: AIAlertReviewNote[];

  createdAt: string;

  updatedAt: string;
}

export interface AIAlertReviewSummary {
  total: number;
  pending: number;
  confirmedChanges: number;
  fieldVerificationRequired: number;
  inconclusive: number;
  dismissed: number;
  highPriority: number;
}

export interface CreateAIAlertReviewInput {
  alertId: string;

  priority: AIAlertReviewPriority;

  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerDesignation?: string;

  reviewSummary?: string;

  officerDetermination?: string;

  nextAction?: AIAlertReviewAction;

  fieldVerificationRequired?: boolean;
}

export interface UpdateAIAlertReviewInput {
  decision?: AIAlertReviewDecision;

  priority?: AIAlertReviewPriority;

  reviewSummary?: string;

  officerDetermination?: string;

  nextAction?: AIAlertReviewAction;

  fieldVerificationRequired?: boolean;

  fieldVerificationId?: string;

  reviewedAt?: string;
}

export interface AddAIAlertReviewNoteInput {
  reviewId: string;

  authorId: string;
  authorName: string;
  authorDesignation: string;

  note: string;
}