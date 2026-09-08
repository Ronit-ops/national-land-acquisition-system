import type {
  NotificationAcknowledgement,
  NotificationAcknowledgementMethod,
  NotificationAcknowledgementStatus,
  NotificationDeliveryAction,
  NotificationDeliveryChannel,
  NotificationDeliveryRecord,
  NotificationDeliveryStatus,
  NotificationDeliveryRecipient,
} from "../types/notificationDelivery";

import {
  getNotificationAcknowledgements,
  getNotificationDeliveryById,
  getNotificationDeliveryByNotificationId,
  getNotificationDeliveryDataset,
  getNotificationDeliveryRecords,
} from "../data/notificationDeliveryData";

export interface NotificationDeliveryTransition {
  from: NotificationDeliveryStatus;
  to: NotificationDeliveryStatus;
  action: NotificationDeliveryAction;
}

export interface NotificationDeliveryActionPermission {
  allowed: boolean;
  reason?: string;
}

export interface NotificationAcknowledgementPermission {
  allowed: boolean;
  reason?: string;
}

export interface NotificationDeliveryFilter {
  status?: NotificationDeliveryStatus;
  channel?: NotificationDeliveryChannel;
  acknowledgementStatus?: NotificationAcknowledgementStatus;
  search?: string;
}

const DELIVERY_TRANSITIONS: NotificationDeliveryTransition[] = [
  {
    from: "NOT_STARTED",
    to: "IN_PROGRESS",
    action: "START_DELIVERY",
  },
  {
    from: "QUEUED",
    to: "IN_PROGRESS",
    action: "START_DELIVERY",
  },
  {
    from: "IN_PROGRESS",
    to: "DELIVERED",
    action: "MARK_DELIVERED",
  },
  {
    from: "IN_PROGRESS",
    to: "DELIVERY_FAILED",
    action: "MARK_DELIVERY_FAILED",
  },
  {
    from: "DELIVERY_FAILED",
    to: "DELIVERY_RETRY_PENDING",
    action: "RETRY_DELIVERY",
  },
  {
    from: "DELIVERY_RETRY_PENDING",
    to: "IN_PROGRESS",
    action: "RETRY_DELIVERY",
  },
  {
    from: "DELIVERY_FAILED",
    to: "IN_PROGRESS",
    action: "RETRY_DELIVERY",
  },
  {
    from: "NOT_STARTED",
    to: "CANCELLED",
    action: "CANCEL_DELIVERY",
  },
  {
    from: "QUEUED",
    to: "CANCELLED",
    action: "CANCEL_DELIVERY",
  },
  {
    from: "IN_PROGRESS",
    to: "CANCELLED",
    action: "CANCEL_DELIVERY",
  },
  {
    from: "DELIVERY_RETRY_PENDING",
    to: "CANCELLED",
    action: "CANCEL_DELIVERY",
  },
  {
    from: "DELIVERY_FAILED",
    to: "CANCELLED",
    action: "CANCEL_DELIVERY",
  },
];

export const getNotificationDeliveryDatasetSafe = () =>
  getNotificationDeliveryDataset();

export const getAllNotificationDeliveries =
  (): NotificationDeliveryRecord[] => getNotificationDeliveryRecords();

export const findNotificationDeliveryById = (
  deliveryId: string,
): NotificationDeliveryRecord | undefined =>
  getNotificationDeliveryById(deliveryId);

export const findNotificationDeliveryByNotificationId = (
  notificationId: string,
): NotificationDeliveryRecord | undefined =>
  getNotificationDeliveryByNotificationId(notificationId);

export const getNotificationDeliveriesByStatus = (
  status: NotificationDeliveryStatus,
): NotificationDeliveryRecord[] =>
  getNotificationDeliveryRecords().filter(
    (record) => record.status === status,
  );

export const getNotificationDeliveriesByChannel = (
  channel: NotificationDeliveryChannel,
): NotificationDeliveryRecord[] =>
  getNotificationDeliveryRecords().filter((record) =>
    record.attempts.some((attempt) => attempt.channel === channel),
  );

export const getNotificationDeliveryRecipients = (
  deliveryId: string,
): NotificationDeliveryRecipient[] => {
  const record = getNotificationDeliveryById(deliveryId);

  return record?.recipients ?? [];
};

export const getNotificationDeliveryAcknowledgements = (
  deliveryId: string,
): NotificationAcknowledgement[] =>
  getNotificationAcknowledgements(deliveryId);

export const getNotificationDeliveryAcknowledgementStatus = (
  deliveryId: string,
  recipientId: string,
): NotificationAcknowledgementStatus | undefined => {
  const acknowledgements = getNotificationAcknowledgements(deliveryId);

  return acknowledgements.find(
    (acknowledgement) =>
      acknowledgement.recipientId === recipientId,
  )?.status;
};

export const getNotificationDeliveryTransition = (
  status: NotificationDeliveryStatus,
  action: NotificationDeliveryAction,
): NotificationDeliveryTransition | undefined =>
  DELIVERY_TRANSITIONS.find(
    (transition) =>
      transition.from === status && transition.action === action,
  );

export const canStartNotificationDelivery = (
  record: NotificationDeliveryRecord,
): NotificationDeliveryActionPermission => {
  if (
    record.status !== "NOT_STARTED" &&
    record.status !== "QUEUED"
  ) {
    return {
      allowed: false,
      reason: `Delivery cannot be started while status is ${record.status}.`,
    };
  }

  const hasRecipients = record.recipients.length > 0;

  if (!hasRecipients) {
    return {
      allowed: false,
      reason: "Delivery cannot start because no recipient is configured.",
    };
  }

  const hasAvailableChannel = record.recipients.some(
    (recipient) => recipient.deliveryChannels.length > 0,
  );

  if (!hasAvailableChannel) {
    return {
      allowed: false,
      reason: "Delivery cannot start because no delivery channel is configured.",
    };
  }

  return {
    allowed: true,
  };
};

export const canRetryNotificationDelivery = (
  record: NotificationDeliveryRecord,
): NotificationDeliveryActionPermission => {
  if (
    record.status !== "DELIVERY_FAILED" &&
    record.status !== "DELIVERY_RETRY_PENDING"
  ) {
    return {
      allowed: false,
      reason: `Delivery cannot be retried while status is ${record.status}.`,
    };
  }

  const hasFailedAttempt = record.attempts.some(
    (attempt) => attempt.status === "DELIVERY_FAILED",
  );

  if (!hasFailedAttempt) {
    return {
      allowed: false,
      reason: "Retry is unavailable because no failed delivery attempt exists.",
    };
  }

  return {
    allowed: true,
  };
};

export const canMarkNotificationDelivered = (
  record: NotificationDeliveryRecord,
): NotificationDeliveryActionPermission => {
  if (record.status !== "IN_PROGRESS") {
    return {
      allowed: false,
      reason: `Delivery can only be marked delivered while status is IN_PROGRESS.`,
    };
  }

  const hasActiveAttempt = record.attempts.some(
    (attempt) => attempt.status === "IN_PROGRESS",
  );

  if (!hasActiveAttempt) {
    return {
      allowed: false,
      reason: "No active delivery attempt is available.",
    };
  }

  return {
    allowed: true,
  };
};

export const canMarkNotificationDeliveryFailed = (
  record: NotificationDeliveryRecord,
): NotificationDeliveryActionPermission => {
  if (record.status !== "IN_PROGRESS") {
    return {
      allowed: false,
      reason: "Only an in-progress delivery can be marked as failed.",
    };
  }

  const hasActiveAttempt = record.attempts.some(
    (attempt) => attempt.status === "IN_PROGRESS",
  );

  if (!hasActiveAttempt) {
    return {
      allowed: false,
      reason: "No active delivery attempt is available.",
    };
  }

  return {
    allowed: true,
  };
};

export const canCancelNotificationDelivery = (
  record: NotificationDeliveryRecord,
): NotificationDeliveryActionPermission => {
  if (record.status === "DELIVERED") {
    return {
      allowed: false,
      reason: "A delivered notification cannot be cancelled.",
    };
  }

  if (record.status === "CANCELLED") {
    return {
      allowed: false,
      reason: "This delivery is already cancelled.",
    };
  }

  return {
    allowed: true,
  };
};

export const canAcknowledgeNotificationRecipient = (
  record: NotificationDeliveryRecord,
  recipientId: string,
): NotificationAcknowledgementPermission => {
  const recipient = record.recipients.find(
    (item) => item.id === recipientId,
  );

  if (!recipient) {
    return {
      allowed: false,
      reason: "Recipient could not be found for this delivery.",
    };
  }

  if (!recipient.acknowledgementRequired) {
    return {
      allowed: false,
      reason: "Acknowledgement is not required for this recipient.",
    };
  }

  const acknowledgement = record.acknowledgements.find(
    (item) => item.recipientId === recipientId,
  );

  if (!acknowledgement) {
    return {
      allowed: false,
      reason: "No acknowledgement record exists for this recipient.",
    };
  }

  if (acknowledgement.status === "ACKNOWLEDGED") {
    return {
      allowed: false,
      reason: "This recipient has already acknowledged the notification.",
    };
  }

  if (acknowledgement.status === "NOT_REQUIRED") {
    return {
      allowed: false,
      reason: "Acknowledgement is not required for this recipient.",
    };
  }

  if (acknowledgement.status === "EXPIRED") {
    return {
      allowed: false,
      reason: "The acknowledgement deadline has expired.",
    };
  }

  return {
    allowed: true,
  };
};

export const canPerformNotificationDeliveryAction = (
  record: NotificationDeliveryRecord,
  action: NotificationDeliveryAction,
): NotificationDeliveryActionPermission => {
  switch (action) {
    case "START_DELIVERY":
      return canStartNotificationDelivery(record);

    case "RETRY_DELIVERY":
      return canRetryNotificationDelivery(record);

    case "MARK_DELIVERED":
      return canMarkNotificationDelivered(record);

    case "MARK_DELIVERY_FAILED":
      return canMarkNotificationDeliveryFailed(record);

    case "CANCEL_DELIVERY":
      return canCancelNotificationDelivery(record);

    case "RECORD_ACKNOWLEDGEMENT":
      return {
        allowed: record.status === "DELIVERED",
        reason:
          record.status === "DELIVERED"
            ? undefined
            : "Acknowledgement can only be recorded after delivery.",
      };

    case "VIEW_DELIVERY":
    case "VIEW_AUDIT":
      return {
        allowed: true,
      };

    default:
      return {
        allowed: false,
        reason: "This delivery action is not supported.",
      };
  }
};

export const isNotificationDeliveryComplete = (
  record: NotificationDeliveryRecord,
): boolean => record.status === "DELIVERED";

export const hasNotificationDeliveryFailures = (
  record: NotificationDeliveryRecord,
): boolean =>
  record.attempts.some(
    (attempt) => attempt.status === "DELIVERY_FAILED",
  );

export const hasNotificationDeliveryRetryPending = (
  record: NotificationDeliveryRecord,
): boolean =>
  record.status === "DELIVERY_RETRY_PENDING" ||
  record.attempts.some(
    (attempt) => attempt.status === "DELIVERY_RETRY_PENDING",
  );

export const hasPendingNotificationAcknowledgements = (
  record: NotificationDeliveryRecord,
): boolean =>
  record.acknowledgements.some(
    (acknowledgement) => acknowledgement.status === "PENDING",
  );

export const hasAcknowledgedNotificationRecipients = (
  record: NotificationDeliveryRecord,
): boolean =>
  record.acknowledgements.some(
    (acknowledgement) => acknowledgement.status === "ACKNOWLEDGED",
  );

export const getPendingNotificationAcknowledgements = (
  record: NotificationDeliveryRecord,
): NotificationAcknowledgement[] =>
  record.acknowledgements.filter(
    (acknowledgement) => acknowledgement.status === "PENDING",
  );

export const getAcknowledgedNotificationRecipients = (
  record: NotificationDeliveryRecord,
): NotificationAcknowledgement[] =>
  record.acknowledgements.filter(
    (acknowledgement) => acknowledgement.status === "ACKNOWLEDGED",
  );

export const getNotificationDeliveryLabel = (
  status: NotificationDeliveryStatus,
): string => {
  const labels: Record<NotificationDeliveryStatus, string> = {
    NOT_STARTED: "Not Started",
    QUEUED: "Queued",
    IN_PROGRESS: "In Progress",
    DELIVERED: "Delivered",
    DELIVERY_FAILED: "Delivery Failed",
    DELIVERY_RETRY_PENDING: "Retry Pending",
    CANCELLED: "Cancelled",
  };

  return labels[status];
};

export const getNotificationAcknowledgementLabel = (
  status: NotificationAcknowledgementStatus,
): string => {
  const labels: Record<NotificationAcknowledgementStatus, string> = {
    NOT_REQUIRED: "Not Required",
    PENDING: "Pending",
    ACKNOWLEDGED: "Acknowledged",
    ACKNOWLEDGEMENT_FAILED: "Acknowledgement Failed",
    EXPIRED: "Expired",
  };

  return labels[status];
};

export const getNotificationDeliveryChannelLabel = (
  channel: NotificationDeliveryChannel,
): string => {
  const labels: Record<NotificationDeliveryChannel, string> = {
    PORTAL: "Citizen Portal",
    EMAIL: "Email",
    SMS: "SMS",
    POSTAL: "Postal",
    FIELD_SERVICE: "Field Service",
  };

  return labels[channel];
};

export const getNotificationDeliveryActionLabel = (
  action: NotificationDeliveryAction,
): string => {
  const labels: Record<NotificationDeliveryAction, string> = {
    START_DELIVERY: "Start Delivery",
    RETRY_DELIVERY: "Retry Delivery",
    MARK_DELIVERED: "Mark Delivered",
    MARK_DELIVERY_FAILED: "Mark Delivery Failed",
    CANCEL_DELIVERY: "Cancel Delivery",
    RECORD_ACKNOWLEDGEMENT: "Record Acknowledgement",
    VIEW_DELIVERY: "View Delivery",
    VIEW_AUDIT: "View Audit",
  };

  return labels[action];
};

export const filterNotificationDeliveries = (
  records: NotificationDeliveryRecord[],
  filters: NotificationDeliveryFilter,
): NotificationDeliveryRecord[] => {
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return records.filter((record) => {
    if (filters.status && record.status !== filters.status) {
      return false;
    }

    if (
      filters.channel &&
      !record.attempts.some(
        (attempt) => attempt.channel === filters.channel,
      ) &&
      !record.recipients.some((recipient) =>
        recipient.deliveryChannels.includes(filters.channel!),
      )
    ) {
      return false;
    }

    if (
      filters.acknowledgementStatus &&
      !record.acknowledgements.some(
        (acknowledgement) =>
          acknowledgement.status === filters.acknowledgementStatus,
      )
    ) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableText = [
      record.id,
      record.notificationId,
      record.issuanceId,
      ...record.recipients.flatMap((recipient) => [
        recipient.id,
        recipient.recipientName,
        recipient.recipientType,
        recipient.maskedContact ?? "",
      ]),
      ...record.attempts.flatMap((attempt) => [
        attempt.id,
        attempt.channel,
        attempt.providerReference ?? "",
        attempt.failureMessage ?? "",
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
};

export const getNotificationDeliverySummary = () =>
  getNotificationDeliveryDataset().summary;

export const getNotificationDeliveryCounts = () => {
  const summary = getNotificationDeliveryDataset().summary;

  return {
    total: summary.total,
    notStarted: summary.notStarted,
    queued: summary.queued,
    inProgress: summary.inProgress,
    delivered: summary.delivered,
    failed: summary.failed,
    retryPending: summary.retryPending,
    cancelled: summary.cancelled,
    acknowledgementPending: summary.acknowledgementPending,
    acknowledgementReceived: summary.acknowledgementReceived,
  };
};

export const getDeliveryChannelsForRecipient = (
  recipient: NotificationDeliveryRecipient,
): NotificationDeliveryChannel[] => [...recipient.deliveryChannels];

export const getDefaultDeliveryChannel = (
  recipient: NotificationDeliveryRecipient,
): NotificationDeliveryChannel | undefined =>
  recipient.deliveryChannels[0];

export const getActiveDeliveryAttempt = (
  record: NotificationDeliveryRecord,
): NotificationDeliveryRecord["attempts"][number] | undefined =>
  record.attempts.find((attempt) => attempt.status === "IN_PROGRESS");

export const getLatestDeliveryAttempt = (
  record: NotificationDeliveryRecord,
): NotificationDeliveryRecord["attempts"][number] | undefined =>
  [...record.attempts]
    .sort((first, second) =>
      second.attemptNumber - first.attemptNumber,
    )
    .at(0);

export const isAcknowledgementMethodSupported = (
  method: NotificationAcknowledgementMethod,
): boolean => {
  const supportedMethods: NotificationAcknowledgementMethod[] = [
    "PORTAL",
    "OTP",
    "DIGITAL_SIGNATURE",
    "OFFICER_RECORDED",
    "FIELD_VERIFICATION",
    "OTHER",
  ];

  return supportedMethods.includes(method);
};