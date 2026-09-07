export type AuditActorType =
  | "USER"
  | "SYSTEM";

export type AuditCategory =
  | "RECORD_ACCESS"
  | "RECORD_UPDATE"
  | "WORKFLOW_CHANGE"
  | "VERIFICATION"
  | "AI_OBSERVATION"
  | "ADMINISTRATIVE_ACTION"
  | "ACCESS_CONTROL";

export type AuditSeverity =
  | "INFO"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type AuditSource =
  | "USER_ACTION"
  | "SYSTEM_EVENT";

export type AuditEvent = {
  id: string;
  timestamp: string;

  actorId: string;
  actorName: string;
  actorRole: string;
  actorType: AuditActorType;

  department: string;
  organization: string;

  jurisdiction: string;
  jurisdictionType: string;

  module: string;
  category: AuditCategory;
  action: string;

  entityType: string;
  entityId: string;
  referenceNumber: string;

  severity: AuditSeverity;

  summary: string;
  reason: string;

  source: AuditSource;

  ipAddress: string | null;
  requestReference: string;
};