import {
  acknowledgeNotificationRecipient,
  cancelNotificationDelivery,
  markNotificationDelivered,
  markNotificationDeliveryFailed,
  retryNotificationDelivery,
  startNotificationDelivery,
} from "../data/notificationDeliveryData";

import type {
  NotificationAcknowledgementMethod,
  NotificationDeliveryAction,
  NotificationDeliveryActor,
  NotificationDeliveryChannel,
  NotificationDeliveryFailureReason,
  NotificationDeliveryRecord,
} from "../types/notificationDelivery";

import {
  canAcknowledgeNotificationRecipient,
  canCancelNotificationDelivery,
  canMarkNotificationDelivered,
  canMarkNotificationDeliveryFailed,
  canRetryNotificationDelivery,
  canStartNotificationDelivery,
  findNotificationDeliveryById,
} from "./notificationDeliveryLookup";

export interface NotificationDeliveryActionContext {
  actor: NotificationDeliveryActor;
  recipientId?: string;
  channel?: NotificationDeliveryChannel;
  acknowledgementMethod?: NotificationAcknowledgementMethod;
  failureReason?: NotificationDeliveryFailureReason;
  failureMessage?: string;
  remarks?: string;
}

export type NotificationDeliveryActionResult =
  | {
      success: true;
      action: NotificationDeliveryAction;
      record: NotificationDeliveryRecord;
      message: string;
    }
  | {
      success: false;
      action: NotificationDeliveryAction;
      record?: NotificationDeliveryRecord;
      message: string;
    };

const failure = (
  action: NotificationDeliveryAction,
  message: string,
  record?: NotificationDeliveryRecord,
): NotificationDeliveryActionResult => ({
  success: false,
  action,
  record,
  message,
});

export const executeStartNotificationDelivery = (
  deliveryId: string,
  context: NotificationDeliveryActionContext,
): NotificationDeliveryActionResult => {
  const record = findNotificationDeliveryById(deliveryId);

  if (!record) {
    return failure(
      "START_DELIVERY",
      "The delivery record could not be found.",
    );
  }

  const permission = canStartNotificationDelivery(record);

  if (!permission.allowed) {
    return failure(
      "START_DELIVERY",
      permission.reason ?? "Delivery cannot be started.",
      record,
    );
  }

  const recipientId =
    context.recipientId ?? record.recipients[0]?.id;

  if (!recipientId) {
    return failure(
      "START_DELIVERY",
      "A recipient must be selected before delivery can start.",
      record,
    );
  }

  const recipient = record.recipients.find(
    (item) => item.id === recipientId,
  );

  if (!recipient) {
    return failure(
      "START_DELIVERY",
      "The selected recipient could not be found.",
      record,
    );
  }

  const channel =
    context.channel ?? recipient.deliveryChannels[0];

  if (!channel) {
    return failure(
      "START_DELIVERY",
      "No delivery channel is available for the selected recipient.",
      record,
    );
  }

  const updatedRecord = startNotificationDelivery(
    deliveryId,
    context.actor,
    recipientId,
    channel,
  );

  if (!updatedRecord) {
    return failure(
      "START_DELIVERY",
      "The delivery could not be started.",
      record,
    );
  }

  return {
    success: true,
    action: "START_DELIVERY",
    record: updatedRecord,
    message: `Delivery started through ${channel}.`,
  };
};

export const executeRetryNotificationDelivery = (
  deliveryId: string,
  context: NotificationDeliveryActionContext,
): NotificationDeliveryActionResult => {
  const record = findNotificationDeliveryById(deliveryId);

  if (!record) {
    return failure(
      "RETRY_DELIVERY",
      "The delivery record could not be found.",
    );
  }

  const permission = canRetryNotificationDelivery(record);

  if (!permission.allowed) {
    return failure(
      "RETRY_DELIVERY",
      permission.reason ?? "Delivery cannot be retried.",
      record,
    );
  }

  const failedAttempt = [...record.attempts]
    .reverse()
    .find((attempt) => attempt.status === "DELIVERY_FAILED");

  const recipientId =
    context.recipientId ?? failedAttempt?.recipientId;

  if (!recipientId) {
    return failure(
      "RETRY_DELIVERY",
      "A recipient must be selected before retrying delivery.",
      record,
    );
  }

  const recipient = record.recipients.find(
    (item) => item.id === recipientId,
  );

  if (!recipient) {
    return failure(
      "RETRY_DELIVERY",
      "The selected recipient could not be found.",
      record,
    );
  }

  const channel =
    context.channel ??
    failedAttempt?.channel ??
    recipient.deliveryChannels[0];

  if (!channel) {
    return failure(
      "RETRY_DELIVERY",
      "No delivery channel is available for the retry.",
      record,
    );
  }

  const updatedRecord = retryNotificationDelivery(
    deliveryId,
    context.actor,
    recipientId,
    channel,
  );

  if (!updatedRecord) {
    return failure(
      "RETRY_DELIVERY",
      "The delivery retry could not be started.",
      record,
    );
  }

  return {
    success: true,
    action: "RETRY_DELIVERY",
    record: updatedRecord,
    message: `Delivery retry started through ${channel}.`,
  };
};

export const executeMarkNotificationDelivered = (
  deliveryId: string,
  context: NotificationDeliveryActionContext,
): NotificationDeliveryActionResult => {
  const record = findNotificationDeliveryById(deliveryId);

  if (!record) {
    return failure(
      "MARK_DELIVERED",
      "The delivery record could not be found.",
    );
  }

  const permission = canMarkNotificationDelivered(record);

  if (!permission.allowed) {
    return failure(
      "MARK_DELIVERED",
      permission.reason ?? "Delivery cannot be marked as delivered.",
      record,
    );
  }

  const activeAttempt = record.attempts
    .slice()
    .reverse()
    .find((attempt) => attempt.status === "IN_PROGRESS");

  if (!activeAttempt) {
    return failure(
      "MARK_DELIVERED",
      "No active delivery attempt is available.",
      record,
    );
  }

  const updatedRecord = markNotificationDelivered(
    deliveryId,
    activeAttempt.id,
    context.actor,
  );

  if (!updatedRecord) {
    return failure(
      "MARK_DELIVERED",
      "The delivery could not be marked as delivered.",
      record,
    );
  }

  return {
    success: true,
    action: "MARK_DELIVERED",
    record: updatedRecord,
    message: "Notification delivery marked as delivered.",
  };
};

export const executeMarkNotificationDeliveryFailed = (
  deliveryId: string,
  context: NotificationDeliveryActionContext,
): NotificationDeliveryActionResult => {
  const record = findNotificationDeliveryById(deliveryId);

  if (!record) {
    return failure(
      "MARK_DELIVERY_FAILED",
      "The delivery record could not be found.",
    );
  }

  const permission = canMarkNotificationDeliveryFailed(record);

  if (!permission.allowed) {
    return failure(
      "MARK_DELIVERY_FAILED",
      permission.reason ?? "Delivery cannot be marked as failed.",
      record,
    );
  }

  const activeAttempt = record.attempts
    .slice()
    .reverse()
    .find((attempt) => attempt.status === "IN_PROGRESS");

  if (!activeAttempt) {
    return failure(
      "MARK_DELIVERY_FAILED",
      "No active delivery attempt is available.",
      record,
    );
  }

  const failureReason =
    context.failureReason ?? "UNKNOWN";

  const failureMessage =
    context.failureMessage?.trim() ||
    "Delivery failed and requires review.";

  const updatedRecord = markNotificationDeliveryFailed(
    deliveryId,
    activeAttempt.id,
    context.actor,
    failureReason,
    failureMessage,
  );

  if (!updatedRecord) {
    return failure(
      "MARK_DELIVERY_FAILED",
      "The delivery could not be marked as failed.",
      record,
    );
  }

  return {
    success: true,
    action: "MARK_DELIVERY_FAILED",
    record: updatedRecord,
    message: "Notification delivery marked as failed.",
  };
};

export const executeCancelNotificationDelivery = (
  deliveryId: string,
  context: NotificationDeliveryActionContext,
): NotificationDeliveryActionResult => {
  const record = findNotificationDeliveryById(deliveryId);

  if (!record) {
    return failure(
      "CANCEL_DELIVERY",
      "The delivery record could not be found.",
    );
  }

  const permission = canCancelNotificationDelivery(record);

  if (!permission.allowed) {
    return failure(
      "CANCEL_DELIVERY",
      permission.reason ?? "Delivery cannot be cancelled.",
      record,
    );
  }

  const updatedRecord = cancelNotificationDelivery(
    deliveryId,
    context.actor,
    context.remarks?.trim() ||
      "Delivery cancelled by authorized officer.",
  );

  if (!updatedRecord) {
    return failure(
      "CANCEL_DELIVERY",
      "The delivery could not be cancelled.",
      record,
    );
  }

  return {
    success: true,
    action: "CANCEL_DELIVERY",
    record: updatedRecord,
    message: "Notification delivery cancelled.",
  };
};

export const executeRecordNotificationAcknowledgement = (
  deliveryId: string,
  context: NotificationDeliveryActionContext,
): NotificationDeliveryActionResult => {
  const record = findNotificationDeliveryById(deliveryId);

  if (!record) {
    return failure(
      "RECORD_ACKNOWLEDGEMENT",
      "The delivery record could not be found.",
    );
  }

  if (!record.status || record.status !== "DELIVERED") {
    return failure(
      "RECORD_ACKNOWLEDGEMENT",
      "Acknowledgement can only be recorded after delivery.",
      record,
    );
  }

  const recipientId = context.recipientId;

  if (!recipientId) {
    return failure(
      "RECORD_ACKNOWLEDGEMENT",
      "A recipient must be selected before recording acknowledgement.",
      record,
    );
  }

  const permission = canAcknowledgeNotificationRecipient(
    record,
    recipientId,
  );

  if (!permission.allowed) {
    return failure(
      "RECORD_ACKNOWLEDGEMENT",
      permission.reason ?? "Acknowledgement cannot be recorded.",
      record,
    );
  }

  const acknowledgement = acknowledgeNotificationRecipient(
    deliveryId,
    recipientId,
    context.actor,
    context.acknowledgementMethod ?? "OFFICER_RECORDED",
    context.remarks,
  );

  if (!acknowledgement) {
    return failure(
      "RECORD_ACKNOWLEDGEMENT",
      "The acknowledgement could not be recorded.",
      record,
    );
  }

  const updatedRecord = findNotificationDeliveryById(deliveryId);

  if (!updatedRecord) {
    return failure(
      "RECORD_ACKNOWLEDGEMENT",
      "The acknowledgement was recorded, but the updated delivery record could not be loaded.",
    );
  }

  return {
    success: true,
    action: "RECORD_ACKNOWLEDGEMENT",
    record: updatedRecord,
    message: "Recipient acknowledgement recorded.",
  };
};

export const executeNotificationDeliveryAction = (
  action: NotificationDeliveryAction,
  deliveryId: string,
  context: NotificationDeliveryActionContext,
): NotificationDeliveryActionResult => {
  switch (action) {
    case "START_DELIVERY":
      return executeStartNotificationDelivery(deliveryId, context);

    case "RETRY_DELIVERY":
      return executeRetryNotificationDelivery(deliveryId, context);

    case "MARK_DELIVERED":
      return executeMarkNotificationDelivered(deliveryId, context);

    case "MARK_DELIVERY_FAILED":
      return executeMarkNotificationDeliveryFailed(
        deliveryId,
        context,
      );

    case "CANCEL_DELIVERY":
      return executeCancelNotificationDelivery(
        deliveryId,
        context,
      );

    case "RECORD_ACKNOWLEDGEMENT":
      return executeRecordNotificationAcknowledgement(
        deliveryId,
        context,
      );

    case "VIEW_DELIVERY":
    case "VIEW_AUDIT":
      return failure(
        action,
        "This action is informational and does not modify delivery state.",
        findNotificationDeliveryById(deliveryId),
      );

    default:
      return failure(
        action,
        "The requested delivery action is not supported.",
        findNotificationDeliveryById(deliveryId),
      );
  }
};