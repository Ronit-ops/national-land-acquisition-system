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

type AuditAdministrator = {
  id: string;
  name: string;
  designation: string;
  department: string;
  organization: string;
  jurisdiction: string;
  jurisdictionType: JurisdictionType;
};

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