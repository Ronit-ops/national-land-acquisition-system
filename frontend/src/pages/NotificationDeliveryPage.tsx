import { useMemo, useState } from "react";
import {
  AlertCircle,
  Ban,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  RefreshCw,
  Send,
  ShieldAlert,
  Smartphone,
  User,
  XCircle,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";

import {
  getNotificationDeliveryDataset,
} from "../features/notifications/data/notificationDeliveryData";

import {
  filterNotificationDeliveries,
  getNotificationAcknowledgementLabel,
  getNotificationDeliveryChannelLabel,
  getNotificationDeliveryLabel,
  hasNotificationDeliveryFailures,
  hasPendingNotificationAcknowledgements,
  canStartNotificationDelivery,
  canRetryNotificationDelivery,
  canMarkNotificationDelivered,
  canMarkNotificationDeliveryFailed,
  canCancelNotificationDelivery,
  canAcknowledgeNotificationRecipient,
} from "../features/notifications/utils/notificationDeliveryLookup";

import {
  executeStartNotificationDelivery,
  executeRetryNotificationDelivery,
  executeMarkNotificationDelivered,
  executeMarkNotificationDeliveryFailed,
  executeCancelNotificationDelivery,
  executeRecordNotificationAcknowledgement,
} from "../features/notifications/utils/notificationDeliveryActions";

import type {
  NotificationAcknowledgementMethod,
  NotificationAcknowledgementStatus,
  NotificationDeliveryChannel,
  NotificationDeliveryRecord,
  NotificationDeliveryStatus,
} from "../features/notifications/types/notificationDelivery";

import "../styles/application.css";
import "../styles/notification-delivery.css";

const statusLabels: Record<
  NotificationDeliveryStatus,
  string
> = {
  NOT_STARTED: "Not Started",
  QUEUED: "Queued",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
  DELIVERY_FAILED: "Delivery Failed",
  DELIVERY_RETRY_PENDING: "Retry Pending",
  CANCELLED: "Cancelled",
};

const statusClass: Record<
  NotificationDeliveryStatus,
  string
> = {
  NOT_STARTED:
    "notification-delivery-status-not-started",

  QUEUED:
    "notification-delivery-status-queued",

  IN_PROGRESS:
    "notification-delivery-status-progress",

  DELIVERED:
    "notification-delivery-status-delivered",

  DELIVERY_FAILED:
    "notification-delivery-status-failed",

  DELIVERY_RETRY_PENDING:
    "notification-delivery-status-retry",

  CANCELLED:
    "notification-delivery-status-cancelled",
};

const priorityClass: Record<
  NotificationDeliveryRecord["priority"],
  string
> = {
  LOW:
    "notification-delivery-priority-low",

  NORMAL:
    "notification-delivery-priority-normal",

  HIGH:
    "notification-delivery-priority-high",

  URGENT:
    "notification-delivery-priority-urgent",
};

const acknowledgementStatusClass: Record<
  NotificationAcknowledgementStatus,
  string
> = {
  NOT_REQUIRED:
    "notification-delivery-ack-not-required",

  PENDING:
    "notification-delivery-ack-pending",

  ACKNOWLEDGED:
    "notification-delivery-ack-acknowledged",

  ACKNOWLEDGEMENT_FAILED:
    "notification-delivery-ack-failed",

  EXPIRED:
    "notification-delivery-ack-expired",
};

function formatDateTime(
  value?: string,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function getChannelIcon(
  channel: NotificationDeliveryChannel,
) {
  switch (channel) {
    case "SMS":
      return <Smartphone size={15} />;

    case "EMAIL":
      return <Mail size={15} />;

    case "PORTAL":
      return <Bell size={15} />;

    case "POSTAL":
      return <FileText size={15} />;

    case "FIELD_SERVICE":
      return <User size={15} />;

    default:
      return <Send size={15} />;
  }
}

function getLatestAttempt(
  record: NotificationDeliveryRecord,
) {
  return [...record.attempts]
    .sort(
      (first, second) =>
        second.attemptNumber -
        first.attemptNumber,
    )
    .at(0);
}

function getLatestFailedAttempt(
  record: NotificationDeliveryRecord,
) {
  return [...record.attempts]
    .reverse()
    .find(
      (attempt) =>
        attempt.status ===
        "DELIVERY_FAILED",
    );
}

function getPrimaryRecipient(
  record: NotificationDeliveryRecord,
) {
  return record.recipients[0];
}

function getDefaultAcknowledgementMethod(
  record: NotificationDeliveryRecord,
): NotificationAcknowledgementMethod {
  const pendingAcknowledgement =
    record.acknowledgements.find(
      (item) =>
        item.status === "PENDING",
    );

  if (pendingAcknowledgement?.method) {
    return pendingAcknowledgement.method;
  }

  return "OFFICER_RECORDED";
}

function getActionErrorMessage(
  result: unknown,
): string {
  if (
    typeof result === "object" &&
    result !== null &&
    "message" in result &&
    typeof result.message === "string"
  ) {
    return result.message;
  }

  return "The requested delivery action could not be completed.";
}

export default function NotificationDeliveryPage() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "ALL" | NotificationDeliveryStatus
    >("ALL");

  const [ackFilter, setAckFilter] =
    useState<
      "ALL" | NotificationAcknowledgementStatus
    >("ALL");

  const [selectedId, setSelectedId] =
    useState<string | null>("DEL-001");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [actionMessage, setActionMessage] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const dataset = useMemo(
    () => getNotificationDeliveryDataset(),
    [refreshKey],
  );

  const filteredRecords = useMemo(
    () =>
      filterNotificationDeliveries(
        dataset.records,
        {
          search: searchTerm,

          status:
            statusFilter === "ALL"
              ? undefined
              : statusFilter,

          acknowledgementStatus:
            ackFilter === "ALL"
              ? undefined
              : ackFilter,
        },
      ),
    [
      dataset.records,
      searchTerm,
      statusFilter,
      ackFilter,
    ],
  );

  const selectedRecord = useMemo(() => {
    if (filteredRecords.length === 0) {
      return null;
    }

    if (selectedId) {
      const existing =
        filteredRecords.find(
          (record) =>
            record.id === selectedId,
        );

      if (existing) {
        return existing;
      }
    }

    return filteredRecords[0];
  }, [
    filteredRecords,
    selectedId,
  ]);

  const latestFailedAttempt =
    selectedRecord
      ? getLatestFailedAttempt(
          selectedRecord,
        )
      : undefined;

  const latestAttempt =
    selectedRecord
      ? getLatestAttempt(
          selectedRecord,
        )
      : undefined;

  const primaryRecipient =
    selectedRecord
      ? getPrimaryRecipient(
          selectedRecord,
        )
      : undefined;

  const actor = user
    ? {
        userId: user.id,
        name: user.name,
        designation:
          user.designation,
        department:
          user.department,
        organization:
          user.organization,
        jurisdiction:
          user.jurisdiction,
        jurisdictionType:
          user.jurisdictionType,
      }
    : null;

  const actionContext = useMemo(() => {
    if (!actor) {
      return null;
    }

    return {
      actor,
    } as Parameters<
      typeof executeStartNotificationDelivery
    >[1];
  }, [actor]);

  /*
   * IMPORTANT:
   *
   * The lookup functions return permission objects:
   *
   * {
   *   allowed: boolean,
   *   reason?: string
   * }
   *
   * Therefore the UI must explicitly read `.allowed`.
   */

  const startDeliveryAllowed =
    selectedRecord &&
    primaryRecipient
      ? canStartNotificationDelivery(
          selectedRecord,
        ).allowed
      : false;

  const retryDeliveryAllowed =
    selectedRecord
      ? canRetryNotificationDelivery(
          selectedRecord,
        ).allowed
      : false;

  const markDeliveredAllowed =
    selectedRecord
      ? canMarkNotificationDelivered(
          selectedRecord,
        ).allowed
      : false;

  const markFailedAllowed =
    selectedRecord
      ? canMarkNotificationDeliveryFailed(
          selectedRecord,
        ).allowed
      : false;

  const cancelDeliveryAllowed =
    selectedRecord
      ? canCancelNotificationDelivery(
          selectedRecord,
        ).allowed
      : false;

  const pendingAcknowledgement =
    selectedRecord?.acknowledgements.find(
      (item) =>
        item.status === "PENDING",
    );

  const acknowledgeAllowed =
    Boolean(
      selectedRecord &&
        pendingAcknowledgement &&
        canAcknowledgeNotificationRecipient(
          selectedRecord,
          pendingAcknowledgement.recipientId,
        ).allowed,
    );

  async function runAction(
    action: () => unknown,
    successMessage: string,
  ) {
    if (
      !actionContext ||
      isProcessing
    ) {
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);
    setActionError(null);

    try {
      const result = action();

      if (
        typeof result === "object" &&
        result !== null &&
        "success" in result &&
        result.success === false
      ) {
        throw new Error(
          getActionErrorMessage(
            result,
          ),
        );
      }

      setActionMessage(
        successMessage,
      );

      setRefreshKey(
        (current) =>
          current + 1,
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "The requested delivery action could not be completed.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function handleStartDelivery() {
    if (
      !selectedRecord ||
      !primaryRecipient ||
      !actionContext
    ) {
      return;
    }

    const channel =
      latestAttempt?.channel ??
      primaryRecipient
        .deliveryChannels[0];

    if (!channel) {
      setActionError(
        "No delivery channel is available for this recipient.",
      );

      return;
    }

    void runAction(
      () =>
        executeStartNotificationDelivery(
          selectedRecord.id,
          {
            ...actionContext,

            recipientId:
              primaryRecipient.id,

            channel,
          },
        ),

      "Delivery started successfully.",
    );
  }

  function handleRetryDelivery() {
    if (
      !selectedRecord ||
      !primaryRecipient ||
      !actionContext
    ) {
      return;
    }

    const channel =
      latestFailedAttempt?.channel ??
      latestAttempt?.channel ??
      primaryRecipient
        .deliveryChannels[0];

    if (!channel) {
      setActionError(
        "No delivery channel is available for retry.",
      );

      return;
    }

    void runAction(
      () =>
        executeRetryNotificationDelivery(
          selectedRecord.id,
          {
            ...actionContext,

            recipientId:
              primaryRecipient.id,

            channel,
          },
        ),

      "Delivery retry has been queued.",
    );
  }

  function handleMarkDelivered() {
    if (
      !selectedRecord ||
      !actionContext
    ) {
      return;
    }

    void runAction(
      () =>
        executeMarkNotificationDelivered(
          selectedRecord.id,
          actionContext,
        ),

      "Delivery marked as delivered.",
    );
  }

  function handleMarkFailed() {
    if (
      !selectedRecord ||
      !actionContext
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Mark the active delivery attempt as failed?",
      );

    if (!confirmed) {
      return;
    }

    void runAction(
      () =>
        executeMarkNotificationDeliveryFailed(
          selectedRecord.id,
          actionContext,
        ),

      "Delivery failure has been recorded.",
    );
  }

  function handleCancelDelivery() {
    if (
      !selectedRecord ||
      !actionContext
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Cancel this delivery workflow? This action will be recorded in the delivery action history.",
      );

    if (!confirmed) {
      return;
    }

    void runAction(
      () =>
        executeCancelNotificationDelivery(
          selectedRecord.id,
          {
            ...actionContext,

            remarks:
              "Delivery cancelled by authorized officer from the delivery workspace.",
          },
        ),

      "Delivery has been cancelled.",
    );
  }

  function handleAcknowledgement() {
    if (
      !selectedRecord ||
      !pendingAcknowledgement ||
      !actionContext
    ) {
      return;
    }

    void runAction(
      () =>
        executeRecordNotificationAcknowledgement(
          selectedRecord.id,
          {
            ...actionContext,

            recipientId:
              pendingAcknowledgement.recipientId,

            acknowledgementMethod:
              getDefaultAcknowledgementMethod(
                selectedRecord,
              ),
          },
        ),

      "Recipient acknowledgement has been recorded.",
    );
  }

  return (
    <div className="notification-delivery-workspace">
      <div className="notification-delivery-page-header">
        <div>
          <div className="notification-delivery-eyebrow">
            COMMUNICATION OPERATIONS
          </div>

          <h1>
            Delivery & Acknowledgement
          </h1>

          <p>
            Monitor issued notification
            delivery, recipient responses,
            delivery failures, retries, and
            acknowledgement records.
          </p>
        </div>

        <div className="notification-delivery-header-badge">
          <ShieldAlert size={17} />

          <span>
            Controlled delivery workspace
          </span>
        </div>
      </div>

      {actionMessage && (
        <div
          className="notification-delivery-action-feedback notification-delivery-action-feedback-success"
          role="status"
        >
          <CheckCircle2 size={17} />

          <span>
            {actionMessage}
          </span>
        </div>
      )}

      {actionError && (
        <div
          className="notification-delivery-action-feedback notification-delivery-action-feedback-error"
          role="alert"
        >
          <AlertCircle size={17} />

          <span>
            {actionError}
          </span>
        </div>
      )}

      <section className="notification-delivery-metrics">
        <div className="notification-delivery-metric-card">
          <div className="notification-delivery-metric-icon">
            <Send size={19} />
          </div>

          <div>
            <span>
              Total deliveries
            </span>

            <strong>
              {dataset.summary.total}
            </strong>
          </div>
        </div>

        <div className="notification-delivery-metric-card">
          <div className="notification-delivery-metric-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>
              In progress
            </span>

            <strong>
              {dataset.summary.inProgress +
                dataset.summary.queued}
            </strong>
          </div>
        </div>

        <div className="notification-delivery-metric-card">
          <div className="notification-delivery-metric-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>
              Delivered
            </span>

            <strong>
              {dataset.summary.delivered}
            </strong>
          </div>
        </div>

        <div className="notification-delivery-metric-card notification-delivery-metric-warning">
          <div className="notification-delivery-metric-icon">
            <AlertCircle size={19} />
          </div>

          <div>
            <span>
              Failures
            </span>

            <strong>
              {dataset.summary.failed}
            </strong>
          </div>
        </div>

        <div className="notification-delivery-metric-card">
          <div className="notification-delivery-metric-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>
              Awaiting acknowledgement
            </span>

            <strong>
              {
                dataset.summary
                  .acknowledgementPending
              }
            </strong>
          </div>
        </div>
      </section>

      <section className="notification-delivery-filter-bar">
        <div className="notification-delivery-search">
          <SearchIcon />

          <input
            type="search"
            placeholder="Search delivery, notification, recipient or reference..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value,
              )
            }
            aria-label="Search notification deliveries"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "ALL"
                | NotificationDeliveryStatus,
            )
          }
          aria-label="Filter delivery status"
        >
          <option value="ALL">
            All delivery statuses
          </option>

          {Object.entries(
            statusLabels,
          ).map(
            ([
              value,
              label,
            ]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </select>

        <select
          value={ackFilter}
          onChange={(event) =>
            setAckFilter(
              event.target.value as
                | "ALL"
                | NotificationAcknowledgementStatus,
            )
          }
          aria-label="Filter acknowledgement status"
        >
          <option value="ALL">
            All acknowledgements
          </option>

          <option value="PENDING">
            Pending acknowledgement
          </option>

          <option value="ACKNOWLEDGED">
            Acknowledged
          </option>

          <option value="EXPIRED">
            Expired
          </option>
        </select>

        <div className="notification-delivery-result-count">
          {filteredRecords.length}{" "}
          records
        </div>
      </section>

      <section className="notification-delivery-content-grid">
        <div className="notification-delivery-list-panel">
          <div className="notification-delivery-list-header">
            <div>
              <span className="notification-delivery-section-label">
                DELIVERY QUEUE
              </span>

              <h2>
                Issued notification
                deliveries
              </h2>
            </div>

            <span className="notification-delivery-list-count">
              {filteredRecords.length}
            </span>
          </div>

          <div className="notification-delivery-list">
            {filteredRecords.map(
              (record) => {
                const recipient =
                  getPrimaryRecipient(
                    record,
                  );

                const attempt =
                  getLatestAttempt(
                    record,
                  );

                const isSelected =
                  selectedRecord?.id ===
                  record.id;

                return (
                  <button
                    key={record.id}
                    type="button"
                    className={`notification-delivery-list-item ${
                      isSelected
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedId(
                        record.id,
                      );

                      setActionMessage(
                        null,
                      );

                      setActionError(
                        null,
                      );
                    }}
                  >
                    <div className="notification-delivery-list-top">
                      <span
                        className={`notification-delivery-priority-dot ${
                          priorityClass[
                            record
                              .priority
                          ]
                        }`}
                      />

                      <span className="notification-delivery-reference">
                        {record.id}
                      </span>

                      <span
                        className={`notification-delivery-status-pill ${
                          statusClass[
                            record
                              .status
                          ]
                        }`}
                      >
                        {
                          statusLabels[
                            record
                              .status
                          ]
                        }
                      </span>
                    </div>

                    <strong>
                      {
                        record.notificationId
                      }
                    </strong>

                    <p>
                      {
                        recipient?.recipientName ??
                        "Recipient not available"
                      }
                    </p>

                    <div className="notification-delivery-list-meta">
                      <span>
                        <User
                          size={13}
                        />

                        {recipient?.recipientType
                          .replaceAll(
                            "_",
                            " ",
                          )
                          .toLowerCase()}
                      </span>

                      {attempt && (
                        <span>
                          {getChannelIcon(
                            attempt.channel,
                          )}

                          {getNotificationDeliveryChannelLabel(
                            attempt.channel,
                          )}
                        </span>
                      )}

                      {hasPendingNotificationAcknowledgements(
                        record,
                      ) && (
                        <span>
                          <Clock3
                            size={13}
                          />

                          Ack pending
                        </span>
                      )}
                    </div>
                  </button>
                );
              },
            )}

            {filteredRecords.length ===
              0 && (
              <div className="notification-delivery-empty">
                <Send size={30} />

                <strong>
                  No delivery records
                  found
                </strong>

                <p>
                  Try changing the
                  search term or
                  delivery filters.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="notification-delivery-detail-panel">
          {selectedRecord ? (
            <>
              <div className="notification-delivery-detail-header">
                <div>
                  <span className="notification-delivery-section-label">
                    DELIVERY DETAIL
                  </span>

                  <h2>
                    {
                      selectedRecord.notificationId
                    }
                  </h2>

                  <span className="notification-delivery-reference">
                    {selectedRecord.id} ·{" "}
                    {
                      selectedRecord.issuanceId
                    }
                  </span>
                </div>

                <span
                  className={`notification-delivery-status-pill ${
                    statusClass[
                      selectedRecord.status
                    ]
                  }`}
                >
                  {
                    statusLabels[
                      selectedRecord.status
                    ]
                  }
                </span>
              </div>

              <div className="notification-delivery-action-panel">
                <div>
                  <span className="notification-delivery-section-label">
                    OFFICER ACTIONS
                  </span>

                  <p>
                    Available actions depend
                    on the current delivery
                    state and recorded
                    workflow permissions.
                  </p>
                </div>

                <div className="notification-delivery-action-grid">
                  {startDeliveryAllowed && (
                    <button
                      type="button"
                      className="notification-delivery-action-button notification-delivery-action-primary"
                      onClick={
                        handleStartDelivery
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      <Send size={15} />

                      <span>
                        {isProcessing
                          ? "Processing..."
                          : "Start Delivery"}
                      </span>
                    </button>
                  )}

                  {retryDeliveryAllowed && (
                    <button
                      type="button"
                      className="notification-delivery-action-button notification-delivery-action-primary"
                      onClick={
                        handleRetryDelivery
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      <RefreshCw
                        size={15}
                      />

                      <span>
                        {isProcessing
                          ? "Processing..."
                          : "Retry Delivery"}
                      </span>
                    </button>
                  )}

                  {markDeliveredAllowed && (
                    <button
                      type="button"
                      className="notification-delivery-action-button notification-delivery-action-success"
                      onClick={
                        handleMarkDelivered
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      <CheckCircle2
                        size={15}
                      />

                      <span>
                        Mark Delivered
                      </span>
                    </button>
                  )}

                  {markFailedAllowed && (
                    <button
                      type="button"
                      className="notification-delivery-action-button notification-delivery-action-warning"
                      onClick={
                        handleMarkFailed
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      <XCircle size={15} />

                      <span>
                        Mark Failed
                      </span>
                    </button>
                  )}

                  {acknowledgeAllowed && (
                    <button
                      type="button"
                      className="notification-delivery-action-button notification-delivery-action-success"
                      onClick={
                        handleAcknowledgement
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      <CheckCircle2
                        size={15}
                      />

                      <span>
                        Record
                        Acknowledgement
                      </span>
                    </button>
                  )}

                  {cancelDeliveryAllowed && (
                    <button
                      type="button"
                      className="notification-delivery-action-button notification-delivery-action-danger"
                      onClick={
                        handleCancelDelivery
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      <Ban size={15} />

                      <span>
                        Cancel Delivery
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="notification-delivery-detail-alert">
                <div
                  className={`notification-delivery-priority-badge ${
                    priorityClass[
                      selectedRecord
                        .priority
                    ]
                  }`}
                >
                  {
                    selectedRecord.priority
                  }
                </div>

                <p>
                  Delivery activity is
                  tracked separately from
                  recipient acknowledgement.
                  A delivered notification is
                  not automatically considered
                  acknowledged.
                </p>
              </div>

              <div className="notification-delivery-detail-section">
                <span className="notification-delivery-section-label">
                  RECIPIENT
                </span>

                {primaryRecipient ? (
                  <div className="notification-delivery-recipient-card">
                    <div className="notification-delivery-avatar">
                      <User size={18} />
                    </div>

                    <div>
                      <strong>
                        {
                          primaryRecipient.recipientName
                        }
                      </strong>

                      <span>
                        {primaryRecipient.recipientType
                          .replaceAll(
                            "_",
                            " ",
                          )
                          .toLowerCase()}
                      </span>

                      <small>
                        {
                          primaryRecipient.maskedContact ??
                          "Contact reference not recorded"
                        }
                      </small>
                    </div>
                  </div>
                ) : (
                  <div className="notification-delivery-no-data">
                    Recipient information is
                    unavailable.
                  </div>
                )}
              </div>

              <div className="notification-delivery-detail-section">
                <span className="notification-delivery-section-label">
                  DELIVERY CHANNELS
                </span>

                <div className="notification-delivery-channel-grid">
                  {primaryRecipient?.deliveryChannels.map(
                    (channel) => (
                      <div
                        key={channel}
                        className="notification-delivery-channel-card"
                      >
                        {getChannelIcon(
                          channel,
                        )}

                        <div>
                          <span>
                            Channel
                          </span>

                          <strong>
                            {getNotificationDeliveryChannelLabel(
                              channel,
                            )}
                          </strong>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="notification-delivery-detail-grid">
                <div>
                  <span>
                    Created
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedRecord.createdAt,
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Last updated
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedRecord.updatedAt,
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Last attempt
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedRecord.lastAttemptAt,
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Next retry
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedRecord.nextRetryAt,
                    )}
                  </strong>
                </div>
              </div>

              <div className="notification-delivery-detail-section">
                <span className="notification-delivery-section-label">
                  DELIVERY ATTEMPTS
                </span>

                <div className="notification-delivery-attempt-list">
                  {selectedRecord.attempts.length >
                  0 ? (
                    selectedRecord.attempts.map(
                      (attempt) => (
                        <div
                          key={attempt.id}
                          className="notification-delivery-attempt-row"
                        >
                          <div className="notification-delivery-attempt-icon">
                            {getChannelIcon(
                              attempt.channel,
                            )}
                          </div>

                          <div className="notification-delivery-attempt-main">
                            <strong>
                              {getNotificationDeliveryChannelLabel(
                                attempt.channel,
                              )}
                            </strong>

                            <span>
                              Attempt #
                              {
                                attempt.attemptNumber
                              }{" "}
                              ·{" "}
                              {formatDateTime(
                                attempt.requestedAt,
                              )}
                            </span>

                            {attempt.providerReference && (
                              <small>
                                Provider ref:{" "}
                                {
                                  attempt.providerReference
                                }
                              </small>
                            )}
                          </div>

                          <span
                            className={`notification-delivery-attempt-status ${
                              statusClass[
                                attempt
                                  .status
                              ]
                            }`}
                          >
                            {getNotificationDeliveryLabel(
                              attempt.status,
                            )}
                          </span>

                          {attempt.failureMessage && (
                            <div className="notification-delivery-attempt-failure">
                              <AlertCircle
                                size={14}
                              />

                              <span>
                                {
                                  attempt.failureMessage
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      ),
                    )
                  ) : (
                    <div className="notification-delivery-no-data">
                      No delivery attempts
                      recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {hasNotificationDeliveryFailures(
                selectedRecord,
              ) && (
                <div className="notification-delivery-failure-alert">
                  <XCircle size={18} />

                  <div>
                    <strong>
                      Delivery requires
                      attention
                    </strong>

                    <p>
                      {
                        latestFailedAttempt?.failureMessage ??
                        "A delivery attempt has failed and may require retry."
                      }
                    </p>

                    {latestFailedAttempt?.failureReason && (
                      <small>
                        Reason:{" "}
                        {
                          latestFailedAttempt.failureReason
                        }
                      </small>
                    )}
                  </div>
                </div>
              )}

              <div className="notification-delivery-detail-section">
                <span className="notification-delivery-section-label">
                  ACKNOWLEDGEMENT
                </span>

                <div className="notification-delivery-ack-list">
                  {selectedRecord.acknowledgements.map(
                    (
                      acknowledgement,
                    ) => {
                      const recipient =
                        selectedRecord.recipients.find(
                          (item) =>
                            item.id ===
                            acknowledgement.recipientId,
                        );

                      return (
                        <div
                          key={
                            acknowledgement.id
                          }
                          className="notification-delivery-ack-row"
                        >
                          <div>
                            <strong>
                              {
                                recipient?.recipientName ??
                                acknowledgement.recipientId
                              }
                            </strong>

                            <span>
                              {acknowledgement.method
                                ? acknowledgement.method
                                    .replaceAll(
                                      "_",
                                      " ",
                                    )
                                    .toLowerCase()
                                : "No acknowledgement method recorded"}
                            </span>
                          </div>

                          <div>
                            <span
                              className={`notification-delivery-ack-status ${
                                acknowledgementStatusClass[
                                  acknowledgement
                                    .status
                                ]
                              }`}
                            >
                              {getNotificationAcknowledgementLabel(
                                acknowledgement.status,
                              )}
                            </span>

                            {acknowledgement.acknowledgedAt && (
                              <small>
                                {formatDateTime(
                                  acknowledgement.acknowledgedAt,
                                )}
                              </small>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="notification-delivery-detail-footer">
                <div>
                  <span>
                    Acknowledgement
                    required
                  </span>

                  <strong>
                    {primaryRecipient?.acknowledgementRequired
                      ? "Yes"
                      : "No"}
                  </strong>
                </div>

                <div>
                  <span>
                    Acknowledgement
                    deadline
                  </span>

                  <strong>
                    {formatDateTime(
                      primaryRecipient?.acknowledgementDeadline,
                    )}
                  </strong>
                </div>
              </div>

              <div className="notification-delivery-demo-note">
                <ShieldAlert size={15} />

                <span>
                  Delivery records shown
                  here are demonstration
                  data. SMS, email, postal,
                  portal, and field-service
                  channels are simulated and
                  are not connected to live
                  government providers.
                </span>
              </div>
            </>
          ) : (
            <div className="notification-delivery-empty">
              <Send size={30} />

              <strong>
                Select a delivery record
              </strong>

              <p>
                Choose a delivery from the
                queue to inspect recipients,
                attempts, failures, and
                acknowledgement status.
              </p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}