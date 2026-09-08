export type NotificationDeliveryChannel =
  | "PORTAL"
  | "EMAIL"
  | "SMS"
  | "POSTAL"
  | "FIELD_SERVICE";

export type NotificationDeliveryStatus =
  | "NOT_STARTED"
  | "QUEUED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "DELIVERY_RETRY_PENDING"
  | "CANCELLED";

export type NotificationDeliveryPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export type NotificationRecipientType =
  | "RECORDED_OWNER"
  | "RIGHT_HOLDER"
  | "AUTHORIZED_REPRESENTATIVE"
  | "PROJECT_AUTHORITY"
  | "GOVERNMENT_OFFICER"
  | "CITIZEN"
  | "OTHER";

export type NotificationAcknowledgementStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "ACKNOWLEDGED"
  | "ACKNOWLEDGEMENT_FAILED"
  | "EXPIRED";

export type NotificationDeliveryFailureReason =
  | "INVALID_CONTACT"
  | "CONTACT_UNAVAILABLE"
  | "PROVIDER_ERROR"
  | "NETWORK_ERROR"
  | "ADDRESS_NOT_FOUND"
  | "RECIPIENT_UNAVAILABLE"
  | "DOCUMENT_ATTACHMENT_FAILED"
  | "UNAUTHORIZED_CHANNEL"
  | "DUPLICATE_DELIVERY"
  | "UNKNOWN";

export type NotificationAcknowledgementMethod =
  | "PORTAL"
  | "OTP"
  | "DIGITAL_SIGNATURE"
  | "OFFICER_RECORDED"
  | "FIELD_VERIFICATION"
  | "OTHER";

export interface NotificationDeliveryRecipient {
  id: string;
  notificationId: string;
  recipientType: NotificationRecipientType;
  recipientName: string;
  contactReference?: string;
  maskedContact?: string;
  deliveryChannels: NotificationDeliveryChannel[];
  acknowledgementRequired: boolean;
  acknowledgementDeadline?: string;
  sensitivity: "STANDARD" | "RESTRICTED" | "SENSITIVE";
}

export interface NotificationDeliveryAttempt {
  id: string;
  notificationId: string;
  recipientId: string;
  channel: NotificationDeliveryChannel;
  attemptNumber: number;
  status: NotificationDeliveryStatus;
  requestedAt: string;
  startedAt?: string;
  completedAt?: string;
  providerReference?: string;
  failureReason?: NotificationDeliveryFailureReason;
  failureMessage?: string;
  responseReference?: string;
}

export interface NotificationAcknowledgement {
  id: string;
  notificationId: string;
  recipientId: string;
  status: NotificationAcknowledgementStatus;
  method?: NotificationAcknowledgementMethod;
  acknowledgedAt?: string;
  acknowledgementReference?: string;
  recordedByUserId?: string;
  remarks?: string;
}

export interface NotificationDeliveryRecord {
  id: string;
  notificationId: string;
  issuanceId: string;
  priority: NotificationDeliveryPriority;
  status: NotificationDeliveryStatus;
  recipients: NotificationDeliveryRecipient[];
  attempts: NotificationDeliveryAttempt[];
  acknowledgements: NotificationAcknowledgement[];
  createdAt: string;
  updatedAt: string;
  lastAttemptAt?: string;
  nextRetryAt?: string;
}

export interface NotificationDeliverySummary {
  total: number;
  notStarted: number;
  queued: number;
  inProgress: number;
  delivered: number;
  failed: number;
  retryPending: number;
  cancelled: number;
  acknowledgementPending: number;
  acknowledgementReceived: number;
}

export interface NotificationDeliveryDataset {
  records: NotificationDeliveryRecord[];
  summary: NotificationDeliverySummary;
}

export interface CreateNotificationDeliveryInput {
  notificationId: string;
  issuanceId: string;
  priority?: NotificationDeliveryPriority;
  recipients: NotificationDeliveryRecipient[];
}

export interface UpdateNotificationDeliveryInput {
  status?: NotificationDeliveryStatus;
  priority?: NotificationDeliveryPriority;
  lastAttemptAt?: string;
  nextRetryAt?: string;
}

export interface CreateNotificationDeliveryAttemptInput {
  notificationId: string;
  recipientId: string;
  channel: NotificationDeliveryChannel;
  attemptNumber: number;
}

export interface UpdateNotificationDeliveryAttemptInput {
  status: NotificationDeliveryStatus;
  startedAt?: string;
  completedAt?: string;
  providerReference?: string;
  failureReason?: NotificationDeliveryFailureReason;
  failureMessage?: string;
  responseReference?: string;
}

export interface CreateNotificationAcknowledgementInput {
  notificationId: string;
  recipientId: string;
  status: NotificationAcknowledgementStatus;
  method?: NotificationAcknowledgementMethod;
  acknowledgedAt?: string;
  acknowledgementReference?: string;
  recordedByUserId?: string;
  remarks?: string;
}

export type NotificationDeliveryAction =
  | "START_DELIVERY"
  | "RETRY_DELIVERY"
  | "MARK_DELIVERED"
  | "MARK_DELIVERY_FAILED"
  | "CANCEL_DELIVERY"
  | "RECORD_ACKNOWLEDGEMENT"
  | "VIEW_DELIVERY"
  | "VIEW_AUDIT";

export interface NotificationDeliveryActor {
  userId: string;
  name: string;
  designation: string;
  department: string;
  organization: string;
  jurisdiction: string;
  jurisdictionType:
    | "NATIONAL"
    | "STATE"
    | "DISTRICT"
    | "PROJECT"
    | "PARCEL";
}

export interface NotificationDeliveryActionRecord {
  id: string;
  deliveryId: string;
  action: NotificationDeliveryAction;
  actor: NotificationDeliveryActor;
  timestamp: string;
  remarks?: string;
}

export interface NotificationDeliveryScope {
  projectId?: string;
  acquisitionCaseId?: string;
  parcelId?: string;
  district?: string;
  state?: string;
}

export interface NotificationDeliveryFilters {
  status?: NotificationDeliveryStatus;
  channel?: NotificationDeliveryChannel;
  priority?: NotificationDeliveryPriority;
  acknowledgementStatus?: NotificationAcknowledgementStatus;
  search?: string;
}