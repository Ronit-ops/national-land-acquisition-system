export type NotificationType =
  | "PRELIMINARY_NOTIFICATION"
  | "HEARING_NOTICE"
  | "DECLARATION_NOTICE"
  | "AWARD_NOTICE"
  | "COMPENSATION_NOTICE"
  | "RR_NOTICE"
  | "POSSESSION_NOTICE"
  | "CASE_UPDATE"
  | "DOCUMENT_AVAILABLE"
  | "GENERAL_INFORMATION";

export type NotificationPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export type NotificationStatus =
  | "DRAFT"
  | "READY_FOR_ISSUANCE"
  | "ISSUED"
  | "DELIVERY_IN_PROGRESS"
  | "DELIVERED"
  | "ACKNOWLEDGED"
  | "FAILED"
  | "CANCELLED";

export type NotificationDeliveryChannel =
  | "PORTAL"
  | "SMS"
  | "EMAIL"
  | "WHATSAPP"
  | "POSTAL"
  | "IN_PERSON";

export type NotificationDeliveryStatus =
  | "PENDING"
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "ACKNOWLEDGED"
  | "FAILED"
  | "NOT_APPLICABLE";

export type NotificationAudience =
  | "RECORDED_RIGHT_HOLDER"
  | "AUTHORIZED_REPRESENTATIVE"
  | "PROJECT_AFFECTED_CITIZEN"
  | "GOVERNMENT_OFFICER";

export type NotificationSource =
  | "CASE_WORKFLOW"
  | "OFFICER_ACTION"
  | "SYSTEM_GENERATED"
  | "CITIZEN_REQUEST"
  | "DEMONSTRATION_DATA";

export type NotificationSensitivity =
  | "PUBLIC"
  | "CITIZEN_AUTHORIZED"
  | "RESTRICTED"
  | "OFFICER_ONLY";

export type NotificationReferenceType =
  | "CASE"
  | "PARCEL"
  | "PROJECT"
  | "DOCUMENT"
  | "PROCEEDING"
  | "AWARD"
  | "COMPENSATION"
  | "R_AND_R"
  | "POSSESSION";

export type NotificationDeliveryAttempt = {
  id: string;
  channel: NotificationDeliveryChannel;
  status: NotificationDeliveryStatus;
  attemptedAt: string | null;
  deliveredAt: string | null;
  acknowledgedAt: string | null;
  failureReason?: string;
  providerReference?: string;
};

export type NotificationRecipient = {
  id: string;
  name: string;
  audience: NotificationAudience;
  mobileNumberMasked?: string;
  emailMasked?: string;
  preferredChannel?: NotificationDeliveryChannel;
};

export type NotificationReference = {
  type: NotificationReferenceType;
  id: string;
  displayReference: string;
};

export type NotificationRecord = {
  id: string;

  notificationReference: string;

  type: NotificationType;

  title: string;

  message: string;

  priority: NotificationPriority;

  status: NotificationStatus;

  source: NotificationSource;

  sensitivity: NotificationSensitivity;

  recipient: NotificationRecipient;

  references: NotificationReference[];

  issuedAt: string | null;

  scheduledAt: string | null;

  acknowledgedAt: string | null;

  acknowledgementRequired: boolean;

  acknowledgementDeadline: string | null;

  deliveryAttempts: NotificationDeliveryAttempt[];

  documentId?: string;

  caseReference?: string;

  projectId?: string;

  parcelId?: string;

  createdAt: string;

  updatedAt: string;
};

export type NotificationSummary = {
  total: number;

  drafts: number;

  issued: number;

  delivered: number;

  acknowledged: number;

  pendingDelivery: number;

  failed: number;

  acknowledgementRequired: number;

  overdueAcknowledgements: number;
};

export type NotificationDataset = {
  notifications: NotificationRecord[];

  summary: NotificationSummary;
};

export type CreateNotificationInput = {
  type: NotificationType;

  title: string;

  message: string;

  priority: NotificationPriority;

  source: NotificationSource;

  sensitivity: NotificationSensitivity;

  recipient: NotificationRecipient;

  references: NotificationReference[];

  acknowledgementRequired: boolean;

  acknowledgementDeadline?: string | null;

  documentId?: string;

  caseReference?: string;

  projectId?: string;

  parcelId?: string;

  scheduledAt?: string | null;
};

export type UpdateNotificationInput = {
  title?: string;

  message?: string;

  priority?: NotificationPriority;

  status?: NotificationStatus;

  scheduledAt?: string | null;

  issuedAt?: string | null;

  acknowledgementRequired?: boolean;

  acknowledgementDeadline?: string | null;

  acknowledgedAt?: string | null;
};

export type NotificationScope = {
  caseReference?: string;

  projectId?: string;

  parcelId?: string;

  audience?: NotificationAudience;
};

export type NotificationFilters = {
  type?: NotificationType;

  priority?: NotificationPriority;

  status?: NotificationStatus;

  channel?: NotificationDeliveryChannel;

  source?: NotificationSource;

  caseReference?: string;

  projectId?: string;

  parcelId?: string;

  acknowledgementRequired?: boolean;
};