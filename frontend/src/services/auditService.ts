import {
  createAuditEvent,
} from "../data/audit";

import type {
  GovernmentUser,
} from "../features/admin/types/governmentUser";

import type {
  GovernmentRole,
} from "../auth/AuthContext";

import type {
  JurisdictionType,
} from "../auth/roleAccess";

import type {
  DocumentRecord,
} from "../features/documents/types/document";

import type {
  AIAlertReview,
  AIAlertReviewAction,
  AIAlertReviewDecision,
  AIAlertReviewPriority,
} from "../features/satellite/types/aiAlertReview";

type AuditAdministrator = {
  id: string;
  name: string;
  designation: string;
  department: string;
  organization: string;
  jurisdiction: string;
  jurisdictionType: JurisdictionType;
};

/**
 * Records a government user role change.
 */
export function recordGovernmentUserRoleChange(
  administrator: AuditAdministrator,
  targetUser: GovernmentUser,
  previousRole: GovernmentRole,
  newRole: GovernmentRole,
  reason: string,
) {
  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "USER_MANAGEMENT",
    category: "ACCESS_CONTROL",
    action: "CHANGE_USER_ROLE",
    entityType: "GOVERNMENT_USER",
    entityId: targetUser.id,
    referenceNumber: targetUser.employeeReference,
    severity: "HIGH",
    summary: `Government user role changed from ${previousRole} to ${newRole}.`,
    reason,
  });
}

/**
 * Records a government user jurisdiction change.
 */
export function recordGovernmentUserJurisdictionChange(
  administrator: AuditAdministrator,
  targetUser: GovernmentUser,
  previousJurisdiction: string,
  newJurisdiction: string,
  reason: string,
) {
  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "USER_MANAGEMENT",
    category: "ACCESS_CONTROL",
    action: "CHANGE_USER_JURISDICTION",
    entityType: "GOVERNMENT_USER",
    entityId: targetUser.id,
    referenceNumber: targetUser.employeeReference,
    severity: "HIGH",
    summary: `Government user jurisdiction changed from ${previousJurisdiction} to ${newJurisdiction}.`,
    reason,
  });
}

/**
 * Records a government user status change.
 */
export function recordGovernmentUserStatusChange(
  administrator: AuditAdministrator,
  targetUser: GovernmentUser,
  previousStatus: GovernmentUser["status"],
  newStatus: GovernmentUser["status"],
  reason: string,
) {
  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "USER_MANAGEMENT",
    category: "ACCESS_CONTROL",
    action: "UPDATE_USER_STATUS",
    entityType: "GOVERNMENT_USER",
    entityId: targetUser.id,
    referenceNumber: targetUser.employeeReference,
    severity:
      newStatus === "SUSPENDED"
        ? "CRITICAL"
        : newStatus === "INACTIVE"
          ? "HIGH"
          : "MEDIUM",
    summary: `Government user status changed from ${previousStatus} to ${newStatus}.`,
    reason,
  });
}

/**
 * Records a document access event in the audit trail.
 *
 * The current audit model does not yet have a dedicated
 * DOCUMENT_ACCESS category, so document access is recorded
 * under the existing ACCESS_CONTROL category.
 */
function recordDocumentAction(
  administrator: AuditAdministrator,
  document: DocumentRecord,
  action: "VIEW_DOCUMENT" | "DOWNLOAD_DOCUMENT" | "SHARE_DOCUMENT",
  reason: string,
  severity: "MEDIUM" | "HIGH" | "CRITICAL",
) {
  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "DOCUMENTS",
    category: "ACCESS_CONTROL",
    action,
    entityType: "DOCUMENT",
    entityId: document.id,
    referenceNumber: document.documentNumber,
    severity,
    summary: `Document ${action
      .replace("_DOCUMENT", "")
      .toLowerCase()} action recorded for ${document.documentNumber}.`,
    reason,
  });
}

/**
 * Records that an authorized government user opened a document.
 */
export function recordDocumentView(
  administrator: AuditAdministrator,
  document: DocumentRecord,
  reason = "Document opened from the government document workspace.",
) {
  return recordDocumentAction(
    administrator,
    document,
    "VIEW_DOCUMENT",
    reason,
    document.sensitivity === "HIGHLY_RESTRICTED"
      ? "HIGH"
      : document.sensitivity === "RESTRICTED"
        ? "MEDIUM"
        : "MEDIUM",
  );
}

/**
 * Records that an authorized government user initiated
 * a document download.
 */
export function recordDocumentDownload(
  administrator: AuditAdministrator,
  document: DocumentRecord,
  reason = "Document download initiated from the government document workspace.",
) {
  return recordDocumentAction(
    administrator,
    document,
    "DOWNLOAD_DOCUMENT",
    reason,
    document.sensitivity === "HIGHLY_RESTRICTED"
      ? "HIGH"
      : "HIGH",
  );
}

/**
 * Records that an authorized government user initiated
 * a document sharing action.
 */
export function recordDocumentShare(
  administrator: AuditAdministrator,
  document: DocumentRecord,
  reason = "Document sharing action initiated from the government document workspace.",
) {
  return recordDocumentAction(
    administrator,
    document,
    "SHARE_DOCUMENT",
    reason,
    document.sensitivity === "HIGHLY_RESTRICTED"
      ? "CRITICAL"
      : document.sensitivity === "RESTRICTED"
        ? "HIGH"
        : "MEDIUM",
  );
}

/* -------------------------------------------------------------------------- */
/* AI ALERT REVIEW AUDIT                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns the audit severity associated with an AI review decision.
 *
 * These values describe the operational importance of the action.
 * They do NOT represent a legal conclusion about the underlying land.
 */
function getAIReviewDecisionSeverity(
  decision: AIAlertReviewDecision,
): "MEDIUM" | "HIGH" | "CRITICAL" {
  switch (decision) {
    case "CONFIRMED_CHANGE":
      return "HIGH";

    case "DISMISSED":
      return "MEDIUM";

    case "NO_CHANGE_CONFIRMED":
      return "MEDIUM";

    case "INCONCLUSIVE":
      return "HIGH";

    case "PENDING":
    default:
      return "MEDIUM";
  }
}

/**
 * Records an officer's determination against an AI-generated alert.
 *
 * The audit entity is the AI alert review, while the reference number
 * contains both the review and alert identifiers for traceability.
 */
export function recordAIAlertReviewDecision(
  administrator: AuditAdministrator,
  review: AIAlertReview,
  previousDecision: AIAlertReviewDecision,
  newDecision: AIAlertReviewDecision,
  reason: string,
) {
  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "AI_ALERTS",
    category: "VERIFICATION",
    action: "UPDATE_AI_ALERT_REVIEW_DECISION",
    entityType: "AI_ALERT_REVIEW",
    entityId: review.id,
    referenceNumber: `${review.alertId} / ${review.id}`,
    severity: getAIReviewDecisionSeverity(newDecision),
    summary:
      `AI alert review decision changed from ${previousDecision} ` +
      `to ${newDecision}.`,
    reason,
  });
}

/**
 * Records an officer changing the operational priority of an AI alert review.
 */
export function recordAIAlertReviewPriorityChange(
  administrator: AuditAdministrator,
  review: AIAlertReview,
  previousPriority: AIAlertReviewPriority,
  newPriority: AIAlertReviewPriority,
  reason: string,
) {
  const severity =
    newPriority === "CRITICAL"
      ? "CRITICAL"
      : newPriority === "HIGH"
        ? "HIGH"
        : "MEDIUM";

  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "AI_ALERTS",
    category: "ADMINISTRATIVE_ACTION",
    action: "UPDATE_AI_ALERT_PRIORITY",
    entityType: "AI_ALERT_REVIEW",
    entityId: review.id,
    referenceNumber: `${review.alertId} / ${review.id}`,
    severity,
    summary:
      `AI alert review priority changed from ${previousPriority} ` +
      `to ${newPriority}.`,
    reason,
  });
}

/**
 * Records a request for field verification generated from an AI alert review.
 */
export function recordAIAlertFieldVerificationRequest(
  administrator: AuditAdministrator,
  review: AIAlertReview,
  reason: string,
) {
  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "FIELD_VERIFICATION",
    category: "VERIFICATION",
    action: "REQUEST_FIELD_VERIFICATION",
    entityType: "AI_ALERT_REVIEW",
    entityId: review.id,
    referenceNumber: review.fieldVerificationId
      ? `${review.alertId} / ${review.fieldVerificationId}`
      : `${review.alertId} / ${review.id}`,
    severity: "HIGH",
    summary:
      "Field verification requested following review of an AI-generated observation.",
    reason,
  });
}

/**
 * Records an officer note added to an AI alert review.
 */
export function recordAIAlertReviewNote(
  administrator: AuditAdministrator,
  review: AIAlertReview,
  note: string,
) {
  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: "AI_ALERTS",
    category: "ADMINISTRATIVE_ACTION",
    action: "ADD_AI_ALERT_REVIEW_NOTE",
    entityType: "AI_ALERT_REVIEW",
    entityId: review.id,
    referenceNumber: `${review.alertId} / ${review.id}`,
    severity: "MEDIUM",
    summary: "Officer note added to an AI alert review.",
    reason: note,
  });
}

/**
 * Records a significant operational action taken from an AI alert review.
 *
 * This function provides a single audit entry point for review actions
 * such as opening evidence, reviewing a comparison, opening a parcel,
 * or requesting field verification.
 */
export function recordAIAlertReviewAction(
  administrator: AuditAdministrator,
  review: AIAlertReview,
  action: AIAlertReviewAction,
  reason: string,
) {
  const actionMap: Record<AIAlertReviewAction, string> = {
    REVIEW_COMPARISON: "REVIEW_AI_ALERT_COMPARISON",
    REQUEST_FIELD_VERIFICATION: "REQUEST_FIELD_VERIFICATION",
    OPEN_PARCEL: "OPEN_AI_ALERT_PARCEL",
    OPEN_ACQUISITION_CASE: "OPEN_AI_ALERT_ACQUISITION_CASE",
    VIEW_EVIDENCE: "VIEW_AI_ALERT_EVIDENCE",
    DISMISS_ALERT: "DISMISS_AI_ALERT",
  };

  const isVerificationAction =
    action === "REQUEST_FIELD_VERIFICATION";

  return createAuditEvent({
    actorId: administrator.id,
    actorName: administrator.name,
    actorRole: administrator.designation,
    department: administrator.department,
    organization: administrator.organization,
    jurisdiction: administrator.jurisdiction,
    jurisdictionType: administrator.jurisdictionType,
    module: isVerificationAction
      ? "FIELD_VERIFICATION"
      : "AI_ALERTS",
    category: isVerificationAction
      ? "VERIFICATION"
      : "ADMINISTRATIVE_ACTION",
    action: actionMap[action],
    entityType: "AI_ALERT_REVIEW",
    entityId: review.id,
    referenceNumber: `${review.alertId} / ${review.id}`,
    severity: isVerificationAction ? "HIGH" : "MEDIUM",
    summary:
      `AI alert review action executed: ${action.replaceAll("_", " ")}.`,
    reason,
  });
}