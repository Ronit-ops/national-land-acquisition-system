import {
  getNotificationById as loadNotificationById,
  getNotificationDataset,
  getNotifications,
  getNotificationsByStatus as loadNotificationsByStatus,
} from "../data/notificationData";

import type {
  NotificationDeliveryChannel,
  NotificationDataset,
  NotificationFilters,
  NotificationRecord,
  NotificationScope,
  NotificationStatus,
  NotificationType,
} from "../types/notification";

/**
 * Normalizes user-entered identifiers before comparison.
 */
function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Determines whether a notification is safe for
 * citizen-facing communication views.
 *
 * Citizen-facing notification data must:
 * - be explicitly intended for a citizen audience,
 * - not contain officer-only information,
 * - not be restricted,
 * - and be issued/delivered/acknowledged rather than
 *   remaining in an internal preparation state.
 */
function isCitizenNotification(
  notification: NotificationRecord,
): boolean {
  const citizenAudience =
    notification.recipient.audience ===
      "RECORDED_RIGHT_HOLDER" ||
    notification.recipient.audience ===
      "AUTHORIZED_REPRESENTATIVE" ||
    notification.recipient.audience ===
      "PROJECT_AFFECTED_CITIZEN";

  const citizenSafeSensitivity =
    notification.sensitivity === "PUBLIC" ||
    notification.sensitivity === "CITIZEN_AUTHORIZED";

  const citizenVisibleStatus =
    notification.status === "ISSUED" ||
    notification.status === "DELIVERY_IN_PROGRESS" ||
    notification.status === "DELIVERED" ||
    notification.status === "ACKNOWLEDGED";

  return (
    citizenAudience &&
    citizenSafeSensitivity &&
    citizenVisibleStatus
  );
}

/**
 * Applies case/project/parcel/audience scope.
 *
 * When a scope is explicitly requested, the notification
 * must actually contain the corresponding identifier.
 */
function matchesScope(
  notification: NotificationRecord,
  scope: NotificationScope,
): boolean {
  if (scope.caseReference) {
    if (!notification.caseReference) {
      return false;
    }

    if (
      normalize(notification.caseReference) !==
      normalize(scope.caseReference)
    ) {
      return false;
    }
  }

  if (scope.projectId) {
    if (!notification.projectId) {
      return false;
    }

    if (
      normalize(notification.projectId) !==
      normalize(scope.projectId)
    ) {
      return false;
    }
  }

  if (scope.parcelId) {
    if (!notification.parcelId) {
      return false;
    }

    if (
      normalize(notification.parcelId) !==
      normalize(scope.parcelId)
    ) {
      return false;
    }
  }

  if (scope.audience) {
    if (
      notification.recipient.audience !==
      scope.audience
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Returns the complete notification dataset.
 *
 * This is intended for authorized internal
 * application services/workspaces.
 *
 * Citizen-facing UI should use
 * getCitizenNotifications() instead.
 */
export function getNotificationDatasetSafe(): NotificationDataset {
  return getNotificationDataset();
}

/**
 * Returns all notifications available to authorized
 * government application views.
 */
export function getAllNotifications(): NotificationRecord[] {
  return getNotifications();
}

/**
 * Returns a notification by ID.
 */
export function findNotificationById(
  notificationId: string,
): NotificationRecord | undefined {
  const normalizedId = normalize(notificationId);

  if (!normalizedId) {
    return undefined;
  }

  const notification =
    loadNotificationById(notificationId);

  if (!notification) {
    return undefined;
  }

  return normalize(notification.id) === normalizedId
    ? notification
    : undefined;
}

/**
 * Returns a notification by official notification reference.
 */
export function findNotificationByReference(
  notificationReference: string,
): NotificationRecord | undefined {
  const normalizedReference =
    normalize(notificationReference);

  if (!normalizedReference) {
    return undefined;
  }

  return getNotifications().find(
    (notification) =>
      normalize(
        notification.notificationReference,
      ) === normalizedReference,
  );
}

/**
 * Returns notifications by lifecycle status.
 */
export function getNotificationsByStatus(
  status: NotificationStatus,
): NotificationRecord[] {
  return loadNotificationsByStatus(status);
}

/**
 * Returns notifications belonging to a specific case.
 */
export function getCaseNotifications(
  caseReference: string,
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      matchesScope(notification, {
        caseReference,
      }),
  );
}

/**
 * Returns notifications belonging to a specific project.
 */
export function getProjectNotifications(
  projectId: string,
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      matchesScope(notification, {
        projectId,
      }),
  );
}

/**
 * Returns notifications belonging to a specific parcel.
 */
export function getParcelNotifications(
  parcelId: string,
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      matchesScope(notification, {
        parcelId,
      }),
  );
}

/**
 * Returns notifications that are safe for
 * citizen-facing communication views.
 */
export function getCitizenNotifications(
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      isCitizenNotification(notification) &&
      matchesScope(notification, scope),
  );
}

/**
 * Returns notifications intended for government officers.
 */
export function getGovernmentNotifications(
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) => {
      const officerAudience =
        notification.recipient.audience ===
        "GOVERNMENT_OFFICER";

      return (
        officerAudience &&
        matchesScope(notification, scope)
      );
    },
  );
}

/**
 * Returns citizen notifications that require
 * acknowledgement.
 */
export function getCitizenAcknowledgementRequired(
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getCitizenNotifications(scope).filter(
    (notification) =>
      notification.acknowledgementRequired &&
      notification.acknowledgedAt === null,
  );
}

/**
 * Returns notifications with failed delivery.
 */
export function getFailedNotifications(
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      notification.status === "FAILED" &&
      matchesScope(notification, scope),
  );
}

/**
 * Returns notifications currently waiting for delivery.
 */
export function getPendingDeliveryNotifications(
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      (
        notification.status ===
          "READY_FOR_ISSUANCE" ||
        notification.status ===
          "ISSUED" ||
        notification.status ===
          "DELIVERY_IN_PROGRESS"
      ) &&
      matchesScope(notification, scope),
  );
}

/**
 * Returns high-priority notifications.
 */
export function getHighPriorityNotifications(
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      (
        notification.priority === "HIGH" ||
        notification.priority === "URGENT"
      ) &&
      matchesScope(notification, scope),
  );
}

/**
 * Returns urgent notifications.
 */
export function getUrgentNotifications(
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      notification.priority === "URGENT" &&
      matchesScope(notification, scope),
  );
}

/**
 * Returns notifications by notification type.
 */
export function getNotificationsByType(
  type: NotificationType,
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      notification.type === type &&
      matchesScope(notification, scope),
  );
}

/**
 * Returns notifications using the selected
 * delivery channel.
 */
export function getNotificationsByChannel(
  channel: NotificationDeliveryChannel,
  scope: NotificationScope = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) =>
      notification.deliveryAttempts.some(
        (attempt) =>
          attempt.channel === channel,
      ) &&
      matchesScope(notification, scope),
  );
}

/**
 * Generic government notification filter.
 *
 * This function intentionally operates on the internal
 * notification collection.
 *
 * Citizen-specific consumers should use
 * getCitizenNotifications().
 */
export function getFilteredNotifications(
  filters: NotificationFilters = {},
): NotificationRecord[] {
  return getNotifications().filter(
    (notification) => {
      if (
        filters.type &&
        notification.type !== filters.type
      ) {
        return false;
      }

      if (
        filters.priority &&
        notification.priority !==
          filters.priority
      ) {
        return false;
      }

      if (
        filters.status &&
        notification.status !==
          filters.status
      ) {
        return false;
      }

      if (
        filters.source &&
        notification.source !==
          filters.source
      ) {
        return false;
      }

      if (
        filters.caseReference &&
        !matchesScope(notification, {
          caseReference:
            filters.caseReference,
        })
      ) {
        return false;
      }

      if (
        filters.projectId &&
        !matchesScope(notification, {
          projectId: filters.projectId,
        })
      ) {
        return false;
      }

      if (
        filters.parcelId &&
        !matchesScope(notification, {
          parcelId: filters.parcelId,
        })
      ) {
        return false;
      }

      if (
        filters.acknowledgementRequired !==
        undefined &&
        notification.acknowledgementRequired !==
          filters.acknowledgementRequired
      ) {
        return false;
      }

      if (filters.channel) {
        const hasChannel =
          notification.deliveryAttempts.some(
            (attempt) =>
              attempt.channel ===
              filters.channel,
          );

        if (!hasChannel) {
          return false;
        }
      }

      return true;
    },
  );
}

/**
 * Returns the notification summary for
 * the selected application scope.
 */
export function getNotificationSummary(
  scope: NotificationScope = {},
): NotificationDataset["summary"] {
  const records = getNotifications().filter(
    (notification) =>
      matchesScope(notification, scope),
  );

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
        notification.status ===
          "READY_FOR_ISSUANCE",
    ).length,

    delivered: records.filter(
      (notification) =>
        notification.status === "DELIVERED" ||
        notification.status ===
          "ACKNOWLEDGED",
    ).length,

    acknowledged: records.filter(
      (notification) =>
        notification.status ===
        "ACKNOWLEDGED",
    ).length,

    pendingDelivery: records.filter(
      (notification) =>
        notification.status ===
          "READY_FOR_ISSUANCE" ||
        notification.status === "ISSUED" ||
        notification.status ===
          "DELIVERY_IN_PROGRESS",
    ).length,

    failed: records.filter(
      (notification) =>
        notification.status === "FAILED",
    ).length,

    acknowledgementRequired:
      records.filter(
        (notification) =>
          notification.acknowledgementRequired &&
          notification.acknowledgedAt === null,
      ).length,

    overdueAcknowledgements:
      records.filter(
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