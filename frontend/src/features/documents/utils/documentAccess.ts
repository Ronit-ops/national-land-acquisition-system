import type { GovernmentRole } from "../../../auth/AuthContext";
import type {
  DocumentRecord,
  DocumentSensitivity,
} from "../types/document";

export type DocumentAccessDecision = {
  canView: boolean;
  canDownload: boolean;
  canShare: boolean;
  reason: string;
};

const sensitivityRank: Record<DocumentSensitivity, number> = {
  PUBLIC: 0,
  OFFICER_ONLY: 1,
  RESTRICTED: 2,
  HIGHLY_RESTRICTED: 3,
};

const roleClearance: Record<GovernmentRole, number> = {
  DISTRICT_LAND_OFFICER: 3,
  ACQUISITION_OFFICER: 2,
  PROJECT_AUTHORITY: 2,
  REVENUE_OFFICER: 2,
  FIELD_VERIFICATION_OFFICER: 1,
  STATE_ADMINISTRATOR: 3,
};

export function getDocumentAccessDecision(
  document: DocumentRecord,
  role: GovernmentRole,
): DocumentAccessDecision {
  const clearance = roleClearance[role];

  const requiredClearance =
    sensitivityRank[document.sensitivity];

  if (clearance < requiredClearance) {
    return {
      canView: false,
      canDownload: false,
      canShare: false,
      reason:
        "This record is outside the document sensitivity clearance available to the current government role.",
    };
  }

  if (document.status === "WITHHELD") {
    return {
      canView: false,
      canDownload: false,
      canShare: false,
      reason:
        "This record is currently withheld and cannot be opened from the government workspace.",
    };
  }

  const canDownload =
    document.status !== "DISPUTED" &&
    document.versionStatus !== "SUPERSEDED" &&
    document.versionStatus !== "ARCHIVED";

  const canShare =
    document.sensitivity === "PUBLIC" &&
    document.citizenVisible;

  return {
    canView: true,
    canDownload,
    canShare,
    reason:
      document.sensitivity === "PUBLIC"
        ? "This record is available within the current authorization context."
        : "Access is permitted based on the current officer role and document sensitivity.",
  };
}

export function canViewDocument(
  document: DocumentRecord,
  role: GovernmentRole,
): boolean {
  return getDocumentAccessDecision(
    document,
    role,
  ).canView;
}

export function canDownloadDocument(
  document: DocumentRecord,
  role: GovernmentRole,
): boolean {
  return getDocumentAccessDecision(
    document,
    role,
  ).canDownload;
}

export function canShareDocument(
  document: DocumentRecord,
  role: GovernmentRole,
): boolean {
  return getDocumentAccessDecision(
    document,
    role,
  ).canShare;
}

export function getDocumentAccessLabel(
  document: DocumentRecord,
  role: GovernmentRole,
): string {
  const decision =
    getDocumentAccessDecision(
      document,
      role,
    );

  if (!decision.canView) {
    return "Access Restricted";
  }

  if (
    document.sensitivity ===
    "HIGHLY_RESTRICTED"
  ) {
    return "Highly Restricted";
  }

  if (
    document.sensitivity ===
    "RESTRICTED"
  ) {
    return "Restricted";
  }

  if (
    document.sensitivity ===
    "OFFICER_ONLY"
  ) {
    return "Officer Only";
  }

  return "Accessible";
}