import type {
  CreateNotificationAcknowledgementInput,
  CreateNotificationDeliveryAttemptInput,
  CreateNotificationDeliveryInput,
  NotificationAcknowledgement,
  NotificationDeliveryAction,
  NotificationDeliveryActionRecord,
  NotificationDeliveryActor,
  NotificationDeliveryAttempt,
  NotificationDeliveryDataset,
  NotificationDeliveryFailureReason,
  NotificationDeliveryPriority,
  NotificationDeliveryRecord,
  NotificationDeliveryRecipient,
  NotificationDeliveryStatus,
  UpdateNotificationDeliveryAttemptInput,
  UpdateNotificationDeliveryInput,
} from "../types/notificationDelivery";

const now = new Date();

const iso = (offsetMinutes = 0): string =>
  new Date(now.getTime() + offsetMinutes * 60 * 1000).toISOString();

const demoRecipients: NotificationDeliveryRecipient[] = [
  {
    id: "RECIP-001",
    notificationId: "NOTIF-001",
    recipientType: "RECORDED_OWNER",
    recipientName: "Ramesh Patil",
    maskedContact: "+91 ******4821",
    deliveryChannels: ["PORTAL", "SMS"],
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-15T23:59:59+05:30",
    sensitivity: "STANDARD",
  },
  {
    id: "RECIP-002",
    notificationId: "NOTIF-002",
    recipientType: "RIGHT_HOLDER",
    recipientName: "Sunita Jadhav",
    maskedContact: "+91 ******7314",
    deliveryChannels: ["PORTAL", "SMS"],
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-18T23:59:59+05:30",
    sensitivity: "STANDARD",
  },
  {
    id: "RECIP-003",
    notificationId: "NOTIF-003",
    recipientType: "RECORDED_OWNER",
    recipientName: "Mahesh Shinde",
    maskedContact: "+91 ******1962",
    deliveryChannels: ["PORTAL", "EMAIL"],
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-20T23:59:59+05:30",
    sensitivity: "RESTRICTED",
  },
  {
    id: "RECIP-004",
    notificationId: "NOTIF-004",
    recipientType: "AUTHORIZED_REPRESENTATIVE",
    recipientName: "Pune Infrastructure Legal Cell",
    maskedContact: "legal-*****@gov.in",
    deliveryChannels: ["PORTAL", "EMAIL"],
    acknowledgementRequired: false,
    sensitivity: "RESTRICTED",
  },
  {
    id: "RECIP-005",
    notificationId: "NOTIF-005",
    recipientType: "RIGHT_HOLDER",
    recipientName: "Vijay More",
    maskedContact: "+91 ******9045",
    deliveryChannels: ["POSTAL", "FIELD_SERVICE"],
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-25T23:59:59+05:30",
    sensitivity: "SENSITIVE",
  },
  {
    id: "RECIP-006",
    notificationId: "NOTIF-006",
    recipientType: "RECORDED_OWNER",
    recipientName: "Asha Kulkarni",
    maskedContact: "+91 ******6248",
    deliveryChannels: ["PORTAL", "SMS"],
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-12T23:59:59+05:30",
    sensitivity: "STANDARD",
  },
];

const demoAttempts: NotificationDeliveryAttempt[] = [
  {
    id: "ATT-001",
    notificationId: "NOTIF-001",
    recipientId: "RECIP-001",
    channel: "PORTAL",
    attemptNumber: 1,
    status: "DELIVERED",
    requestedAt: iso(-420),
    startedAt: iso(-415),
    completedAt: iso(-414),
    providerReference: "DEMO-PORTAL-0001",
    responseReference: "PORTAL-ACK-WAITING",
  },
  {
    id: "ATT-002",
    notificationId: "NOTIF-001",
    recipientId: "RECIP-001",
    channel: "SMS",
    attemptNumber: 1,
    status: "DELIVERY_FAILED",
    requestedAt: iso(-400),
    startedAt: iso(-399),
    completedAt: iso(-398),
    providerReference: "DEMO-SMS-0001",
    failureReason: "PROVIDER_ERROR",
    failureMessage: "Demo SMS provider returned a simulated delivery failure.",
  },
  {
    id: "ATT-003",
    notificationId: "NOTIF-002",
    recipientId: "RECIP-002",
    channel: "PORTAL",
    attemptNumber: 1,
    status: "DELIVERED",
    requestedAt: iso(-360),
    startedAt: iso(-359),
    completedAt: iso(-358),
    providerReference: "DEMO-PORTAL-0002",
  },
  {
    id: "ATT-004",
    notificationId: "NOTIF-002",
    recipientId: "RECIP-002",
    channel: "SMS",
    attemptNumber: 1,
    status: "DELIVERED",
    requestedAt: iso(-340),
    startedAt: iso(-339),
    completedAt: iso(-338),
    providerReference: "DEMO-SMS-0002",
  },
  {
    id: "ATT-005",
    notificationId: "NOTIF-003",
    recipientId: "RECIP-003",
    channel: "PORTAL",
    attemptNumber: 1,
    status: "QUEUED",
    requestedAt: iso(-120),
  },
  {
    id: "ATT-006",
    notificationId: "NOTIF-004",
    recipientId: "RECIP-004",
    channel: "EMAIL",
    attemptNumber: 1,
    status: "DELIVERY_FAILED",
    requestedAt: iso(-300),
    startedAt: iso(-299),
    completedAt: iso(-298),
    providerReference: "DEMO-EMAIL-0001",
    failureReason: "UNAUTHORIZED_CHANNEL",
    failureMessage:
      "Notification is not currently authorized for external email delivery.",
  },
  {
    id: "ATT-007",
    notificationId: "NOTIF-005",
    recipientId: "RECIP-005",
    channel: "POSTAL",
    attemptNumber: 1,
    status: "IN_PROGRESS",
    requestedAt: iso(-90),
    startedAt: iso(-85),
    providerReference: "DEMO-POST-0001",
  },
  {
    id: "ATT-008",
    notificationId: "NOTIF-006",
    recipientId: "RECIP-006",
    channel: "PORTAL",
    attemptNumber: 1,
    status: "DELIVERED",
    requestedAt: iso(-500),
    startedAt: iso(-495),
    completedAt: iso(-494),
    providerReference: "DEMO-PORTAL-0006",
  },
  {
    id: "ATT-009",
    notificationId: "NOTIF-006",
    recipientId: "RECIP-006",
    channel: "SMS",
    attemptNumber: 1,
    status: "DELIVERED",
    requestedAt: iso(-480),
    startedAt: iso(-479),
    completedAt: iso(-478),
    providerReference: "DEMO-SMS-0006",
  },
];

const demoAcknowledgements: NotificationAcknowledgement[] = [
  {
    id: "ACK-001",
    notificationId: "NOTIF-001",
    recipientId: "RECIP-001",
    status: "PENDING",
  },
  {
    id: "ACK-002",
    notificationId: "NOTIF-002",
    recipientId: "RECIP-002",
    status: "ACKNOWLEDGED",
    method: "OTP",
    acknowledgedAt: iso(-250),
    acknowledgementReference: "ACK-DEMO-002",
  },
  {
    id: "ACK-003",
    notificationId: "NOTIF-003",
    recipientId: "RECIP-003",
    status: "PENDING",
  },
  {
    id: "ACK-004",
    notificationId: "NOTIF-004",
    recipientId: "RECIP-004",
    status: "NOT_REQUIRED",
  },
  {
    id: "ACK-005",
    notificationId: "NOTIF-005",
    recipientId: "RECIP-005",
    status: "PENDING",
  },
  {
    id: "ACK-006",
    notificationId: "NOTIF-006",
    recipientId: "RECIP-006",
    status: "ACKNOWLEDGED",
    method: "PORTAL",
    acknowledgedAt: iso(-180),
    acknowledgementReference: "ACK-DEMO-006",
  },
];

const deriveDeliveryStatus = (
  attempts: NotificationDeliveryAttempt[],
): NotificationDeliveryStatus => {
  if (attempts.length === 0) {
    return "NOT_STARTED";
  }

  if (attempts.some((attempt) => attempt.status === "DELIVERED")) {
    return "DELIVERED";
  }

  if (attempts.some((attempt) => attempt.status === "IN_PROGRESS")) {
    return "IN_PROGRESS";
  }

  if (attempts.some((attempt) => attempt.status === "QUEUED")) {
    return "QUEUED";
  }

  if (
    attempts.some(
      (attempt) => attempt.status === "DELIVERY_RETRY_PENDING",
    )
  ) {
    return "DELIVERY_RETRY_PENDING";
  }

  if (attempts.every((attempt) => attempt.status === "CANCELLED")) {
    return "CANCELLED";
  }

  if (attempts.some((attempt) => attempt.status === "DELIVERY_FAILED")) {
    return "DELIVERY_FAILED";
  }

  return "NOT_STARTED";
};

const createDeliveryRecord = (
  notificationId: string,
  issuanceId: string,
  priority: NotificationDeliveryPriority,
  recipientIds: string[],
): NotificationDeliveryRecord => {
  const recipients = demoRecipients.filter(
    (recipient) =>
      recipient.notificationId === notificationId &&
      recipientIds.includes(recipient.id),
  );

  const attempts = demoAttempts.filter(
    (attempt) =>
      attempt.notificationId === notificationId &&
      recipientIds.includes(attempt.recipientId),
  );

  const acknowledgements = demoAcknowledgements.filter(
    (acknowledgement) =>
      acknowledgement.notificationId === notificationId &&
      recipientIds.includes(acknowledgement.recipientId),
  );

  const status = deriveDeliveryStatus(attempts);

  return {
    id: `DEL-${notificationId.replace("NOTIF-", "")}`,
    notificationId,
    issuanceId,
    priority,
    status,
    recipients,
    attempts,
    acknowledgements,
    createdAt: iso(-600),
    updatedAt: iso(-10),
    lastAttemptAt:
      attempts.length > 0
        ? attempts
            .map((attempt) => attempt.completedAt ?? attempt.requestedAt)
            .sort()
            .at(-1)
        : undefined,
    nextRetryAt:
      attempts.some((attempt) => attempt.status === "DELIVERY_FAILED")
        ? iso(120)
        : undefined,
  };
};

const initialDeliveryRecords: NotificationDeliveryRecord[] = [
  createDeliveryRecord("NOTIF-001", "ISS-001", "HIGH", ["RECIP-001"]),
  createDeliveryRecord("NOTIF-002", "ISS-002", "NORMAL", ["RECIP-002"]),
  createDeliveryRecord("NOTIF-003", "ISS-003", "URGENT", ["RECIP-003"]),
  createDeliveryRecord("NOTIF-004", "ISS-004", "HIGH", ["RECIP-004"]),
  createDeliveryRecord("NOTIF-005", "ISS-005", "NORMAL", ["RECIP-005"]),
  createDeliveryRecord("NOTIF-006", "ISS-006", "URGENT", ["RECIP-006"]),
];

const calculateSummary = (
  records: NotificationDeliveryRecord[],
): NotificationDeliveryDataset["summary"] => ({
  total: records.length,
  notStarted: records.filter((record) => record.status === "NOT_STARTED")
    .length,
  queued: records.filter((record) => record.status === "QUEUED").length,
  inProgress: records.filter((record) => record.status === "IN_PROGRESS")
    .length,
  delivered: records.filter((record) => record.status === "DELIVERED").length,
  failed: records.filter((record) => record.status === "DELIVERY_FAILED")
    .length,
  retryPending: records.filter(
    (record) => record.status === "DELIVERY_RETRY_PENDING",
  ).length,
  cancelled: records.filter((record) => record.status === "CANCELLED")
    .length,
  acknowledgementPending: records.reduce(
    (count, record) =>
      count +
      record.acknowledgements.filter(
        (acknowledgement) => acknowledgement.status === "PENDING",
      ).length,
    0,
  ),
  acknowledgementReceived: records.reduce(
    (count, record) =>
      count +
      record.acknowledgements.filter(
        (acknowledgement) => acknowledgement.status === "ACKNOWLEDGED",
      ).length,
    0,
  ),
});

let deliveryRecords: NotificationDeliveryRecord[] = structuredClone(
  initialDeliveryRecords,
);

let deliveryActions: NotificationDeliveryActionRecord[] = [];

const clone = <T>(value: T): T => structuredClone(value);

const generateId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const refreshRecord = (record: NotificationDeliveryRecord): void => {
  record.updatedAt = new Date().toISOString();
  record.status = deriveDeliveryStatus(record.attempts);

  const completedAttempts = record.attempts.filter(
    (attempt) =>
      attempt.completedAt !== undefined ||
      attempt.status === "DELIVERED" ||
      attempt.status === "DELIVERY_FAILED" ||
      attempt.status === "CANCELLED",
  );

  record.lastAttemptAt =
    completedAttempts.length > 0
      ? completedAttempts
          .map((attempt) => attempt.completedAt ?? attempt.requestedAt)
          .sort()
          .at(-1)
      : record.lastAttemptAt;
};

export const getNotificationDeliveryDataset =
  (): NotificationDeliveryDataset => {
    const records = clone(deliveryRecords);

    return {
      records,
      summary: calculateSummary(records),
    };
  };

export const getNotificationDeliveryRecords =
  (): NotificationDeliveryRecord[] => clone(deliveryRecords);

export const getNotificationDeliveryById = (
  deliveryId: string,
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  return record ? clone(record) : undefined;
};

export const getNotificationDeliveryByNotificationId = (
  notificationId: string,
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find(
    (item) => item.notificationId === notificationId,
  );

  return record ? clone(record) : undefined;
};

export const getNotificationDeliveryByStatus = (
  status: NotificationDeliveryStatus,
): NotificationDeliveryRecord[] =>
  deliveryRecords
    .filter((record) => record.status === status)
    .map(clone);

export const getNotificationDeliveryAttempts = (
  deliveryId: string,
): NotificationDeliveryAttempt[] => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  return record ? clone(record.attempts) : [];
};

export const getNotificationDeliveryAttemptById = (
  attemptId: string,
): NotificationDeliveryAttempt | undefined => {
  for (const record of deliveryRecords) {
    const attempt = record.attempts.find((item) => item.id === attemptId);

    if (attempt) {
      return clone(attempt);
    }
  }

  return undefined;
};

export const getNotificationAcknowledgements = (
  deliveryId: string,
): NotificationAcknowledgement[] => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  return record ? clone(record.acknowledgements) : [];
};

export const getNotificationAcknowledgementById = (
  acknowledgementId: string,
): NotificationAcknowledgement | undefined => {
  for (const record of deliveryRecords) {
    const acknowledgement = record.acknowledgements.find(
      (item) => item.id === acknowledgementId,
    );

    if (acknowledgement) {
      return clone(acknowledgement);
    }
  }

  return undefined;
};

export const createNotificationDelivery = (
  input: CreateNotificationDeliveryInput,
): NotificationDeliveryRecord => {
  const record: NotificationDeliveryRecord = {
    id: generateId("DEL"),
    notificationId: input.notificationId,
    issuanceId: input.issuanceId,
    priority: input.priority ?? "NORMAL",
    status: "NOT_STARTED",
    recipients: clone(input.recipients),
    attempts: [],
    acknowledgements: input.recipients.map((recipient) => ({
      id: generateId("ACK"),
      notificationId: input.notificationId,
      recipientId: recipient.id,
      status: recipient.acknowledgementRequired ? "PENDING" : "NOT_REQUIRED",
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  deliveryRecords = [...deliveryRecords, record];

  return clone(record);
};

export const updateNotificationDelivery = (
  deliveryId: string,
  input: UpdateNotificationDeliveryInput,
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  if (input.status !== undefined) {
    record.status = input.status;
  }

  if (input.priority !== undefined) {
    record.priority = input.priority;
  }

  if (input.lastAttemptAt !== undefined) {
    record.lastAttemptAt = input.lastAttemptAt;
  }

  if (input.nextRetryAt !== undefined) {
    record.nextRetryAt = input.nextRetryAt;
  }

  refreshRecord(record);

  return clone(record);
};

export const addNotificationDeliveryAttempt = (
  deliveryId: string,
  input: CreateNotificationDeliveryAttemptInput,
): NotificationDeliveryAttempt | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  const attempt: NotificationDeliveryAttempt = {
    id: generateId("ATT"),
    notificationId: input.notificationId,
    recipientId: input.recipientId,
    channel: input.channel,
    attemptNumber: input.attemptNumber,
    status: "QUEUED",
    requestedAt: new Date().toISOString(),
  };

  record.attempts.push(attempt);
  refreshRecord(record);

  return clone(attempt);
};

export const updateNotificationDeliveryAttempt = (
  attemptId: string,
  input: UpdateNotificationDeliveryAttemptInput,
): NotificationDeliveryAttempt | undefined => {
  for (const record of deliveryRecords) {
    const attempt = record.attempts.find((item) => item.id === attemptId);

    if (!attempt) {
      continue;
    }

    attempt.status = input.status;

    if (input.startedAt !== undefined) {
      attempt.startedAt = input.startedAt;
    }

    if (input.completedAt !== undefined) {
      attempt.completedAt = input.completedAt;
    }

    if (input.providerReference !== undefined) {
      attempt.providerReference = input.providerReference;
    }

    if (input.failureReason !== undefined) {
      attempt.failureReason = input.failureReason;
    }

    if (input.failureMessage !== undefined) {
      attempt.failureMessage = input.failureMessage;
    }

    if (input.responseReference !== undefined) {
      attempt.responseReference = input.responseReference;
    }

    refreshRecord(record);

    return clone(attempt);
  }

  return undefined;
};

export const createNotificationAcknowledgement = (
  input: CreateNotificationAcknowledgementInput,
): NotificationAcknowledgement | undefined => {
  const record = deliveryRecords.find(
    (item) => item.notificationId === input.notificationId,
  );

  if (!record) {
    return undefined;
  }

  const existing = record.acknowledgements.find(
    (acknowledgement) =>
      acknowledgement.recipientId === input.recipientId,
  );

  if (existing) {
    existing.status = input.status;
    existing.method = input.method;
    existing.acknowledgedAt = input.acknowledgedAt;
    existing.acknowledgementReference =
      input.acknowledgementReference;
    existing.recordedByUserId = input.recordedByUserId;
    existing.remarks = input.remarks;

    refreshRecord(record);

    return clone(existing);
  }

  const acknowledgement: NotificationAcknowledgement = {
    id: generateId("ACK"),
    notificationId: input.notificationId,
    recipientId: input.recipientId,
    status: input.status,
    method: input.method,
    acknowledgedAt: input.acknowledgedAt,
    acknowledgementReference: input.acknowledgementReference,
    recordedByUserId: input.recordedByUserId,
    remarks: input.remarks,
  };

  record.acknowledgements.push(acknowledgement);
  refreshRecord(record);

  return clone(acknowledgement);
};

export const acknowledgeNotificationRecipient = (
  deliveryId: string,
  recipientId: string,
  actor: NotificationDeliveryActor,
  method: NotificationAcknowledgement["method"] = "OFFICER_RECORDED",
  remarks?: string,
): NotificationAcknowledgement | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  const acknowledgement = record.acknowledgements.find(
    (item) => item.recipientId === recipientId,
  );

  if (!acknowledgement) {
    return undefined;
  }

  acknowledgement.status = "ACKNOWLEDGED";
  acknowledgement.method = method;
  acknowledgement.acknowledgedAt = new Date().toISOString();
  acknowledgement.acknowledgementReference = generateId("ACK-REF");
  acknowledgement.recordedByUserId = actor.userId;
  acknowledgement.remarks = remarks;

  refreshRecord(record);

  record.updatedAt = new Date().toISOString();

  return clone(acknowledgement);
};

export const recordNotificationDeliveryAction = (
  deliveryId: string,
  action: NotificationDeliveryAction,
  actor: NotificationDeliveryActor,
  remarks?: string,
): NotificationDeliveryActionRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  const actionRecord: NotificationDeliveryActionRecord = {
    id: generateId("DEL-ACT"),
    deliveryId,
    action,
    actor: clone(actor),
    timestamp: new Date().toISOString(),
    remarks,
  };

  deliveryActions.push(actionRecord);

  return clone(actionRecord);
};

export const getNotificationDeliveryActions = (
  deliveryId: string,
): NotificationDeliveryActionRecord[] =>
  deliveryActions
    .filter((action) => action.deliveryId === deliveryId)
    .map(clone);

export const startNotificationDelivery = (
  deliveryId: string,
  actor: NotificationDeliveryActor,
  recipientId: string,
  channel: NotificationDeliveryAttempt["channel"],
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  const existingAttempts = record.attempts.filter(
    (attempt) =>
      attempt.recipientId === recipientId &&
      attempt.channel === channel,
  );

  const attempt: NotificationDeliveryAttempt = {
    id: generateId("ATT"),
    notificationId: record.notificationId,
    recipientId,
    channel,
    attemptNumber: existingAttempts.length + 1,
    status: "IN_PROGRESS",
    requestedAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    providerReference: `DEMO-${channel}-${Date.now()}`,
  };

  record.attempts.push(attempt);

  record.status = "IN_PROGRESS";
  record.updatedAt = new Date().toISOString();

  recordNotificationDeliveryAction(
    deliveryId,
    "START_DELIVERY",
    actor,
    `Started demo ${channel} delivery attempt.`,
  );

  return clone(record);
};

export const markNotificationDelivered = (
  deliveryId: string,
  attemptId: string,
  actor: NotificationDeliveryActor,
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  const attempt = record.attempts.find((item) => item.id === attemptId);

  if (!attempt) {
    return undefined;
  }

  attempt.status = "DELIVERED";
  attempt.completedAt = new Date().toISOString();

  refreshRecord(record);

  recordNotificationDeliveryAction(
    deliveryId,
    "MARK_DELIVERED",
    actor,
    `Delivery attempt ${attempt.id} marked as delivered.`,
  );

  return clone(record);
};

export const markNotificationDeliveryFailed = (
  deliveryId: string,
  attemptId: string,
  actor: NotificationDeliveryActor,
  failureReason: NotificationDeliveryFailureReason,
  failureMessage: string,
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  const attempt = record.attempts.find((item) => item.id === attemptId);

  if (!attempt) {
    return undefined;
  }

  attempt.status = "DELIVERY_FAILED";
  attempt.completedAt = new Date().toISOString();
  attempt.failureReason = failureReason;
  attempt.failureMessage = failureMessage;

  record.status = "DELIVERY_RETRY_PENDING";
  record.nextRetryAt = iso(30);
  record.updatedAt = new Date().toISOString();

  recordNotificationDeliveryAction(
    deliveryId,
    "MARK_DELIVERY_FAILED",
    actor,
    failureMessage,
  );

  return clone(record);
};

export const retryNotificationDelivery = (
  deliveryId: string,
  actor: NotificationDeliveryActor,
  recipientId: string,
  channel: NotificationDeliveryAttempt["channel"],
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  const existingAttempts = record.attempts.filter(
    (attempt) =>
      attempt.recipientId === recipientId &&
      attempt.channel === channel,
  );

  const attempt: NotificationDeliveryAttempt = {
    id: generateId("ATT"),
    notificationId: record.notificationId,
    recipientId,
    channel,
    attemptNumber: existingAttempts.length + 1,
    status: "IN_PROGRESS",
    requestedAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    providerReference: `DEMO-RETRY-${channel}-${Date.now()}`,
  };

  record.attempts.push(attempt);
  record.status = "IN_PROGRESS";
  record.nextRetryAt = undefined;
  record.updatedAt = new Date().toISOString();

  recordNotificationDeliveryAction(
    deliveryId,
    "RETRY_DELIVERY",
    actor,
    `Started retry attempt ${attempt.attemptNumber} through ${channel}.`,
  );

  return clone(record);
};

export const cancelNotificationDelivery = (
  deliveryId: string,
  actor: NotificationDeliveryActor,
  remarks = "Delivery cancelled by authorized officer.",
): NotificationDeliveryRecord | undefined => {
  const record = deliveryRecords.find((item) => item.id === deliveryId);

  if (!record) {
    return undefined;
  }

  record.status = "CANCELLED";
  record.nextRetryAt = undefined;

  for (const attempt of record.attempts) {
    if (
      attempt.status === "QUEUED" ||
      attempt.status === "IN_PROGRESS" ||
      attempt.status === "DELIVERY_RETRY_PENDING"
    ) {
      attempt.status = "CANCELLED";
      attempt.completedAt = new Date().toISOString();
    }
  }

  refreshRecord(record);

  record.status = "CANCELLED";

  recordNotificationDeliveryAction(
    deliveryId,
    "CANCEL_DELIVERY",
    actor,
    remarks,
  );

  return clone(record);
};

export const resetNotificationDeliveryData = (): void => {
  deliveryRecords = structuredClone(initialDeliveryRecords);
  deliveryActions = [];
};