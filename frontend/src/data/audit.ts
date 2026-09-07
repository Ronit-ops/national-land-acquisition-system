import type {
  AuditActorType,
  AuditCategory,
  AuditEvent,
  AuditSeverity,
  AuditSource,
} from "../types/audit";

const initialAuditEvents: AuditEvent[] = [
  {
    id: "AUD-PUN-2026-000981",
    timestamp: "2026-09-07T09:42:18",
    actorId: "USR-PUN-001",
    actorName: "Anil Deshmukh",
    actorRole: "District Land Acquisition Officer",
    actorType: "USER",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
    module: "LAND_PARCELS",
    category: "RECORD_ACCESS",
    action: "VIEW_PARCEL",
    entityType: "PARCEL",
    entityId: "PUN-001245",
    referenceNumber: "Survey No. 145/2A",
    severity: "INFO",
    summary: "Parcel record accessed for operational review.",
    reason: "Land acquisition case review",
    source: "USER_ACTION",
    ipAddress: "DEMO-REDACTED",
    requestReference: "REQ-PUN-2026-78124",
  },
  {
    id: "AUD-PUN-2026-000982",
    timestamp: "2026-09-07T10:06:41",
    actorId: "USR-PUN-002",
    actorName: "Meera Kulkarni",
    actorRole: "Land Acquisition Officer",
    actorType: "USER",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
    module: "ACQUISITION",
    category: "WORKFLOW_CHANGE",
    action: "ADVANCE_ACQUISITION_STAGE",
    entityType: "ACQUISITION_CASE",
    entityId: "ACQ-PUN-2026-00421",
    referenceNumber: "ACQ-PUN-2026-00421",
    severity: "MEDIUM",
    summary: "Acquisition case moved from Hearing to Valuation.",
    reason: "Proceedings completed and valuation workflow initiated",
    source: "USER_ACTION",
    ipAddress: "DEMO-REDACTED",
    requestReference: "REQ-PUN-2026-78139",
  },
  {
    id: "AUD-PUN-2026-000983",
    timestamp: "2026-09-07T10:24:03",
    actorId: "USR-PUN-003",
    actorName: "Sanjay Patil",
    actorRole: "Field Verification Officer",
    actorType: "USER",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
    module: "FIELD_VERIFICATION",
    category: "VERIFICATION",
    action: "SUBMIT_FIELD_EVIDENCE",
    entityType: "FIELD_VERIFICATION",
    entityId: "FV-PUN-2026-0098",
    referenceNumber: "AI-ALT-PUN-2026-0187",
    severity: "HIGH",
    summary: "Field evidence submitted against an AI-generated observation.",
    reason: "On-site verification completed",
    source: "USER_ACTION",
    ipAddress: "DEMO-REDACTED",
    requestReference: "REQ-PUN-2026-78155",
  },
  {
    id: "AUD-NAG-2026-000417",
    timestamp: "2026-09-07T10:51:27",
    actorId: "USR-NAG-004",
    actorName: "Priya Joshi",
    actorRole: "Revenue Officer",
    actorType: "USER",
    department: "Revenue Department",
    organization: "Government of Maharashtra",
    jurisdiction: "Nagpur District",
    jurisdictionType: "DISTRICT",
    module: "LAND_PARCELS",
    category: "RECORD_UPDATE",
    action: "UPDATE_VERIFICATION_STATUS",
    entityType: "PARCEL",
    entityId: "NAG-004812",
    referenceNumber: "Survey No. 82/4",
    severity: "HIGH",
    summary: "Parcel verification status updated after revenue record review.",
    reason: "Source record verification completed",
    source: "USER_ACTION",
    ipAddress: "DEMO-REDACTED",
    requestReference: "REQ-NAG-2026-33481",
  },
  {
    id: "AUD-NAS-2026-000238",
    timestamp: "2026-09-07T11:13:52",
    actorId: "SYSTEM-AI",
    actorName: "AI Observation Service",
    actorRole: "System Service",
    actorType: "SYSTEM",
    department: "National Land Acquisition System",
    organization: "System Generated",
    jurisdiction: "Nashik District",
    jurisdictionType: "DISTRICT",
    module: "AI_ALERTS",
    category: "AI_OBSERVATION",
    action: "GENERATE_AI_ALERT",
    entityType: "AI_ALERT",
    entityId: "AI-ALT-NAS-2026-0071",
    referenceNumber: "NAS-003102",
    severity: "MEDIUM",
    summary: "AI generated a potential land-use change observation.",
    reason: "Satellite observation crossed configured change-detection threshold",
    source: "SYSTEM_EVENT",
    ipAddress: null,
    requestReference: "AI-RUN-2026-0911",
  },
  {
    id: "AUD-PUN-2026-000984",
    timestamp: "2026-09-07T11:31:09",
    actorId: "USR-PUN-001",
    actorName: "Anil Deshmukh",
    actorRole: "District Land Acquisition Officer",
    actorType: "USER",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
    module: "COMPENSATION",
    category: "ADMINISTRATIVE_ACTION",
    action: "OPEN_COMPENSATION_REVIEW",
    entityType: "COMPENSATION_RECORD",
    entityId: "COMP-PUN-2026-001",
    referenceNumber: "ACQ-PUN-2026-00421",
    severity: "INFO",
    summary: "Compensation record opened for review.",
    reason: "Pending compensation payment review",
    source: "USER_ACTION",
    ipAddress: "DEMO-REDACTED",
    requestReference: "REQ-PUN-2026-78182",
  },
  {
    id: "AUD-PUN-2026-000985",
    timestamp: "2026-09-07T11:46:22",
    actorId: "USR-PUN-006",
    actorName: "Vikram Shah",
    actorRole: "State Administrator",
    actorType: "USER",
    department: "State Administration",
    organization: "Government of Maharashtra",
    jurisdiction: "Maharashtra",
    jurisdictionType: "STATE",
    module: "USER_MANAGEMENT",
    category: "ACCESS_CONTROL",
    action: "UPDATE_USER_STATUS",
    entityType: "GOVERNMENT_USER",
    entityId: "USR-NAG-008",
    referenceNumber: "EMP-NAG-008",
    severity: "CRITICAL",
    summary: "Government user status changed to suspended.",
    reason: "Administrative access-control action",
    source: "USER_ACTION",
    ipAddress: "DEMO-REDACTED",
    requestReference: "REQ-STATE-2026-19281",
  },
];

let auditEvents: AuditEvent[] = [...initialAuditEvents];

export function getAuditEvents(): AuditEvent[] {
  return [...auditEvents];
}

export function addAuditEvent(event: AuditEvent): void {
  auditEvents = [event, ...auditEvents];
}

export function resetAuditEvents(): void {
  auditEvents = [...initialAuditEvents];
}

export type CreateAuditEventInput = {
  actorId: string;
  actorName: string;
  actorRole: string;
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
  source?: AuditSource;
};

function generateAuditId(): string {
  const timestamp = Date.now().toString().slice(-8);

  return `AUD-DEMO-${timestamp}`;
}

function generateRequestReference(): string {
  const timestamp = Date.now().toString().slice(-8);

  return `REQ-DEMO-${timestamp}`;
}

export function createAuditEvent(
  input: CreateAuditEventInput,
): AuditEvent {
  const event: AuditEvent = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    actorId: input.actorId,
    actorName: input.actorName,
    actorRole: input.actorRole,
    actorType: "USER" as AuditActorType,
    department: input.department,
    organization: input.organization,
    jurisdiction: input.jurisdiction,
    jurisdictionType: input.jurisdictionType,
    module: input.module,
    category: input.category,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    referenceNumber: input.referenceNumber,
    severity: input.severity,
    summary: input.summary,
    reason: input.reason,
    source: input.source ?? "USER_ACTION",
    ipAddress: "DEMO-REDACTED",
    requestReference: generateRequestReference(),
  };

  addAuditEvent(event);

  return event;
}