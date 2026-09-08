import type {
  NotificationIssuanceActionRecord,
  NotificationIssuanceActor,
  NotificationIssuanceDataset,
  NotificationIssuanceRecord,
  NotificationIssuanceStage,
  NotificationValidationFinding,
  NotificationValidationResult,
  CreateNotificationIssuanceInput,
  UpdateNotificationIssuanceInput,
  AddNotificationValidationFindingInput,
  ResolveNotificationValidationFindingInput,
  RecordNotificationIssuanceActionInput,
} from "../types/notificationIssuance";

/* =========================================================
   DEMO ACTORS
   ========================================================= */

const demoAcquisitionOfficer: NotificationIssuanceActor = {
  userId: "USR-GOV-002",
  name: "Meera Kulkarni",
  designation: "Land Acquisition Officer",
  department: "Revenue Department",
  organization: "Government of Maharashtra",
  jurisdiction: "Pune District",
  jurisdictionType: "DISTRICT",
};

const demoDistrictOfficer: NotificationIssuanceActor = {
  userId: "USR-GOV-001",
  name: "Anil Deshmukh",
  designation: "District Land Acquisition Officer",
  department: "Revenue Department",
  organization: "Government of Maharashtra",
  jurisdiction: "Pune District",
  jurisdictionType: "DISTRICT",
};

/* =========================================================
   DEMO VALIDATION FINDINGS
   ========================================================= */

const initialValidationFindings: NotificationValidationFinding[] = [
  {
    id: "VAL-FND-001",
    category: "RECIPIENT",
    severity: "INFO",
    field: "recipient",
    title: "Recipient identity available",
    message:
      "Recorded right-holder information is available for the notification recipient.",
    resolved: true,
    resolvedAt: "2026-08-29T10:15:00",
    resolvedByUserId: "USR-GOV-002",
    resolutionNote:
      "Recipient information matched the demonstration case record.",
  },

  {
    id: "VAL-FND-002",
    category: "CASE_REFERENCE",
    severity: "INFO",
    field: "caseReference",
    title: "Case reference available",
    message:
      "The notification contains a linked acquisition case reference.",
    resolved: true,
    resolvedAt: "2026-08-29T10:16:00",
    resolvedByUserId: "USR-GOV-002",
    resolutionNote:
      "Case reference is available in the demonstration dataset.",
  },

  {
    id: "VAL-FND-003",
    category: "DOCUMENT",
    severity: "WARNING",
    field: "references",
    title: "Supporting document verification recommended",
    message:
      "A supporting document is linked to the notification, but officer verification is recommended before issuance.",
    resolved: false,
    resolvedAt: null,
    resolvedByUserId: null,
    resolutionNote: null,
  },

  {
    id: "VAL-FND-004",
    category: "MANDATORY_FIELD",
    severity: "ERROR",
    field: "acknowledgementDeadline",
    title: "Acknowledgement deadline required",
    message:
      "The notification requires acknowledgement but does not currently contain a valid acknowledgement deadline.",
    resolved: false,
    resolvedAt: null,
    resolvedByUserId: null,
    resolutionNote: null,
  },

  {
    id: "VAL-FND-005",
    category: "DUPLICATE",
    severity: "WARNING",
    field: "notificationReference",
    title: "Potential duplicate requires review",
    message:
      "A similar notification reference was identified in the demonstration workflow and should be checked before issuance.",
    resolved: false,
    resolvedAt: null,
    resolvedByUserId: null,
    resolutionNote: null,
  },
];

/* =========================================================
   VALIDATION RESULTS
   ========================================================= */

const initialValidationResults: NotificationValidationResult[] = [
  {
    id: "VAL-001",
    notificationId: "NOTIF-001",
    status: "PASSED_WITH_WARNINGS",
    startedAt: "2026-08-29T10:10:00",
    completedAt: "2026-08-29T10:20:00",
    validatedByUserId: demoAcquisitionOfficer.userId,
    validatedByUserName: demoAcquisitionOfficer.name,
    findings: [
      initialValidationFindings[0],
      initialValidationFindings[1],
      initialValidationFindings[2],
    ],
    blockingFindingCount: 0,
    warningCount: 1,
    passed: true,
    summary:
      "Validation passed with one non-blocking supporting-document warning.",
  },

  {
    id: "VAL-002",
    notificationId: "NOTIF-002",
    status: "PASSED",
    startedAt: "2026-08-30T09:10:00",
    completedAt: "2026-08-30T09:18:00",
    validatedByUserId: demoAcquisitionOfficer.userId,
    validatedByUserName: demoAcquisitionOfficer.name,
    findings: [
      {
        ...initialValidationFindings[0],
        id: "VAL-FND-006",
      },
      {
        ...initialValidationFindings[1],
        id: "VAL-FND-007",
      },
    ],
    blockingFindingCount: 0,
    warningCount: 0,
    passed: true,
    summary:
      "Recipient and case references passed validation.",
  },

  {
    id: "VAL-003",
    notificationId: "NOTIF-003",
    status: "IN_PROGRESS",
    startedAt: "2026-08-31T11:00:00",
    completedAt: null,
    validatedByUserId: demoDistrictOfficer.userId,
    validatedByUserName: demoDistrictOfficer.name,
    findings: [
      {
        ...initialValidationFindings[0],
        id: "VAL-FND-008",
        resolved: true,
      },
      {
        ...initialValidationFindings[3],
        id: "VAL-FND-009",
      },
    ],
    blockingFindingCount: 1,
    warningCount: 0,
    passed: false,
    summary:
      "Validation is in progress and contains one blocking mandatory-field issue.",
  },

  {
    id: "VAL-004",
    notificationId: "NOTIF-004",
    status: "FAILED",
    startedAt: "2026-08-31T14:00:00",
    completedAt: "2026-08-31T14:08:00",
    validatedByUserId: demoAcquisitionOfficer.userId,
    validatedByUserName: demoAcquisitionOfficer.name,
    findings: [
      {
        ...initialValidationFindings[3],
        id: "VAL-FND-010",
      },
      {
        ...initialValidationFindings[4],
        id: "VAL-FND-011",
      },
    ],
    blockingFindingCount: 2,
    warningCount: 0,
    passed: false,
    summary:
      "Validation failed because required issuance information remains unresolved.",
  },

  {
    id: "VAL-005",
    notificationId: "NOTIF-005",
    status: "NOT_STARTED",
    startedAt: null,
    completedAt: null,
    validatedByUserId: null,
    validatedByUserName: null,
    findings: [],
    blockingFindingCount: 0,
    warningCount: 0,
    passed: false,
    summary:
      "Validation has not yet started.",
  },
];

/* =========================================================
   DEMO ACTION HISTORY
   ========================================================= */

const initialActionHistory: NotificationIssuanceActionRecord[] = [
  {
    id: "ISS-ACT-001",
    notificationId: "NOTIF-001",
    action: "START_VALIDATION",
    performedAt: "2026-08-29T10:10:00",
    actor: demoAcquisitionOfficer,
    previousStage: "VALIDATION_REQUIRED",
    newStage: "VALIDATION_IN_PROGRESS",
    reason:
      "Notification submitted for pre-issuance validation.",
    referenceNumber: "REQ-DEMO-ISS-001",
    auditEventId: "AUD-DEMO-ISS-001",
  },

  {
    id: "ISS-ACT-002",
    notificationId: "NOTIF-001",
    action: "COMPLETE_VALIDATION",
    performedAt: "2026-08-29T10:20:00",
    actor: demoAcquisitionOfficer,
    previousStage: "VALIDATION_IN_PROGRESS",
    newStage: "READY_FOR_ISSUANCE",
    reason:
      "Validation completed with one non-blocking warning.",
    referenceNumber: "REQ-DEMO-ISS-002",
    auditEventId: "AUD-DEMO-ISS-002",
  },

  {
    id: "ISS-ACT-003",
    notificationId: "NOTIF-002",
    action: "START_VALIDATION",
    performedAt: "2026-08-30T09:10:00",
    actor: demoAcquisitionOfficer,
    previousStage: "VALIDATION_REQUIRED",
    newStage: "VALIDATION_IN_PROGRESS",
    reason:
      "Hearing notification submitted for validation.",
    referenceNumber: "REQ-DEMO-ISS-003",
    auditEventId: "AUD-DEMO-ISS-003",
  },

  {
    id: "ISS-ACT-004",
    notificationId: "NOTIF-002",
    action: "COMPLETE_VALIDATION",
    performedAt: "2026-08-30T09:18:00",
    actor: demoAcquisitionOfficer,
    previousStage: "VALIDATION_IN_PROGRESS",
    newStage: "READY_FOR_ISSUANCE",
    reason:
      "Validation passed without findings.",
    referenceNumber: "REQ-DEMO-ISS-004",
    auditEventId: "AUD-DEMO-ISS-004",
  },

  {
    id: "ISS-ACT-005",
    notificationId: "NOTIF-003",
    action: "START_VALIDATION",
    performedAt: "2026-08-31T11:00:00",
    actor: demoDistrictOfficer,
    previousStage: "VALIDATION_REQUIRED",
    newStage: "VALIDATION_IN_PROGRESS",
    reason:
      "Award notification submitted for validation.",
    referenceNumber: "REQ-DEMO-ISS-005",
    auditEventId: "AUD-DEMO-ISS-005",
  },

  {
    id: "ISS-ACT-006",
    notificationId: "NOTIF-004",
    action: "REJECT_NOTIFICATION",
    performedAt: "2026-08-31T14:08:00",
    actor: demoAcquisitionOfficer,
    previousStage: "VALIDATION_IN_PROGRESS",
    newStage: "REJECTED",
    reason:
      "Required acknowledgement and duplicate checks failed.",
    referenceNumber: "REQ-DEMO-ISS-006",
    auditEventId: "AUD-DEMO-ISS-006",
  },
];

/* =========================================================
   INITIAL ISSUANCE RECORDS
   ========================================================= */

const initialIssuanceRecords: NotificationIssuanceRecord[] = [
  {
    id: "ISS-001",
    notificationId: "NOTIF-001",
    notificationReference: "AAKAR-NOT-2026-0001",
    stage: "READY_FOR_ISSUANCE",
    validationStatus: "PASSED_WITH_WARNINGS",
    validationResultId: "VAL-001",
    issuer: null,
    createdAt: "2026-08-29T10:05:00",
    updatedAt: "2026-08-29T10:20:00",
    readyForIssuanceAt: "2026-08-29T10:20:00",
    issuedAt: null,
    issuanceReference: null,
    rejectedAt: null,
    rejectionReason: null,
    rejectionNote: null,
    cancelledAt: null,
    cancellationReason: null,
    cancellationNote: null,
    actionHistory: [
      initialActionHistory[0],
      initialActionHistory[1],
    ],
    auditEventIds: [
      "AUD-DEMO-ISS-001",
      "AUD-DEMO-ISS-002",
    ],
  },

  {
    id: "ISS-002",
    notificationId: "NOTIF-002",
    notificationReference: "AAKAR-NOT-2026-0002",
    stage: "READY_FOR_ISSUANCE",
    validationStatus: "PASSED",
    validationResultId: "VAL-002",
    issuer: null,
    createdAt: "2026-08-30T09:05:00",
    updatedAt: "2026-08-30T09:18:00",
    readyForIssuanceAt: "2026-08-30T09:18:00",
    issuedAt: null,
    issuanceReference: null,
    rejectedAt: null,
    rejectionReason: null,
    rejectionNote: null,
    cancelledAt: null,
    cancellationReason: null,
    cancellationNote: null,
    actionHistory: [
      initialActionHistory[2],
      initialActionHistory[3],
    ],
    auditEventIds: [
      "AUD-DEMO-ISS-003",
      "AUD-DEMO-ISS-004",
    ],
  },

  {
    id: "ISS-003",
    notificationId: "NOTIF-003",
    notificationReference: "AAKAR-NOT-2026-0003",
    stage: "VALIDATION_IN_PROGRESS",
    validationStatus: "IN_PROGRESS",
    validationResultId: "VAL-003",
    issuer: null,
    createdAt: "2026-08-31T10:50:00",
    updatedAt: "2026-08-31T11:00:00",
    readyForIssuanceAt: null,
    issuedAt: null,
    issuanceReference: null,
    rejectedAt: null,
    rejectionReason: null,
    rejectionNote: null,
    cancelledAt: null,
    cancellationReason: null,
    cancellationNote: null,
    actionHistory: [initialActionHistory[4]],
    auditEventIds: ["AUD-DEMO-ISS-005"],
  },

  {
    id: "ISS-004",
    notificationId: "NOTIF-004",
    notificationReference: "AAKAR-NOT-2026-0004",
    stage: "REJECTED",
    validationStatus: "FAILED",
    validationResultId: "VAL-004",
    issuer: null,
    createdAt: "2026-08-31T13:50:00",
    updatedAt: "2026-08-31T14:08:00",
    readyForIssuanceAt: null,
    issuedAt: null,
    issuanceReference: null,
    rejectedAt: "2026-08-31T14:08:00",
    rejectionReason: "VALIDATION_FAILED",
    rejectionNote:
      "Blocking validation findings were not resolved.",
    cancelledAt: null,
    cancellationReason: null,
    cancellationNote: null,
    actionHistory: [initialActionHistory[5]],
    auditEventIds: ["AUD-DEMO-ISS-006"],
  },

  {
    id: "ISS-005",
    notificationId: "NOTIF-005",
    notificationReference: "AAKAR-NOT-2026-0005",
    stage: "VALIDATION_REQUIRED",
    validationStatus: "NOT_STARTED",
    validationResultId: "VAL-005",
    issuer: null,
    createdAt: "2026-09-01T09:00:00",
    updatedAt: "2026-09-01T09:00:00",
    readyForIssuanceAt: null,
    issuedAt: null,
    issuanceReference: null,
    rejectedAt: null,
    rejectionReason: null,
    rejectionNote: null,
    cancelledAt: null,
    cancellationReason: null,
    cancellationNote: null,
    actionHistory: [],
    auditEventIds: [],
  },

  {
    id: "ISS-006",
    notificationId: "NOTIF-006",
    notificationReference: "AAKAR-NOT-2026-0006",
    stage: "ISSUED",
    validationStatus: "PASSED",
    validationResultId: null,
    issuer: demoDistrictOfficer,
    createdAt: "2026-08-25T09:00:00",
    updatedAt: "2026-08-25T09:25:00",
    readyForIssuanceAt: "2026-08-25T09:15:00",
    issuedAt: "2026-08-25T09:25:00",
    issuanceReference: "AAKAR-ISS-2026-0006",
    rejectedAt: null,
    rejectionReason: null,
    rejectionNote: null,
    cancelledAt: null,
    cancellationReason: null,
    cancellationNote: null,
    actionHistory: [],
    auditEventIds: ["AUD-DEMO-ISS-007"],
  },
];

/* =========================================================
   IN-MEMORY STATE
   ========================================================= */

let issuanceRecords = [...initialIssuanceRecords];

let validationResults = [...initialValidationResults];

/* =========================================================
   HELPERS
   ========================================================= */

function generateIssuanceId(): string {
  return `ISS-${Date.now().toString().slice(-8)}`;
}

function generateValidationId(): string {
  return `VAL-${Date.now().toString().slice(-8)}`;
}

function generateFindingId(): string {
  return `VAL-FND-${Date.now().toString().slice(-8)}`;
}

function generateActionId(): string {
  return `ISS-ACT-${Date.now().toString().slice(-8)}`;
}

function generateIssuanceReference(): string {
  return `AAKAR-ISS-${new Date().getFullYear()}-${Date.now()
    .toString()
    .slice(-6)}`;
}

function generateAuditReference(): string {
  return `AUD-DEMO-ISS-${Date.now()
    .toString()
    .slice(-8)}`;
}

/* =========================================================
   SUMMARY
   ========================================================= */

function calculateSummary() {
  const blockingValidationIssues =
    validationResults.reduce(
      (total, result) =>
        total + result.blockingFindingCount,
      0,
    );

  const awaitingOfficerAction =
    issuanceRecords.filter(
      (record) =>
        record.stage ===
          "READY_FOR_ISSUANCE" ||
        record.stage ===
          "VALIDATION_REQUIRED" ||
        record.stage ===
          "ISSUANCE_FAILED",
    ).length;

  return {
    total: issuanceRecords.length,

    drafts: issuanceRecords.filter(
      (record) =>
        record.stage === "DRAFT",
    ).length,

    validationRequired:
      issuanceRecords.filter(
        (record) =>
          record.stage ===
          "VALIDATION_REQUIRED",
      ).length,

    validationInProgress:
      issuanceRecords.filter(
        (record) =>
          record.stage ===
          "VALIDATION_IN_PROGRESS",
      ).length,

    readyForIssuance:
      issuanceRecords.filter(
        (record) =>
          record.stage ===
          "READY_FOR_ISSUANCE",
      ).length,

    issuanceInProgress:
      issuanceRecords.filter(
        (record) =>
          record.stage ===
          "ISSUANCE_IN_PROGRESS",
      ).length,

    issued: issuanceRecords.filter(
      (record) =>
        record.stage === "ISSUED",
    ).length,

    issuanceFailed:
      issuanceRecords.filter(
        (record) =>
          record.stage ===
          "ISSUANCE_FAILED",
      ).length,

    rejected: issuanceRecords.filter(
      (record) =>
        record.stage === "REJECTED",
    ).length,

    cancelled: issuanceRecords.filter(
      (record) =>
        record.stage === "CANCELLED",
    ).length,

    blockingValidationIssues,

    awaitingOfficerAction,
  };
}

/* =========================================================
   DATASET
   ========================================================= */

export function getNotificationIssuanceDataset(): NotificationIssuanceDataset {
  return {
    records: [...issuanceRecords],
    validationResults: [...validationResults],
    summary: calculateSummary(),
  };
}

/* =========================================================
   ISSUANCE LOOKUPS
   ========================================================= */

export function getNotificationIssuanceRecords(): NotificationIssuanceRecord[] {
  return [...issuanceRecords];
}

export function getNotificationIssuanceById(
  id: string,
): NotificationIssuanceRecord | undefined {
  return issuanceRecords.find(
    (record) => record.id === id,
  );
}

export function getNotificationIssuanceByNotificationId(
  notificationId: string,
): NotificationIssuanceRecord | undefined {
  return issuanceRecords.find(
    (record) =>
      record.notificationId ===
      notificationId,
  );
}

export function getNotificationIssuanceByStage(
  stage: NotificationIssuanceStage,
): NotificationIssuanceRecord[] {
  return issuanceRecords.filter(
    (record) =>
      record.stage === stage,
  );
}

export function getNotificationValidationResult(
  notificationId: string,
): NotificationValidationResult | undefined {
  return validationResults.find(
    (result) =>
      result.notificationId ===
      notificationId,
  );
}

/* =========================================================
   VALIDATION LOOKUPS
   ========================================================= */

export function getNotificationValidationResults(): NotificationValidationResult[] {
  return [...validationResults];
}

export function getBlockingValidationResults(): NotificationValidationResult[] {
  return validationResults.filter(
    (result) =>
      result.blockingFindingCount > 0,
  );
}

/* =========================================================
   CREATE
   ========================================================= */

export function createNotificationIssuance(
  input: CreateNotificationIssuanceInput,
): NotificationIssuanceRecord {
  const now = new Date().toISOString();

  const record: NotificationIssuanceRecord = {
    id: generateIssuanceId(),

    notificationId:
      input.notificationId,

    notificationReference:
      input.notificationReference,

    stage:
      input.initialStage ??
      "VALIDATION_REQUIRED",

    validationStatus: "NOT_STARTED",

    validationResultId: null,

    issuer: null,

    createdAt: now,

    updatedAt: now,

    readyForIssuanceAt: null,

    issuedAt: null,

    issuanceReference: null,

    rejectedAt: null,

    rejectionReason: null,

    rejectionNote: null,

    cancelledAt: null,

    cancellationReason: null,

    cancellationNote: null,

    actionHistory: [],

    auditEventIds: [],
  };

  issuanceRecords = [
    ...issuanceRecords,
    record,
  ];

  return record;
}

/* =========================================================
   UPDATE
   ========================================================= */

export function updateNotificationIssuance(
  id: string,
  input: UpdateNotificationIssuanceInput,
): NotificationIssuanceRecord | undefined {
  const index =
    issuanceRecords.findIndex(
      (record) => record.id === id,
    );

  if (index === -1) {
    return undefined;
  }

  const current =
    issuanceRecords[index];

  const updated: NotificationIssuanceRecord =
    {
      ...current,
      ...input,
      updatedAt:
        new Date().toISOString(),
    };

  issuanceRecords = [
    ...issuanceRecords.slice(0, index),
    updated,
    ...issuanceRecords.slice(index + 1),
  ];

  return updated;
}

/* =========================================================
   VALIDATION RESULT CREATION
   ========================================================= */

export function createNotificationValidationResult(
  notificationId: string,
  validatedBy?: NotificationIssuanceActor,
): NotificationValidationResult {
  const now = new Date().toISOString();

  const result: NotificationValidationResult =
    {
      id: generateValidationId(),

      notificationId,

      status: "IN_PROGRESS",

      startedAt: now,

      completedAt: null,

      validatedByUserId:
        validatedBy?.userId ?? null,

      validatedByUserName:
        validatedBy?.name ?? null,

      findings: [],

      blockingFindingCount: 0,

      warningCount: 0,

      passed: false,

      summary:
        "Validation has started.",
    };

  validationResults = [
    ...validationResults,
    result,
  ];

  return result;
}

/* =========================================================
   ADD VALIDATION FINDING
   ========================================================= */

export function addNotificationValidationFinding(
  input: AddNotificationValidationFindingInput,
): NotificationValidationFinding {
  const resultIndex =
    validationResults.findIndex(
      (result) =>
        result.notificationId ===
        input.notificationId,
    );

  const finding: NotificationValidationFinding =
    {
      id: generateFindingId(),

      category: input.category,

      severity: input.severity,

      field: input.field,

      title: input.title,

      message: input.message,

      resolved: false,

      resolvedAt: null,

      resolvedByUserId: null,

      resolutionNote: null,
    };

  if (resultIndex === -1) {
    const result: NotificationValidationResult =
      {
        id: generateValidationId(),

        notificationId:
          input.notificationId,

        status: "IN_PROGRESS",

        startedAt:
          new Date().toISOString(),

        completedAt: null,

        validatedByUserId: null,

        validatedByUserName: null,

        findings: [finding],

        blockingFindingCount:
          input.severity === "ERROR" ||
          input.severity === "CRITICAL"
            ? 1
            : 0,

        warningCount:
          input.severity === "WARNING"
            ? 1
            : 0,

        passed: false,

        summary:
          "Validation contains unresolved findings.",
      };

    validationResults = [
      ...validationResults,
      result,
    ];

    return finding;
  }

  const current =
    validationResults[resultIndex];

  const findings = [
    ...current.findings,
    finding,
  ];

  const blockingFindingCount =
    findings.filter(
      (item) =>
        !item.resolved &&
        (item.severity === "ERROR" ||
          item.severity ===
            "CRITICAL"),
    ).length;

  const warningCount =
    findings.filter(
      (item) =>
        !item.resolved &&
        item.severity === "WARNING",
    ).length;

  validationResults = [
    ...validationResults.slice(
      0,
      resultIndex,
    ),
    {
      ...current,
      findings,
      blockingFindingCount,
      warningCount,
      passed:
        blockingFindingCount === 0,
      summary:
        blockingFindingCount > 0
          ? "Validation contains blocking findings."
          : warningCount > 0
            ? "Validation passed with warnings."
            : "Validation passed.",
    },
    ...validationResults.slice(
      resultIndex + 1,
    ),
  ];

  return finding;
}

/* =========================================================
   RESOLVE VALIDATION FINDING
   ========================================================= */

export function resolveNotificationValidationFinding(
  input: ResolveNotificationValidationFindingInput,
): NotificationValidationFinding | undefined {
  for (
    let resultIndex = 0;
    resultIndex < validationResults.length;
    resultIndex += 1
  ) {
    const result =
      validationResults[resultIndex];

    const findingIndex =
      result.findings.findIndex(
        (finding) =>
          finding.id ===
          input.findingId,
      );

    if (findingIndex === -1) {
      continue;
    }

    const currentFinding =
      result.findings[findingIndex];

    const updatedFinding: NotificationValidationFinding =
      {
        ...currentFinding,

        resolved: true,

        resolvedAt:
          new Date().toISOString(),

        resolvedByUserId:
          input.resolvedByUserId,

        resolutionNote:
          input.resolutionNote,
      };

    const findings = [
      ...result.findings.slice(
        0,
        findingIndex,
      ),
      updatedFinding,
      ...result.findings.slice(
        findingIndex + 1,
      ),
    ];

    const blockingFindingCount =
      findings.filter(
        (item) =>
          !item.resolved &&
          (item.severity === "ERROR" ||
            item.severity ===
              "CRITICAL"),
      ).length;

    const warningCount =
      findings.filter(
        (item) =>
          !item.resolved &&
          item.severity === "WARNING",
      ).length;

    validationResults = [
      ...validationResults.slice(
        0,
        resultIndex,
      ),
      {
        ...result,
        findings,
        blockingFindingCount,
        warningCount,
        passed:
          blockingFindingCount === 0,
        summary:
          blockingFindingCount > 0
            ? "Validation contains blocking findings."
            : warningCount > 0
              ? "Validation passed with warnings."
              : "Validation passed.",
      },
      ...validationResults.slice(
        resultIndex + 1,
      ),
    ];

    return updatedFinding;
  }

  return undefined;
}

/* =========================================================
   COMPLETE VALIDATION
   ========================================================= */

export function completeNotificationValidation(
  notificationId: string,
  actor: NotificationIssuanceActor,
): NotificationValidationResult | undefined {
  const index =
    validationResults.findIndex(
      (result) =>
        result.notificationId ===
        notificationId,
    );

  if (index === -1) {
    return undefined;
  }

  const current =
    validationResults[index];

  const blockingFindingCount =
    current.findings.filter(
      (finding) =>
        !finding.resolved &&
        (finding.severity === "ERROR" ||
          finding.severity ===
            "CRITICAL"),
    ).length;

  const warningCount =
    current.findings.filter(
      (finding) =>
        !finding.resolved &&
        finding.severity ===
          "WARNING",
    ).length;

  const status =
    blockingFindingCount > 0
      ? "FAILED"
      : warningCount > 0
        ? "PASSED_WITH_WARNINGS"
        : "PASSED";

  const result: NotificationValidationResult =
    {
      ...current,

      status,

      completedAt:
        new Date().toISOString(),

      validatedByUserId:
        actor.userId,

      validatedByUserName:
        actor.name,

      blockingFindingCount,

      warningCount,

      passed:
        blockingFindingCount === 0,

      summary:
        blockingFindingCount > 0
          ? "Validation failed because blocking findings remain unresolved."
          : warningCount > 0
            ? "Validation passed with warnings."
            : "Validation passed successfully.",
    };

  validationResults = [
    ...validationResults.slice(
      0,
      index,
    ),
    result,
    ...validationResults.slice(
      index + 1,
    ),
  ];

  return result;
}

/* =========================================================
   RECORD ACTION
   ========================================================= */

export function recordNotificationIssuanceAction(
  input: RecordNotificationIssuanceActionInput,
): NotificationIssuanceActionRecord {
  const action: NotificationIssuanceActionRecord =
    {
      id: generateActionId(),

      notificationId:
        input.notificationId,

      action: input.action,

      performedAt:
        new Date().toISOString(),

      actor: input.actor,

      previousStage:
        input.previousStage,

      newStage:
        input.newStage,

      reason:
        input.reason ?? null,

      referenceNumber:
        input.referenceNumber ??
        generateAuditReference(),

      auditEventId:
        input.auditEventId ??
        generateAuditReference(),
    };

  const recordIndex =
    issuanceRecords.findIndex(
      (record) =>
        record.notificationId ===
        input.notificationId,
    );

  if (recordIndex !== -1) {
    const current =
      issuanceRecords[recordIndex];

    issuanceRecords = [
      ...issuanceRecords.slice(
        0,
        recordIndex,
      ),
      {
        ...current,

        updatedAt:
          new Date().toISOString(),

        actionHistory: [
          ...current.actionHistory,
          action,
        ],

        auditEventIds: [
          ...current.auditEventIds,
          action.auditEventId ??
            generateAuditReference(),
        ],
      },
      ...issuanceRecords.slice(
        recordIndex + 1,
      ),
    ];
  }

  return action;
}

/* =========================================================
   CONTROLLED WORKFLOW OPERATIONS
   ========================================================= */

export function startNotificationValidation(
  notificationId: string,
  actor: NotificationIssuanceActor,
): NotificationIssuanceRecord | undefined {
  const record =
    getNotificationIssuanceByNotificationId(
      notificationId,
    );

  if (!record) {
    return undefined;
  }

  if (
    record.stage !==
    "VALIDATION_REQUIRED"
  ) {
    return record;
  }

  let validation =
    getNotificationValidationResult(
      notificationId,
    );

  if (!validation) {
    validation =
      createNotificationValidationResult(
        notificationId,
        actor,
      );
  }

  const updated =
    updateNotificationIssuance(
      record.id,
      {
        stage:
          "VALIDATION_IN_PROGRESS",
        validationStatus:
          "IN_PROGRESS",
        validationResultId:
          validation.id,
      },
    );

  if (!updated) {
    return undefined;
  }

  recordNotificationIssuanceAction(
    {
      notificationId,
      action: "START_VALIDATION",
      actor,
      previousStage:
        record.stage,
      newStage:
        "VALIDATION_IN_PROGRESS",
      reason:
        "Notification submitted for pre-issuance validation.",
    },
  );

  return getNotificationIssuanceById(
    record.id,
  );
}

export function markNotificationReadyForIssuance(
  notificationId: string,
  actor: NotificationIssuanceActor,
): NotificationIssuanceRecord | undefined {
  const record =
    getNotificationIssuanceByNotificationId(
      notificationId,
    );

  if (!record) {
    return undefined;
  }

  const validation =
    getNotificationValidationResult(
      notificationId,
    );

  if (
    !validation ||
    !validation.passed
  ) {
    return record;
  }

  if (
    record.stage !==
    "VALIDATION_IN_PROGRESS"
  ) {
    return record;
  }

  const now =
    new Date().toISOString();

  const updated =
    updateNotificationIssuance(
      record.id,
      {
        stage:
          "READY_FOR_ISSUANCE",
        validationStatus:
          validation.status,
        validationResultId:
          validation.id,
        readyForIssuanceAt: now,
      },
    );

  if (!updated) {
    return undefined;
  }

  recordNotificationIssuanceAction(
    {
      notificationId,
      action:
        "MARK_READY_FOR_ISSUANCE",
      actor,
      previousStage:
        record.stage,
      newStage:
        "READY_FOR_ISSUANCE",
      reason:
        "Validation passed and the notification is ready for controlled issuance.",
    },
  );

  return getNotificationIssuanceById(
    record.id,
  );
}

export function issueNotification(
  notificationId: string,
  actor: NotificationIssuanceActor,
): NotificationIssuanceRecord | undefined {
  const record =
    getNotificationIssuanceByNotificationId(
      notificationId,
    );

  if (!record) {
    return undefined;
  }

  if (
    record.stage !==
    "READY_FOR_ISSUANCE"
  ) {
    return record;
  }

  const validation =
    getNotificationValidationResult(
      notificationId,
    );

  if (
    validation &&
    !validation.passed
  ) {
    return record;
  }

  const now =
    new Date().toISOString();

  const issuanceReference =
    generateIssuanceReference();

  const updated =
    updateNotificationIssuance(
      record.id,
      {
        stage: "ISSUED",
        validationStatus:
          validation?.status ??
          "PASSED",
        issuer: actor,
        issuedAt: now,
        issuanceReference,
      },
    );

  if (!updated) {
    return undefined;
  }

  recordNotificationIssuanceAction(
    {
      notificationId,
      action:
        "ISSUE_NOTIFICATION",
      actor,
      previousStage:
        record.stage,
      newStage: "ISSUED",
      reason:
        "Authorized officer completed controlled notification issuance.",
      referenceNumber:
        issuanceReference,
    },
  );

  return getNotificationIssuanceById(
    record.id,
  );
}

export function rejectNotificationIssuance(
  notificationId: string,
  actor: NotificationIssuanceActor,
  reason: string,
): NotificationIssuanceRecord | undefined {
  const record =
    getNotificationIssuanceByNotificationId(
      notificationId,
    );

  if (!record) {
    return undefined;
  }

  const now =
    new Date().toISOString();

  const updated =
    updateNotificationIssuance(
      record.id,
      {
        stage: "REJECTED",
        rejectedAt: now,
        rejectionReason:
          "OTHER",
        rejectionNote: reason,
      },
    );

  if (!updated) {
    return undefined;
  }

  recordNotificationIssuanceAction(
    {
      notificationId,
      action:
        "REJECT_NOTIFICATION",
      actor,
      previousStage:
        record.stage,
      newStage: "REJECTED",
      reason,
    },
  );

  return getNotificationIssuanceById(
    record.id,
  );
}

export function cancelNotificationIssuance(
  notificationId: string,
  actor: NotificationIssuanceActor,
  reason: string,
): NotificationIssuanceRecord | undefined {
  const record =
    getNotificationIssuanceByNotificationId(
      notificationId,
    );

  if (!record) {
    return undefined;
  }

  const now =
    new Date().toISOString();

  const updated =
    updateNotificationIssuance(
      record.id,
      {
        stage: "CANCELLED",
        cancelledAt: now,
        cancellationReason:
          "OTHER",
        cancellationNote: reason,
      },
    );

  if (!updated) {
    return undefined;
  }

  recordNotificationIssuanceAction(
    {
      notificationId,
      action:
        "CANCEL_NOTIFICATION",
      actor,
      previousStage:
        record.stage,
      newStage: "CANCELLED",
      reason,
    },
  );

  return getNotificationIssuanceById(
    record.id,
  );
}

/* =========================================================
   RESET DEMO STATE
   ========================================================= */

export function resetNotificationIssuanceData(): void {
  issuanceRecords = [
    ...initialIssuanceRecords,
  ];

  validationResults = [
    ...initialValidationResults,
  ];
}