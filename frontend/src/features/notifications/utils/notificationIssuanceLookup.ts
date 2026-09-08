import {
  getNotificationIssuanceById,
  getNotificationIssuanceByNotificationId,
  getNotificationIssuanceByStage,
  getNotificationIssuanceRecords,
  getNotificationIssuanceDataset,
  getNotificationValidationResult,
  getNotificationValidationResults,
} from "../data/notificationIssuanceData";

import type {
  NotificationIssuanceAction,
  NotificationIssuanceDataset,
  NotificationIssuanceFilters,
  NotificationIssuanceRecord,
  NotificationIssuanceScope,
  NotificationIssuanceStage,
  NotificationIssuanceTransition,
  NotificationValidationResult,
  NotificationValidationStatus,
} from "../types/notificationIssuance";

/* =========================================================
   NORMALIZATION
   ========================================================= */

function normalize(value: string | undefined | null): string {
  return (value ?? "").trim().toLowerCase();
}

/* =========================================================
   SCOPE MATCHING
   ========================================================= */

/**
 * Current demo issuance records do not yet contain authoritative
 * district/project/parcel identifiers.
 *
 * Therefore jurisdiction filtering is intentionally conservative:
 * when a record contains a scope identifier, it must match.
 * Missing authoritative identifiers are not fabricated.
 */
function matchesScope(
  record: NotificationIssuanceRecord,
  scope?: NotificationIssuanceScope,
): boolean {
  if (!scope) {
    return true;
  }

  /*
   * At the current frontend-demo stage the issuance record
   * contains notification/case workflow information but does
   * not yet carry authoritative project/parcel IDs.
   *
   * We therefore avoid guessing jurisdiction relationships.
   */
  if (
    scope.projectId &&
    "projectId" in record &&
    typeof record.projectId === "string" &&
    record.projectId !== scope.projectId
  ) {
    return false;
  }

  if (
    scope.parcelId &&
    "parcelId" in record &&
    typeof record.parcelId === "string" &&
    record.parcelId !== scope.parcelId
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   DATASET
   ========================================================= */

export function getNotificationIssuanceDatasetSafe(): NotificationIssuanceDataset {
  return getNotificationIssuanceDataset();
}

/* =========================================================
   BASIC LOOKUPS
   ========================================================= */

export function getAllNotificationIssuanceRecords(): NotificationIssuanceRecord[] {
  return getNotificationIssuanceRecords();
}

export function findNotificationIssuanceById(
  id: string,
): NotificationIssuanceRecord | undefined {
  return getNotificationIssuanceById(id);
}

export function findNotificationIssuanceByNotificationId(
  notificationId: string,
): NotificationIssuanceRecord | undefined {
  return getNotificationIssuanceByNotificationId(
    notificationId,
  );
}

export function getNotificationIssuanceRecordsByStage(
  stage: NotificationIssuanceStage,
): NotificationIssuanceRecord[] {
  return getNotificationIssuanceByStage(stage);
}

/* =========================================================
   VALIDATION LOOKUPS
   ========================================================= */

export function getAllNotificationValidationResults(): NotificationValidationResult[] {
  return getNotificationValidationResults();
}

export function findNotificationValidationResult(
  notificationId: string,
): NotificationValidationResult | undefined {
  return getNotificationValidationResult(
    notificationId,
  );
}

export function getNotificationValidationResultsByStatus(
  status: NotificationValidationStatus,
): NotificationValidationResult[] {
  return getNotificationValidationResults().filter(
    (result) => result.status === status,
  );
}

/* =========================================================
   FILTERING
   ========================================================= */

export function getFilteredNotificationIssuanceRecords(
  filters?: NotificationIssuanceFilters,
  scope?: NotificationIssuanceScope,
): NotificationIssuanceRecord[] {
  const searchTerm = normalize(
    filters?.searchTerm,
  );

  return getNotificationIssuanceRecords().filter(
    (record) => {
      if (!matchesScope(record, scope)) {
        return false;
      }

      if (
        filters?.stage &&
        record.stage !== filters.stage
      ) {
        return false;
      }

      if (
        filters?.validationStatus &&
        record.validationStatus !==
          filters.validationStatus
      ) {
        return false;
      }

      if (
        filters?.onlyBlockingIssues &&
        !hasBlockingValidationIssues(
          record.notificationId,
        )
      ) {
        return false;
      }

      if (
        filters?.onlyAwaitingOfficerAction &&
        !isAwaitingOfficerAction(record)
      ) {
        return false;
      }

      if (searchTerm) {
        const searchableText = normalize(
          [
            record.id,
            record.notificationId,
            record.notificationReference,
            record.stage,
            record.validationStatus,
            record.issuer?.name,
            record.issuer?.designation,
          ]
            .filter(Boolean)
            .join(" "),
        );

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    },
  );
}

/* =========================================================
   WORKFLOW STATE HELPERS
   ========================================================= */

export function hasBlockingValidationIssues(
  notificationId: string,
): boolean {
  const validation =
    getNotificationValidationResult(
      notificationId,
    );

  return Boolean(
    validation &&
      validation.blockingFindingCount > 0,
  );
}

export function hasValidationWarnings(
  notificationId: string,
): boolean {
  const validation =
    getNotificationValidationResult(
      notificationId,
    );

  return Boolean(
    validation &&
      validation.warningCount > 0,
  );
}

export function isValidationPassed(
  notificationId: string,
): boolean {
  const validation =
    getNotificationValidationResult(
      notificationId,
    );

  return Boolean(
    validation?.passed,
  );
}

export function isAwaitingOfficerAction(
  record: NotificationIssuanceRecord,
): boolean {
  return (
    record.stage ===
      "VALIDATION_REQUIRED" ||
    record.stage ===
      "READY_FOR_ISSUANCE" ||
    record.stage ===
      "ISSUANCE_FAILED"
  );
}

/* =========================================================
   WORKFLOW TRANSITIONS
   ========================================================= */

/**
 * Explicit frontend workflow map.
 *
 * This is used for UI/state guidance.
 * Final authorization and transition enforcement must happen
 * in the backend once the production API is implemented.
 */
const NOTIFICATION_ISSUANCE_TRANSITIONS: NotificationIssuanceTransition[] =
  [
    {
      from: "VALIDATION_REQUIRED",
      to: "VALIDATION_IN_PROGRESS",
      action: "START_VALIDATION",
      requiresValidation: false,
      requiresOfficer: true,
      description:
        "Start pre-issuance validation for the notification.",
    },

    {
      from: "VALIDATION_IN_PROGRESS",
      to: "READY_FOR_ISSUANCE",
      action: "COMPLETE_VALIDATION",
      requiresValidation: true,
      requiresOfficer: true,
      description:
        "Complete validation and mark the notification ready when no blocking findings remain.",
    },

    {
      from: "VALIDATION_IN_PROGRESS",
      to: "VALIDATION_IN_PROGRESS",
      action: "REOPEN_VALIDATION",
      requiresValidation: false,
      requiresOfficer: true,
      description:
        "Continue or reopen the validation process.",
    },

    {
      from: "READY_FOR_ISSUANCE",
      to: "ISSUANCE_IN_PROGRESS",
      action: "ISSUE_NOTIFICATION",
      requiresValidation: true,
      requiresOfficer: true,
      description:
        "Begin controlled issuance after successful validation.",
    },

    {
      from: "ISSUANCE_IN_PROGRESS",
      to: "ISSUED",
      action: "ISSUE_NOTIFICATION",
      requiresValidation: true,
      requiresOfficer: true,
      description:
        "Complete controlled issuance of the notification.",
    },

    {
      from: "ISSUANCE_FAILED",
      to: "ISSUANCE_IN_PROGRESS",
      action: "RETRY_ISSUANCE",
      requiresValidation: true,
      requiresOfficer: true,
      description:
        "Retry issuance after resolving the delivery or issuance failure.",
    },

    {
      from: "DRAFT",
      to: "VALIDATION_REQUIRED",
      action: "START_VALIDATION",
      requiresValidation: false,
      requiresOfficer: true,
      description:
        "Submit a draft notification for validation.",
    },

    {
      from: "VALIDATION_IN_PROGRESS",
      to: "REJECTED",
      action: "REJECT_NOTIFICATION",
      requiresValidation: false,
      requiresOfficer: true,
      description:
        "Reject a notification that should not proceed to issuance.",
    },

    {
      from: "READY_FOR_ISSUANCE",
      to: "REJECTED",
      action: "REJECT_NOTIFICATION",
      requiresValidation: true,
      requiresOfficer: true,
      description:
        "Reject a validated notification before issuance.",
    },

    {
      from: "DRAFT",
      to: "CANCELLED",
      action: "CANCEL_NOTIFICATION",
      requiresValidation: false,
      requiresOfficer: true,
      description:
        "Cancel a notification that is no longer required.",
    },

    {
      from: "VALIDATION_REQUIRED",
      to: "CANCELLED",
      action: "CANCEL_NOTIFICATION",
      requiresValidation: false,
      requiresOfficer: true,
      description:
        "Cancel a notification before validation begins.",
    },

    {
      from: "VALIDATION_IN_PROGRESS",
      to: "CANCELLED",
      action: "CANCEL_NOTIFICATION",
      requiresValidation: false,
      requiresOfficer: true,
      description:
        "Cancel an active validation workflow.",
    },

    {
      from: "READY_FOR_ISSUANCE",
      to: "CANCELLED",
      action: "CANCEL_NOTIFICATION",
      requiresValidation: true,
      requiresOfficer: true,
      description:
        "Cancel a notification that has not yet been issued.",
    },
  ];

/* =========================================================
   TRANSITION LOOKUPS
   ========================================================= */

export function getNotificationIssuanceTransitions(): NotificationIssuanceTransition[] {
  return [
    ...NOTIFICATION_ISSUANCE_TRANSITIONS,
  ];
}

export function getAvailableNotificationIssuanceTransitions(
  stage: NotificationIssuanceStage,
): NotificationIssuanceTransition[] {
  return NOTIFICATION_ISSUANCE_TRANSITIONS.filter(
    (transition) =>
      transition.from === stage,
  );
}

export function getNotificationIssuanceTransition(
  stage: NotificationIssuanceStage,
  action: NotificationIssuanceAction,
): NotificationIssuanceTransition | undefined {
  return NOTIFICATION_ISSUANCE_TRANSITIONS.find(
    (transition) =>
      transition.from === stage &&
      transition.action === action,
  );
}

/* =========================================================
   TRANSITION VALIDATION
   ========================================================= */

export function canPerformNotificationIssuanceAction(
  record: NotificationIssuanceRecord,
  action: NotificationIssuanceAction,
): boolean {
  const transition =
    getNotificationIssuanceTransition(
      record.stage,
      action,
    );

  if (!transition) {
    return false;
  }

  /*
   * Validation requirements apply to actions that operate
   * on an already completed validation state.
   *
   * COMPLETE_VALIDATION is handled separately below because
   * completing validation is the operation that determines
   * whether validation passes.
   */
  if (
    transition.requiresValidation &&
    action !== "COMPLETE_VALIDATION" &&
    !isValidationPassed(
      record.notificationId,
    )
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   SPECIFIC WORKFLOW CHECKS
   ========================================================= */

export function canStartNotificationValidation(
  record: NotificationIssuanceRecord,
): boolean {
  return canPerformNotificationIssuanceAction(
    record,
    "START_VALIDATION",
  );
}

/**
 * Validation completion must be allowed while validation is
 * still in progress.
 *
 * The completion operation itself evaluates the findings and
 * determines whether the validation passes. Therefore this
 * function must NOT require isValidationPassed() beforehand.
 */
export function canCompleteNotificationValidation(
  record: NotificationIssuanceRecord,
): boolean {
  return (
    record.stage ===
    "VALIDATION_IN_PROGRESS"
  );
}

export function canIssueNotification(
  record: NotificationIssuanceRecord,
): boolean {
  return (
    record.stage ===
      "READY_FOR_ISSUANCE" &&
    isValidationPassed(
      record.notificationId,
    )
  );
}

export function canRejectNotification(
  record: NotificationIssuanceRecord,
): boolean {
  return (
    record.stage ===
      "DRAFT" ||
    record.stage ===
      "VALIDATION_REQUIRED" ||
    record.stage ===
      "VALIDATION_IN_PROGRESS" ||
    record.stage ===
      "READY_FOR_ISSUANCE"
  );
}

export function canCancelNotification(
  record: NotificationIssuanceRecord,
): boolean {
  return (
    record.stage !== "ISSUED" &&
    record.stage !== "CANCELLED"
  );
}

/* =========================================================
   STAGE LABELS
   ========================================================= */

export function getNotificationIssuanceStageLabel(
  stage: NotificationIssuanceStage,
): string {
  const labels: Record<
    NotificationIssuanceStage,
    string
  > = {
    DRAFT: "Draft",

    VALIDATION_REQUIRED:
      "Validation Required",

    VALIDATION_IN_PROGRESS:
      "Validation In Progress",

    READY_FOR_ISSUANCE:
      "Ready for Issuance",

    ISSUANCE_IN_PROGRESS:
      "Issuance In Progress",

    ISSUED: "Issued",

    ISSUANCE_FAILED:
      "Issuance Failed",

    REJECTED: "Rejected",

    CANCELLED: "Cancelled",
  };

  return labels[stage];
}

/* =========================================================
   VALIDATION STATUS LABELS
   ========================================================= */

export function getNotificationValidationStatusLabel(
  status: NotificationValidationStatus,
): string {
  const labels: Record<
    NotificationValidationStatus,
    string
  > = {
    NOT_STARTED: "Not Started",

    IN_PROGRESS: "In Progress",

    PASSED: "Passed",

    PASSED_WITH_WARNINGS:
      "Passed with Warnings",

    FAILED: "Failed",
  };

  return labels[status];
}

/* =========================================================
   SUMMARY
   ========================================================= */

export function getNotificationIssuanceSummary() {
  return getNotificationIssuanceDataset()
    .summary;
}

/* =========================================================
   WORKFLOW COUNTS
   ========================================================= */

export function getNotificationIssuanceActionRequiredCount(): number {
  return getNotificationIssuanceRecords().filter(
    (record) =>
      isAwaitingOfficerAction(record),
  ).length;
}

export function getNotificationIssuanceBlockingIssueCount(): number {
  return getNotificationValidationResults().reduce(
    (total, result) =>
      total +
      result.blockingFindingCount,
    0,
  );
}

/* =========================================================
   READY FOR ISSUANCE
   ========================================================= */

export function getNotificationsReadyForIssuance(
  scope?: NotificationIssuanceScope,
): NotificationIssuanceRecord[] {
  return getFilteredNotificationIssuanceRecords(
    {
      stage: "READY_FOR_ISSUANCE",
    },
    scope,
  );
}

/* =========================================================
   VALIDATION REQUIRED
   ========================================================= */

export function getNotificationsRequiringValidation(
  scope?: NotificationIssuanceScope,
): NotificationIssuanceRecord[] {
  return getFilteredNotificationIssuanceRecords(
    {
      stage: "VALIDATION_REQUIRED",
    },
    scope,
  );
}

/* =========================================================
   FAILED / BLOCKED
   ========================================================= */

export function getBlockedNotificationIssuanceRecords(
  scope?: NotificationIssuanceScope,
): NotificationIssuanceRecord[] {
  return getFilteredNotificationIssuanceRecords(
    {
      onlyBlockingIssues: true,
    },
    scope,
  );
}

/* =========================================================
   AWAITING OFFICER ACTION
   ========================================================= */

export function getNotificationIssuanceAwaitingOfficerAction(
  scope?: NotificationIssuanceScope,
): NotificationIssuanceRecord[] {
  return getFilteredNotificationIssuanceRecords(
    {
      onlyAwaitingOfficerAction: true,
    },
    scope,
  );
}