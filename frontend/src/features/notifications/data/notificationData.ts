import type {
  CreateNotificationInput,
  NotificationDataset,
  NotificationDeliveryAttempt,
  NotificationRecord,
  NotificationStatus,
} from "../types/notification";

const initialNotifications: NotificationRecord[] = [
  {
    id: "NOTIF-001",
    notificationReference: "AAKAR-NOT-2026-0001",
    type: "PRELIMINARY_NOTIFICATION",
    title: "Preliminary Notification Issued",
    message:
      "A preliminary notification has been issued for land proposed for acquisition under the Pune Ring Road Development Project.",
    priority: "HIGH",
    status: "DELIVERED",
    source: "CASE_WORKFLOW",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-001",
      name: "Suresh Patil",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******4812",
      emailMasked: "s****@example.com",
      preferredChannel: "PORTAL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-PUN-2026-001",
        displayReference: "LAC-PUN-2026-001",
      },
      {
        type: "PARCEL",
        id: "PARCEL-PUN-001",
        displayReference: "ULPIN-DEMO-PUN-001",
      },
      {
        type: "PROJECT",
        id: "PRJ-PUN-2026-001",
        displayReference: "Pune Ring Road Development Project",
      },
    ],
    issuedAt: "2026-08-14T10:30:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-14T23:59:59+05:30",
    deliveryAttempts: [
      {
        id: "DEL-001",
        channel: "PORTAL",
        status: "DELIVERED",
        attemptedAt: "2026-08-14T10:31:00+05:30",
        deliveredAt: "2026-08-14T10:31:02+05:30",
        acknowledgedAt: null,
      },
    ],
    documentId: "DOC-NOTICE-001",
    caseReference: "LAC-PUN-2026-001",
    projectId: "PRJ-PUN-2026-001",
    parcelId: "PARCEL-PUN-001",
    createdAt: "2026-08-14T10:29:00+05:30",
    updatedAt: "2026-08-14T10:31:02+05:30",
  },

  {
    id: "NOTIF-002",
    notificationReference: "AAKAR-NOT-2026-0002",
    type: "HEARING_NOTICE",
    title: "Hearing Scheduled",
    message:
      "A hearing has been scheduled regarding the land acquisition proceeding associated with your case.",
    priority: "HIGH",
    status: "ACKNOWLEDGED",
    source: "CASE_WORKFLOW",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-002",
      name: "Meena Kulkarni",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******2291",
      emailMasked: "m****@example.com",
      preferredChannel: "SMS",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-NAS-2026-002",
        displayReference: "LAC-NAS-2026-002",
      },
      {
        type: "PROCEEDING",
        id: "PROC-NAS-2026-002",
        displayReference: "PROC-NAS-2026-002",
      },
    ],
    issuedAt: "2026-09-01T09:15:00+05:30",
    scheduledAt: null,
    acknowledgedAt: "2026-09-02T11:40:00+05:30",
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-15T23:59:59+05:30",
    deliveryAttempts: [
      {
        id: "DEL-002",
        channel: "PORTAL",
        status: "ACKNOWLEDGED",
        attemptedAt: "2026-09-01T09:16:00+05:30",
        deliveredAt: "2026-09-01T09:16:03+05:30",
        acknowledgedAt: "2026-09-02T11:40:00+05:30",
      },
      {
        id: "DEL-003",
        channel: "SMS",
        status: "DELIVERED",
        attemptedAt: "2026-09-01T09:17:00+05:30",
        deliveredAt: "2026-09-01T09:17:06+05:30",
        acknowledgedAt: null,
      },
    ],
    documentId: "DOC-HEARING-002",
    caseReference: "LAC-NAS-2026-002",
    projectId: "PRJ-NAS-2026-002",
    createdAt: "2026-09-01T09:14:00+05:30",
    updatedAt: "2026-09-02T11:40:00+05:30",
  },

  {
    id: "NOTIF-003",
    notificationReference: "AAKAR-NOT-2026-0003",
    type: "AWARD_NOTICE",
    title: "Award Order Available",
    message:
      "The acquisition award associated with the referenced case has been issued and is available through the authorized citizen portal.",
    priority: "HIGH",
    status: "DELIVERED",
    source: "OFFICER_ACTION",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-003",
      name: "Ramesh More",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******7134",
      preferredChannel: "PORTAL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-NAG-2026-003",
        displayReference: "LAC-NAG-2026-003",
      },
      {
        type: "AWARD",
        id: "AWD-NAG-2026-003",
        displayReference: "AWARD-NAG-2026-003",
      },
    ],
    issuedAt: "2026-08-27T14:20:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: false,
    acknowledgementDeadline: null,
    deliveryAttempts: [
      {
        id: "DEL-004",
        channel: "PORTAL",
        status: "DELIVERED",
        attemptedAt: "2026-08-27T14:21:00+05:30",
        deliveredAt: "2026-08-27T14:21:02+05:30",
        acknowledgedAt: null,
      },
    ],
    documentId: "DOC-AWARD-003",
    caseReference: "LAC-NAG-2026-003",
    projectId: "PRJ-NAG-2026-003",
    parcelId: "PARCEL-NAG-003",
    createdAt: "2026-08-27T14:19:00+05:30",
    updatedAt: "2026-08-27T14:21:02+05:30",
  },

  {
    id: "NOTIF-004",
    notificationReference: "AAKAR-NOT-2026-0004",
    type: "COMPENSATION_NOTICE",
    title: "Compensation Payment Update",
    message:
      "An update regarding compensation processing is available for the referenced acquisition case.",
    priority: "NORMAL",
    status: "ISSUED",
    source: "CASE_WORKFLOW",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-004",
      name: "Anita Shinde",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******9017",
      preferredChannel: "PORTAL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-PUN-2026-004",
        displayReference: "LAC-PUN-2026-004",
      },
      {
        type: "COMPENSATION",
        id: "COMP-PUN-2026-004",
        displayReference: "COMP-PUN-2026-004",
      },
    ],
    issuedAt: "2026-09-05T13:00:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-20T23:59:59+05:30",
    deliveryAttempts: [
      {
        id: "DEL-005",
        channel: "PORTAL",
        status: "SENT",
        attemptedAt: "2026-09-05T13:01:00+05:30",
        deliveredAt: null,
        acknowledgedAt: null,
      },
    ],
    caseReference: "LAC-PUN-2026-004",
    projectId: "PRJ-PUN-2026-001",
    createdAt: "2026-09-05T12:59:00+05:30",
    updatedAt: "2026-09-05T13:01:00+05:30",
  },

  {
    id: "NOTIF-005",
    notificationReference: "AAKAR-NOT-2026-0005",
    type: "RR_NOTICE",
    title: "Rehabilitation & Resettlement Update",
    message:
      "Your rehabilitation and resettlement package has progressed to the implementation stage.",
    priority: "NORMAL",
    status: "DELIVERED",
    source: "CASE_WORKFLOW",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-005",
      name: "Vijay Pawar",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******3456",
      preferredChannel: "EMAIL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-NAS-2026-005",
        displayReference: "LAC-NAS-2026-005",
      },
      {
        type: "R_AND_R",
        id: "RR-NAS-2026-005",
        displayReference: "RR-NAS-2026-005",
      },
    ],
    issuedAt: "2026-08-30T12:10:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: false,
    acknowledgementDeadline: null,
    deliveryAttempts: [
      {
        id: "DEL-006",
        channel: "EMAIL",
        status: "DELIVERED",
        attemptedAt: "2026-08-30T12:11:00+05:30",
        deliveredAt: "2026-08-30T12:11:08+05:30",
        acknowledgedAt: null,
      },
    ],
    caseReference: "LAC-NAS-2026-005",
    projectId: "PRJ-NAS-2026-002",
    createdAt: "2026-08-30T12:09:00+05:30",
    updatedAt: "2026-08-30T12:11:08+05:30",
  },

  {
    id: "NOTIF-006",
    notificationReference: "AAKAR-NOT-2026-0006",
    type: "POSSESSION_NOTICE",
    title: "Possession Handover Notice",
    message:
      "A possession handover schedule has been published for the referenced acquisition case.",
    priority: "URGENT",
    status: "READY_FOR_ISSUANCE",
    source: "CASE_WORKFLOW",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-006",
      name: "Deepak Jadhav",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******6182",
      preferredChannel: "PORTAL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-NAG-2026-006",
        displayReference: "LAC-NAG-2026-006",
      },
      {
        type: "POSSESSION",
        id: "POS-NAG-2026-006",
        displayReference: "POS-NAG-2026-006",
      },
    ],
    issuedAt: null,
    scheduledAt: "2026-09-10T10:00:00+05:30",
    acknowledgedAt: null,
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-25T23:59:59+05:30",
    deliveryAttempts: [],
    caseReference: "LAC-NAG-2026-006",
    projectId: "PRJ-NAG-2026-003",
    parcelId: "PARCEL-NAG-006",
    createdAt: "2026-09-07T16:00:00+05:30",
    updatedAt: "2026-09-07T16:00:00+05:30",
  },

  {
    id: "NOTIF-007",
    notificationReference: "AAKAR-NOT-2026-0007",
    type: "DOCUMENT_AVAILABLE",
    title: "New Document Available",
    message:
      "A citizen-visible acquisition document has been published and is available through the case portal.",
    priority: "NORMAL",
    status: "DELIVERED",
    source: "SYSTEM_GENERATED",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-007",
      name: "Sunita More",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******4820",
      preferredChannel: "PORTAL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-PUN-2026-007",
        displayReference: "LAC-PUN-2026-007",
      },
      {
        type: "DOCUMENT",
        id: "DOC-CIT-007",
        displayReference: "DOC-PUB-PUN-007",
      },
    ],
    issuedAt: "2026-09-04T15:45:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: false,
    acknowledgementDeadline: null,
    deliveryAttempts: [
      {
        id: "DEL-007",
        channel: "PORTAL",
        status: "DELIVERED",
        attemptedAt: "2026-09-04T15:46:00+05:30",
        deliveredAt: "2026-09-04T15:46:03+05:30",
        acknowledgedAt: null,
      },
    ],
    documentId: "DOC-CIT-007",
    caseReference: "LAC-PUN-2026-007",
    projectId: "PRJ-PUN-2026-001",
    createdAt: "2026-09-04T15:44:00+05:30",
    updatedAt: "2026-09-04T15:46:03+05:30",
  },

  {
    id: "NOTIF-008",
    notificationReference: "AAKAR-NOT-2026-0008",
    type: "CASE_UPDATE",
    title: "Acquisition Case Status Updated",
    message:
      "The current stage of your acquisition case has been updated in the citizen portal.",
    priority: "NORMAL",
    status: "DELIVERED",
    source: "CASE_WORKFLOW",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-008",
      name: "Mahesh Deshmukh",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******7754",
      preferredChannel: "PORTAL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-PUN-2026-008",
        displayReference: "LAC-PUN-2026-008",
      },
    ],
    issuedAt: "2026-09-06T09:30:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: false,
    acknowledgementDeadline: null,
    deliveryAttempts: [
      {
        id: "DEL-008",
        channel: "PORTAL",
        status: "DELIVERED",
        attemptedAt: "2026-09-06T09:31:00+05:30",
        deliveredAt: "2026-09-06T09:31:02+05:30",
        acknowledgedAt: null,
      },
    ],
    caseReference: "LAC-PUN-2026-008",
    projectId: "PRJ-PUN-2026-001",
    createdAt: "2026-09-06T09:29:00+05:30",
    updatedAt: "2026-09-06T09:31:02+05:30",
  },

  {
    id: "NOTIF-009",
    notificationReference: "AAKAR-NOT-2026-0009",
    type: "HEARING_NOTICE",
    title: "Hearing Notification Delivery Failed",
    message:
      "The system could not complete delivery through the selected notification channel. Officer review is required.",
    priority: "URGENT",
    status: "FAILED",
    source: "SYSTEM_GENERATED",
    sensitivity: "CITIZEN_AUTHORIZED",
    recipient: {
      id: "CIT-009",
      name: "Kiran Shinde",
      audience: "RECORDED_RIGHT_HOLDER",
      mobileNumberMasked: "******1108",
      preferredChannel: "SMS",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-NAS-2026-009",
        displayReference: "LAC-NAS-2026-009",
      },
      {
        type: "PROCEEDING",
        id: "PROC-NAS-2026-009",
        displayReference: "PROC-NAS-2026-009",
      },
    ],
    issuedAt: "2026-09-06T17:10:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-16T23:59:59+05:30",
    deliveryAttempts: [
      {
        id: "DEL-009",
        channel: "SMS",
        status: "FAILED",
        attemptedAt: "2026-09-06T17:11:00+05:30",
        deliveredAt: null,
        acknowledgedAt: null,
        failureReason: "DEMO_PROVIDER_UNAVAILABLE",
        providerReference: "DEMO-SMS-009",
      },
    ],
    caseReference: "LAC-NAS-2026-009",
    projectId: "PRJ-NAS-2026-002",
    createdAt: "2026-09-06T17:09:00+05:30",
    updatedAt: "2026-09-06T17:11:00+05:30",
  },

  {
    id: "NOTIF-010",
    notificationReference: "AAKAR-NOT-2026-0010",
    type: "GENERAL_INFORMATION",
    title: "Government Action Required",
    message:
      "An internal workflow communication is awaiting action by the responsible government officer.",
    priority: "HIGH",
    status: "ISSUED",
    source: "OFFICER_ACTION",
    sensitivity: "OFFICER_ONLY",
    recipient: {
      id: "USR-001",
      name: "Anil Deshmukh",
      audience: "GOVERNMENT_OFFICER",
      preferredChannel: "PORTAL",
    },
    references: [
      {
        type: "CASE",
        id: "CASE-PUN-2026-010",
        displayReference: "LAC-PUN-2026-010",
      },
    ],
    issuedAt: "2026-09-07T11:00:00+05:30",
    scheduledAt: null,
    acknowledgedAt: null,
    acknowledgementRequired: true,
    acknowledgementDeadline: "2026-09-09T23:59:59+05:30",
    deliveryAttempts: [
      {
        id: "DEL-010",
        channel: "PORTAL",
        status: "DELIVERED",
        attemptedAt: "2026-09-07T11:01:00+05:30",
        deliveredAt: "2026-09-07T11:01:01+05:30",
        acknowledgedAt: null,
      },
    ],
    caseReference: "LAC-PUN-2026-010",
    projectId: "PRJ-PUN-2026-001",
    createdAt: "2026-09-07T10:59:00+05:30",
    updatedAt: "2026-09-07T11:01:01+05:30",
  },
];

let notifications: NotificationRecord[] = [
  ...initialNotifications,
];

function calculateSummary(
  records: NotificationRecord[],
): NotificationDataset["summary"] {
  const now = new Date();

  return {
    total: records.length,

    drafts: records.filter(
      (notification) =>
        notification.status === "DRAFT",
    ).length,

    issued: records.filter(
      (notification) =>
        notification.status === "ISSUED" ||
        notification.status === "READY_FOR_ISSUANCE",
    ).length,

    delivered: records.filter(
      (notification) =>
        notification.status === "DELIVERED" ||
        notification.status === "ACKNOWLEDGED",
    ).length,

    acknowledged: records.filter(
      (notification) =>
        notification.status === "ACKNOWLEDGED",
    ).length,

    pendingDelivery: records.filter(
      (notification) =>
        notification.status ===
          "READY_FOR_ISSUANCE" ||
        notification.status ===
          "ISSUED" ||
        notification.status ===
          "DELIVERY_IN_PROGRESS",
    ).length,

    failed: records.filter(
      (notification) =>
        notification.status === "FAILED",
    ).length,

    acknowledgementRequired: records.filter(
      (notification) =>
        notification.acknowledgementRequired &&
        notification.acknowledgedAt === null,
    ).length,

    overdueAcknowledgements: records.filter(
      (notification) => {
        if (
          !notification.acknowledgementRequired ||
          notification.acknowledgedAt !== null ||
          !notification.acknowledgementDeadline
        ) {
          return false;
        }

        return (
          new Date(
            notification.acknowledgementDeadline,
          ) < now
        );
      },
    ).length,
  };
}

export function getNotificationDataset(): NotificationDataset {
  return {
    notifications: [...notifications],
    summary: calculateSummary(notifications),
  };
}

export function getNotifications(): NotificationRecord[] {
  return [...notifications];
}

export function getNotificationById(
  notificationId: string,
): NotificationRecord | undefined {
  return notifications.find(
    (notification) =>
      notification.id === notificationId,
  );
}

export function getNotificationByReference(
  notificationReference: string,
): NotificationRecord | undefined {
  return notifications.find(
    (notification) =>
      notification.notificationReference ===
      notificationReference,
  );
}

export function getNotificationsByStatus(
  status: NotificationStatus,
): NotificationRecord[] {
  return notifications.filter(
    (notification) =>
      notification.status === status,
  );
}

export function createNotification(
  input: CreateNotificationInput,
): NotificationRecord {
  const timestamp = new Date().toISOString();

  const record: NotificationRecord = {
    id: `NOTIF-DEMO-${Date.now()}`,

    notificationReference: `AAKAR-NOT-DEMO-${Date.now()}`,

    type: input.type,

    title: input.title,

    message: input.message,

    priority: input.priority,

    status: "DRAFT",

    source: input.source,

    sensitivity: input.sensitivity,

    recipient: input.recipient,

    references: input.references,

    issuedAt: null,

    scheduledAt:
      input.scheduledAt ?? null,

    acknowledgedAt: null,

    acknowledgementRequired:
      input.acknowledgementRequired,

    acknowledgementDeadline:
      input.acknowledgementDeadline ?? null,

    deliveryAttempts: [],

    documentId: input.documentId,

    caseReference: input.caseReference,

    projectId: input.projectId,

    parcelId: input.parcelId,

    createdAt: timestamp,

    updatedAt: timestamp,
  };

  notifications = [
    record,
    ...notifications,
  ];

  return record;
}

export function updateNotification(
  notificationId: string,
  updates: Partial<
    Pick<
      NotificationRecord,
      | "title"
      | "message"
      | "priority"
      | "status"
      | "scheduledAt"
      | "issuedAt"
      | "acknowledgementRequired"
      | "acknowledgementDeadline"
      | "acknowledgedAt"
    >
  >,
): NotificationRecord | undefined {
  const index = notifications.findIndex(
    (notification) =>
      notification.id === notificationId,
  );

  if (index === -1) {
    return undefined;
  }

  const updated: NotificationRecord = {
    ...notifications[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  notifications[index] = updated;

  return updated;
}

export function addNotificationDeliveryAttempt(
  notificationId: string,
  attempt: NotificationDeliveryAttempt,
): NotificationRecord | undefined {
  const notification =
    getNotificationById(notificationId);

  if (!notification) {
    return undefined;
  }

  const updated: NotificationRecord = {
    ...notification,
    deliveryAttempts: [
      ...notification.deliveryAttempts,
      attempt,
    ],
    updatedAt: new Date().toISOString(),
  };

  notifications = notifications.map(
    (item) =>
      item.id === notificationId
        ? updated
        : item,
  );

  return updated;
}

export function acknowledgeNotification(
  notificationId: string,
): NotificationRecord | undefined {
  const notification =
    getNotificationById(notificationId);

  if (!notification) {
    return undefined;
  }

  const timestamp = new Date().toISOString();

  return updateNotification(
    notificationId,
    {
      status: "ACKNOWLEDGED",
      acknowledgedAt: timestamp,
    },
  );
}

export function resetNotifications(): void {
  notifications = [
    ...initialNotifications,
  ];
}