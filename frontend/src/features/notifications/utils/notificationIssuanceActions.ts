import {
  cancelNotificationIssuance,
  completeNotificationValidation,
  issueNotification,
  markNotificationReadyForIssuance,
  rejectNotificationIssuance,
  startNotificationValidation,
} from "../data/notificationIssuanceData";

import type {
  NotificationCancellationReason,
  NotificationIssuanceAction,
  NotificationIssuanceActor,
  NotificationIssuanceRecord,
  NotificationRejectionReason,
} from "../types/notificationIssuance";

import {
  canCancelNotification,
  canCompleteNotificationValidation,
  canIssueNotification,
  canRejectNotification,
  canStartNotificationValidation,
  findNotificationIssuanceById,
} from "./notificationIssuanceLookup";

/* =========================================================
   ACTION RESULT
   ========================================================= */

export type NotificationIssuanceActionResult =
  | {
      success: true;
      action: NotificationIssuanceAction;
      record: NotificationIssuanceRecord;
      message: string;
    }
  | {
      success: false;
      action: NotificationIssuanceAction;
      record?: NotificationIssuanceRecord;
      message: string;
    };

/* =========================================================
   ACTION CONTEXT
   ========================================================= */

export type NotificationIssuanceActionContext = {
  actor: NotificationIssuanceActor;
  reason?: string;
};

/* =========================================================
   HELPERS
   ========================================================= */

function getRecord(
  issuanceId: string,
): NotificationIssuanceRecord | undefined {
  return findNotificationIssuanceById(
    issuanceId,
  );
}

function failed(
  action: NotificationIssuanceAction,
  message: string,
  record?: NotificationIssuanceRecord,
): NotificationIssuanceActionResult {
  return {
    success: false,
    action,
    record,
    message,
  };
}

function succeeded(
  action: NotificationIssuanceAction,
  record: NotificationIssuanceRecord,
  message: string,
): NotificationIssuanceActionResult {
  return {
    success: true,
    action,
    record,
    message,
  };
}

/* =========================================================
   START VALIDATION
   ========================================================= */

export function executeStartNotificationValidation(
  issuanceId: string,
  context: NotificationIssuanceActionContext,
): NotificationIssuanceActionResult {
  const action: NotificationIssuanceAction =
    "START_VALIDATION";

  const record = getRecord(
    issuanceId,
  );

  if (!record) {
    return failed(
      action,
      "Notification issuance workflow could not be found.",
    );
  }

  if (
    !canStartNotificationValidation(
      record,
    )
  ) {
    return failed(
      action,
      "Validation cannot be started from the current workflow state.",
      record,
    );
  }

  const updated =
    startNotificationValidation(
      record.notificationId,
      context.actor,
    );

  if (!updated) {
    return failed(
      action,
      "Notification validation could not be started.",
      record,
    );
  }

  return succeeded(
    action,
    updated,
    "Notification validation has been started.",
  );
}

/* =========================================================
   COMPLETE VALIDATION
   ========================================================= */

export function executeCompleteNotificationValidation(
  issuanceId: string,
  context: NotificationIssuanceActionContext,
): NotificationIssuanceActionResult {
  const action: NotificationIssuanceAction =
    "COMPLETE_VALIDATION";

  const record = getRecord(
    issuanceId,
  );

  if (!record) {
    return failed(
      action,
      "Notification issuance workflow could not be found.",
    );
  }

  if (
    !canCompleteNotificationValidation(
      record,
    )
  ) {
    return failed(
      action,
      "Validation cannot be completed until all blocking findings are resolved.",
      record,
    );
  }

  const validation =
    completeNotificationValidation(
      record.notificationId,
      context.actor,
    );

  if (!validation) {
    return failed(
      action,
      "Notification validation could not be completed.",
      record,
    );
  }

  /*
   * The provider returns a validation result here,
   * so the issuance record itself must be read again
   * after the validation mutation.
   */
  const refreshedRecord =
    getRecord(issuanceId);

  if (!refreshedRecord) {
    return failed(
      action,
      "Validation completed, but the issuance workflow could not be reloaded.",
    );
  }

  return succeeded(
    action,
    refreshedRecord,
    validation.passed
      ? "Notification validation has been completed successfully."
      : "Notification validation completed with unresolved blocking findings.",
  );
}

/* =========================================================
   MARK READY FOR ISSUANCE
   ========================================================= */

export function executeMarkNotificationReady(
  issuanceId: string,
  context: NotificationIssuanceActionContext,
): NotificationIssuanceActionResult {
  const action: NotificationIssuanceAction =
    "MARK_READY_FOR_ISSUANCE";

  const record = getRecord(
    issuanceId,
  );

  if (!record) {
    return failed(
      action,
      "Notification issuance workflow could not be found.",
    );
  }

  if (
    !canCompleteNotificationValidation(
      record,
    ) &&
    record.stage !==
      "VALIDATION_IN_PROGRESS"
  ) {
    return failed(
      action,
      "Notification cannot be marked ready from the current workflow state.",
      record,
    );
  }

  /*
   * The provider itself is the final source for
   * validation state. This prevents the action
   * service from assuming validation succeeded.
   */
  const validationResult =
    completeNotificationValidation(
      record.notificationId,
      context.actor,
    );

  if (!validationResult) {
    return failed(
      action,
      "Validation information could not be retrieved.",
      record,
    );
  }

  if (!validationResult.passed) {
    const refreshedRecord =
      getRecord(issuanceId);

    return failed(
      action,
      "Notification cannot be marked ready while blocking validation findings remain unresolved.",
      refreshedRecord ?? record,
    );
  }

  const updated =
    markNotificationReadyForIssuance(
      record.notificationId,
      context.actor,
    );

  if (!updated) {
    return failed(
      action,
      "Notification could not be marked ready for issuance.",
      record,
    );
  }

  return succeeded(
    action,
    updated,
    "Notification is now ready for controlled issuance.",
  );
}

/* =========================================================
   ISSUE NOTIFICATION
   ========================================================= */

export function executeIssueNotification(
  issuanceId: string,
  context: NotificationIssuanceActionContext,
): NotificationIssuanceActionResult {
  const action: NotificationIssuanceAction =
    "ISSUE_NOTIFICATION";

  const record = getRecord(
    issuanceId,
  );

  if (!record) {
    return failed(
      action,
      "Notification issuance workflow could not be found.",
    );
  }

  /*
   * Critical safety gate.
   *
   * canIssueNotification() already checks:
   *
   * - correct workflow stage
   * - successful validation
   *
   * The UI cannot bypass this check.
   */
  if (!canIssueNotification(record)) {
    return failed(
      action,
      "Notification cannot be issued because the workflow is not ready or validation has not passed.",
      record,
    );
  }

  const updated =
    issueNotification(
      record.notificationId,
      context.actor,
    );

  if (!updated) {
    return failed(
      action,
      "Notification issuance failed.",
      record,
    );
  }

  return succeeded(
    action,
    updated,
    "Notification has been issued successfully.",
  );
}

/* =========================================================
   REJECT NOTIFICATION
   ========================================================= */

export function executeRejectNotification(
  issuanceId: string,
  reason: NotificationRejectionReason,
  context: NotificationIssuanceActionContext,
): NotificationIssuanceActionResult {
  const action: NotificationIssuanceAction =
    "REJECT_NOTIFICATION";

  const record = getRecord(
    issuanceId,
  );

  if (!record) {
    return failed(
      action,
      "Notification issuance workflow could not be found.",
    );
  }

  if (!reason) {
    return failed(
      action,
      "A rejection reason is required.",
      record,
    );
  }

  if (
    !canRejectNotification(record)
  ) {
    return failed(
      action,
      "This notification cannot be rejected from the current workflow state.",
      record,
    );
  }

  const updated =
    rejectNotificationIssuance(
      record.notificationId,
      context.actor,
      context.reason ??
        `Notification rejected: ${reason}.`,
    );

  if (!updated) {
    return failed(
      action,
      "Notification rejection could not be recorded.",
      record,
    );
  }

  return succeeded(
    action,
    updated,
    "Notification issuance has been rejected.",
  );
}

/* =========================================================
   CANCEL NOTIFICATION
   ========================================================= */

export function executeCancelNotification(
  issuanceId: string,
  reason: NotificationCancellationReason,
  context: NotificationIssuanceActionContext,
): NotificationIssuanceActionResult {
  const action: NotificationIssuanceAction =
    "CANCEL_NOTIFICATION";

  const record = getRecord(
    issuanceId,
  );

  if (!record) {
    return failed(
      action,
      "Notification issuance workflow could not be found.",
    );
  }

  if (!reason) {
    return failed(
      action,
      "A cancellation reason is required.",
      record,
    );
  }

  if (
    !canCancelNotification(record)
  ) {
    return failed(
      action,
      "This notification cannot be cancelled from the current workflow state.",
      record,
    );
  }

  const updated =
    cancelNotificationIssuance(
      record.notificationId,
      context.actor,
      context.reason ??
        `Notification cancelled: ${reason}.`,
    );

  if (!updated) {
    return failed(
      action,
      "Notification cancellation could not be recorded.",
      record,
    );
  }

  return succeeded(
    action,
    updated,
    "Notification issuance has been cancelled.",
  );
}

/* =========================================================
   ACTION DISPATCHER
   ========================================================= */

export function executeNotificationIssuanceAction(
  action: NotificationIssuanceAction,
  issuanceId: string,
  context: NotificationIssuanceActionContext,
  options?: {
    rejectionReason?: NotificationRejectionReason;
    cancellationReason?: NotificationCancellationReason;
  },
): NotificationIssuanceActionResult {
  switch (action) {
    case "START_VALIDATION":
      return executeStartNotificationValidation(
        issuanceId,
        context,
      );

    case "COMPLETE_VALIDATION":
      return executeCompleteNotificationValidation(
        issuanceId,
        context,
      );

    case "MARK_READY_FOR_ISSUANCE":
      return executeMarkNotificationReady(
        issuanceId,
        context,
      );

    case "ISSUE_NOTIFICATION":
      return executeIssueNotification(
        issuanceId,
        context,
      );

    case "REJECT_NOTIFICATION":
      if (
        !options?.rejectionReason
      ) {
        return failed(
          action,
          "A rejection reason is required.",
        );
      }

      return executeRejectNotification(
        issuanceId,
        options.rejectionReason,
        context,
      );

    case "CANCEL_NOTIFICATION":
      if (
        !options?.cancellationReason
      ) {
        return failed(
          action,
          "A cancellation reason is required.",
        );
      }

      return executeCancelNotification(
        issuanceId,
        options.cancellationReason,
        context,
      );

    case "RETRY_ISSUANCE":
      return failed(
        action,
        "Retry issuance is not yet enabled by the controlled action service.",
      );

    case "REOPEN_VALIDATION":
      return failed(
        action,
        "Reopen validation is not yet enabled by the controlled action service.",
      );

    case "VIEW_VALIDATION":
    case "VIEW_AUDIT":
      return failed(
        action,
        "This action does not modify the issuance workflow.",
      );

    default:
      return failed(
        action,
        "Unsupported notification issuance action.",
      );
  }
}