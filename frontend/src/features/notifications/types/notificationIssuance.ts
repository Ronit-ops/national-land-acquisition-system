import type {
  NotificationPriority,
  NotificationStatus,
} from "./notification";

/* =========================================================
   NOTIFICATION ISSUANCE WORKFLOW
   ========================================================= */

/**
 * Controlled stages through which a notification moves
 * before and after official issuance.
 */
export type NotificationIssuanceStage =
  | "DRAFT"
  | "VALIDATION_REQUIRED"
  | "VALIDATION_IN_PROGRESS"
  | "READY_FOR_ISSUANCE"
  | "ISSUANCE_IN_PROGRESS"
  | "ISSUED"
  | "ISSUANCE_FAILED"
  | "REJECTED"
  | "CANCELLED";

/**
 * Outcome of the notification validation process.
 */
export type NotificationValidationStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PASSED"
  | "PASSED_WITH_WARNINGS"
  | "FAILED";

/**
 * Severity of an individual validation finding.
 */
export type NotificationValidationSeverity =
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";

/**
 * Categories used when validating a notification
 * before issuance.
 */
export type NotificationValidationCategory =
  | "RECIPIENT"
  | "CASE_REFERENCE"
  | "PARCEL_REFERENCE"
  | "PROJECT_REFERENCE"
  | "DOCUMENT"
  | "MANDATORY_FIELD"
  | "DATE"
  | "LEGAL_REFERENCE"
  | "CONTENT"
  | "DELIVERY_CHANNEL"
  | "ACCESS_CONTROL"
  | "DUPLICATE"
  | "WORKFLOW";

/**
 * Individual validation finding.
 */
export interface NotificationValidationFinding {
  id: string;

  category: NotificationValidationCategory;

  severity: NotificationValidationSeverity;

  field?: string;

  title: string;

  message: string;

  resolved: boolean;

  resolvedAt?: string | null;

  resolvedByUserId?: string | null;

  resolutionNote?: string | null;
}

/**
 * Validation result attached to an issuance workflow.
 */
export interface NotificationValidationResult {
  id: string;

  notificationId: string;

  status: NotificationValidationStatus;

  startedAt?: string | null;

  completedAt?: string | null;

  validatedByUserId?: string | null;

  validatedByUserName?: string | null;

  findings: NotificationValidationFinding[];

  blockingFindingCount: number;

  warningCount: number;

  passed: boolean;

  summary: string;
}

/**
 * Actions an authorized officer/system can perform
 * against an issuance workflow.
 */
export type NotificationIssuanceAction =
  | "START_VALIDATION"
  | "COMPLETE_VALIDATION"
  | "MARK_READY_FOR_ISSUANCE"
  | "ISSUE_NOTIFICATION"
  | "RETRY_ISSUANCE"
  | "REJECT_NOTIFICATION"
  | "CANCEL_NOTIFICATION"
  | "REOPEN_VALIDATION"
  | "VIEW_VALIDATION"
  | "VIEW_AUDIT";

/**
 * Reason for rejecting a notification before issuance.
 */
export type NotificationRejectionReason =
  | "VALIDATION_FAILED"
  | "INCORRECT_RECIPIENT"
  | "INCORRECT_REFERENCE"
  | "MISSING_DOCUMENT"
  | "INCORRECT_CONTENT"
  | "DUPLICATE_NOTIFICATION"
  | "UNAUTHORIZED_ISSUER"
  | "OTHER";

/**
 * Reason for cancellation.
 */
export type NotificationCancellationReason =
  | "CASE_WITHDRAWN"
  | "NOTICE_SUPERSEDED"
  | "INCORRECT_NOTIFICATION"
  | "DUPLICATE_NOTIFICATION"
  | "WORKFLOW_CORRECTION"
  | "OTHER";

/**
 * Officer who performed an issuance-related action.
 */
export interface NotificationIssuanceActor {
  userId: string;

  name: string;

  designation: string;

  department: string;

  organization: string;

  jurisdiction: string;

  jurisdictionType: string;
}

/**
 * Audit-ready record of a workflow action.
 */
export interface NotificationIssuanceActionRecord {
  id: string;

  notificationId: string;

  action: NotificationIssuanceAction;

  performedAt: string;

  actor: NotificationIssuanceActor;

  previousStage: NotificationIssuanceStage;

  newStage: NotificationIssuanceStage;

  reason?: string | null;

  referenceNumber?: string | null;

  auditEventId?: string | null;
}

/**
 * Controlled issuance record.
 *
 * This is intentionally separate from NotificationRecord because
 * delivery status and official issuance are different concerns.
 */
export interface NotificationIssuanceRecord {
  id: string;

  notificationId: string;

  notificationReference: string;

  stage: NotificationIssuanceStage;

  validationStatus: NotificationValidationStatus;

  validationResultId?: string | null;

  issuer?: NotificationIssuanceActor | null;

  createdAt: string;

  updatedAt: string;

  readyForIssuanceAt?: string | null;

  issuedAt?: string | null;

  issuanceReference?: string | null;

  rejectedAt?: string | null;

  rejectionReason?: NotificationRejectionReason | null;

  rejectionNote?: string | null;

  cancelledAt?: string | null;

  cancellationReason?: NotificationCancellationReason | null;

  cancellationNote?: string | null;

  actionHistory: NotificationIssuanceActionRecord[];

  auditEventIds: string[];
}

/**
 * Summary metrics for the issuance workspace.
 */
export interface NotificationIssuanceSummary {
  total: number;

  drafts: number;

  validationRequired: number;

  validationInProgress: number;

  readyForIssuance: number;

  issuanceInProgress: number;

  issued: number;

  issuanceFailed: number;

  rejected: number;

  cancelled: number;

  blockingValidationIssues: number;

  awaitingOfficerAction: number;
}

/**
 * Complete issuance dataset.
 */
export interface NotificationIssuanceDataset {
  records: NotificationIssuanceRecord[];

  validationResults: NotificationValidationResult[];

  summary: NotificationIssuanceSummary;
}

/**
 * Input used when creating a new issuance workflow.
 */
export interface CreateNotificationIssuanceInput {
  notificationId: string;

  notificationReference: string;

  priority?: NotificationPriority;

  initialStage?: NotificationIssuanceStage;
}

/**
 * Input used when updating the workflow state.
 */
export interface UpdateNotificationIssuanceInput {
  stage?: NotificationIssuanceStage;

  validationStatus?: NotificationValidationStatus;

  validationResultId?: string | null;

  issuer?: NotificationIssuanceActor | null;

  readyForIssuanceAt?: string | null;

  issuedAt?: string | null;

  issuanceReference?: string | null;

  rejectedAt?: string | null;

  rejectionReason?: NotificationRejectionReason | null;

  rejectionNote?: string | null;

  cancelledAt?: string | null;

  cancellationReason?: NotificationCancellationReason | null;

  cancellationNote?: string | null;
}

/**
 * Input for adding a validation finding.
 */
export interface AddNotificationValidationFindingInput {
  notificationId: string;

  category: NotificationValidationCategory;

  severity: NotificationValidationSeverity;

  field?: string;

  title: string;

  message: string;
}

/**
 * Input for resolving a validation finding.
 */
export interface ResolveNotificationValidationFindingInput {
  findingId: string;

  resolvedByUserId: string;

  resolutionNote: string;
}

/**
 * Input for recording a workflow action.
 */
export interface RecordNotificationIssuanceActionInput {
  notificationId: string;

  action: NotificationIssuanceAction;

  actor: NotificationIssuanceActor;

  previousStage: NotificationIssuanceStage;

  newStage: NotificationIssuanceStage;

  reason?: string | null;

  referenceNumber?: string | null;

  auditEventId?: string | null;
}

/**
 * Transition definition used by the workflow engine.
 */
export interface NotificationIssuanceTransition {
  from: NotificationIssuanceStage;

  to: NotificationIssuanceStage;

  action: NotificationIssuanceAction;

  requiresValidation: boolean;

  requiresOfficer: boolean;

  description: string;
}

/**
 * Scope used when retrieving issuance workflows.
 */
export interface NotificationIssuanceScope {
  caseReference?: string;

  projectId?: string;

  parcelId?: string;

  jurisdiction?: string;

  jurisdictionType?: string;
}

/**
 * Filters used by the issuance workspace.
 */
export interface NotificationIssuanceFilters {
  stage?: NotificationIssuanceStage;

  validationStatus?: NotificationValidationStatus;

  notificationStatus?: NotificationStatus;

  onlyBlockingIssues?: boolean;

  onlyAwaitingOfficerAction?: boolean;

  searchTerm?: string;
}