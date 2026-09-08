import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Send,
  ShieldAlert,
  Smartphone,
  User,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAllNotifications,
  getNotificationSummary,
} from "../features/notifications/utils/notificationLookup";

import type {
  NotificationRecord,
  NotificationStatus,
} from "../features/notifications/types/notification";

import "../styles/application.css";
import "../styles/notifications.css";

const statusLabels: Record<
  NotificationStatus,
  string
> = {
  DRAFT: "Draft",
  READY_FOR_ISSUANCE: "Ready",
  ISSUED: "Issued",
  DELIVERY_IN_PROGRESS:
    "Delivering",
  DELIVERED: "Delivered",
  ACKNOWLEDGED: "Acknowledged",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const statusClass: Record<
  NotificationStatus,
  string
> = {
  DRAFT: "notification-status-draft",
  READY_FOR_ISSUANCE:
    "notification-status-ready",
  ISSUED: "notification-status-issued",
  DELIVERY_IN_PROGRESS:
    "notification-status-delivery",
  DELIVERED:
    "notification-status-delivered",
  ACKNOWLEDGED:
    "notification-status-acknowledged",
  FAILED:
    "notification-status-failed",
  CANCELLED:
    "notification-status-cancelled",
};

const priorityClass: Record<
  NotificationRecord["priority"],
  string
> = {
  LOW: "notification-priority-low",
  NORMAL: "notification-priority-normal",
  HIGH: "notification-priority-high",
  URGENT: "notification-priority-urgent",
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function formatDateTime(
  value: string | null,
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

function getNotificationTypeLabel(
  notification: NotificationRecord,
): string {
  return notification.type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function getLatestDelivery(
  notification: NotificationRecord,
) {
  if (
    notification.deliveryAttempts
      .length === 0
  ) {
    return null;
  }

  return notification.deliveryAttempts[
    notification.deliveryAttempts.length - 1
  ];
}

function getChannelIcon(
  channel:
    | NotificationRecord["deliveryAttempts"][number]["channel"]
    | undefined,
) {
  switch (channel) {
    case "SMS":
      return <Smartphone size={15} />;

    case "EMAIL":
      return <Mail size={15} />;

    case "WHATSAPP":
      return <MessageSquare size={15} />;

    case "PORTAL":
      return <Bell size={15} />;

    default:
      return <Send size={15} />;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "ALL" | NotificationStatus
    >("ALL");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState<
    "ALL" |
    NotificationRecord["priority"]
  >("ALL");

  const [selectedId, setSelectedId] =
    useState<string | null>(
      "NOTIF-001",
    );

  const notifications = useMemo(
    () => getAllNotifications(),
    [],
  );

  const summary = useMemo(
    () => getNotificationSummary(),
    [],
  );

  const filteredNotifications =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return notifications.filter(
        (notification) => {
          if (
            statusFilter !== "ALL" &&
            notification.status !==
              statusFilter
          ) {
            return false;
          }

          if (
            priorityFilter !== "ALL" &&
            notification.priority !==
              priorityFilter
          ) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const searchableText = [
            notification.title,
            notification.message,
            notification.notificationReference,
            notification.recipient.name,
            notification.caseReference ??
              "",
            notification.projectId ?? "",
            notification.parcelId ?? "",
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch,
          );
        },
      );
    }, [
      notifications,
      searchTerm,
      statusFilter,
      priorityFilter,
    ]);

  const selectedNotification =
    useMemo(() => {
      if (!selectedId) {
        return (
          filteredNotifications[0] ??
          null
        );
      }

      return (
        filteredNotifications.find(
          (notification) =>
            notification.id ===
            selectedId,
        ) ??
        filteredNotifications[0] ??
        null
      );
    }, [
      filteredNotifications,
      selectedId,
    ]);

  const latestDelivery =
    selectedNotification
      ? getLatestDelivery(
          selectedNotification,
        )
      : null;

  return (
    <div className="notification-workspace">
      <div className="notification-page-header">
        <div>
          <div className="notification-eyebrow">
            COMMUNICATION MANAGEMENT
          </div>

          <h1>
            Notifications & Communication
          </h1>

          <p>
            Manage acquisition-related
            notifications, delivery status,
            acknowledgements, and citizen
            communication records.
          </p>
        </div>

        <div className="notification-header-actions">
          <button
            type="button"
            className="notification-delivery-navigation-button"
            onClick={() =>
              navigate(
                "/app/notifications/delivery",
              )
            }
          >
            <Send size={16} />

            <span>
              Delivery & Acknowledgement
            </span>

            <ArrowRight size={15} />
          </button>

          <div className="notification-header-badge">
            <ShieldAlert size={17} />

            <span>
              Controlled communication
            </span>
          </div>
        </div>
      </div>

      <section className="notification-metrics">
        <div className="notification-metric-card">
          <div className="notification-metric-icon">
            <Bell size={19} />
          </div>

          <div>
            <span>
              Total notifications
            </span>

            <strong>
              {summary.total}
            </strong>
          </div>
        </div>

        <div className="notification-metric-card">
          <div className="notification-metric-icon">
            <Send size={19} />
          </div>

          <div>
            <span>
              Pending delivery
            </span>

            <strong>
              {summary.pendingDelivery}
            </strong>
          </div>
        </div>

        <div className="notification-metric-card">
          <div className="notification-metric-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Acknowledged</span>

            <strong>
              {summary.acknowledged}
            </strong>
          </div>
        </div>

        <div className="notification-metric-card notification-metric-warning">
          <div className="notification-metric-icon">
            <AlertCircle size={19} />
          </div>

          <div>
            <span>
              Failed delivery
            </span>

            <strong>
              {summary.failed}
            </strong>
          </div>
        </div>

        <div className="notification-metric-card">
          <div className="notification-metric-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>
              Awaiting acknowledgement
            </span>

            <strong>
              {
                summary.acknowledgementRequired
              }
            </strong>
          </div>
        </div>
      </section>

      <section className="notification-filter-bar">
        <div className="notification-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search notification, case, project, parcel or recipient..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value,
              )
            }
            aria-label="Search notifications"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "ALL"
                | NotificationStatus,
            )
          }
          aria-label="Filter by status"
        >
          <option value="ALL">
            All statuses
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
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(
              event.target.value as
                | "ALL"
                | NotificationRecord["priority"],
            )
          }
          aria-label="Filter by priority"
        >
          <option value="ALL">
            All priorities
          </option>

          <option value="URGENT">
            Urgent
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="NORMAL">
            Normal
          </option>

          <option value="LOW">
            Low
          </option>
        </select>

        <div className="notification-result-count">
          {filteredNotifications.length}{" "}
          records
        </div>
      </section>

      <section className="notification-content-grid">
        <div className="notification-list-panel">
          <div className="notification-list-header">
            <div>
              <span className="notification-section-label">
                COMMUNICATION QUEUE
              </span>

              <h2>
                Notification records
              </h2>
            </div>

            <span className="notification-list-count">
              {
                filteredNotifications.length
              }
            </span>
          </div>

          <div className="notification-list">
            {filteredNotifications.map(
              (notification) => {
                const delivery =
                  getLatestDelivery(
                    notification,
                  );

                const isSelected =
                  selectedNotification?.id ===
                  notification.id;

                return (
                  <button
                    key={notification.id}
                    type="button"
                    className={`notification-list-item ${
                      isSelected
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedId(
                        notification.id,
                      )
                    }
                  >
                    <div className="notification-list-item-top">
                      <span
                        className={`notification-priority-dot ${
                          priorityClass[
                            notification.priority
                          ]
                        }`}
                      />

                      <span className="notification-reference">
                        {
                          notification.notificationReference
                        }
                      </span>

                      <span
                        className={`notification-status-pill ${
                          statusClass[
                            notification.status
                          ]
                        }`}
                      >
                        {
                          statusLabels[
                            notification.status
                          ]
                        }
                      </span>
                    </div>

                    <strong>
                      {notification.title}
                    </strong>

                    <p>
                      {notification.message}
                    </p>

                    <div className="notification-list-meta">
                      <span>
                        <User size={13} />

                        {
                          notification
                            .recipient.name
                        }
                      </span>

                      <span>
                        {getNotificationTypeLabel(
                          notification,
                        )}
                      </span>

                      {delivery && (
                        <span>
                          {getChannelIcon(
                            delivery.channel,
                          )}

                          {delivery.status
                            .replaceAll(
                              "_",
                              " ",
                            )
                            .toLowerCase()}
                        </span>
                      )}
                    </div>
                  </button>
                );
              },
            )}

            {filteredNotifications.length ===
              0 && (
              <div className="notification-empty">
                <Bell size={30} />

                <strong>
                  No notifications found
                </strong>

                <p>
                  Try changing the search
                  term or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="notification-detail-panel">
          {selectedNotification ? (
            <>
              <div className="notification-detail-header">
                <div>
                  <span className="notification-section-label">
                    NOTIFICATION DETAIL
                  </span>

                  <h2>
                    {
                      selectedNotification.title
                    }
                  </h2>

                  <span className="notification-reference">
                    {
                      selectedNotification.notificationReference
                    }
                  </span>
                </div>

                <span
                  className={`notification-status-pill ${
                    statusClass[
                      selectedNotification.status
                    ]
                  }`}
                >
                  {
                    statusLabels[
                      selectedNotification.status
                    ]
                  }
                </span>
              </div>

              <div className="notification-detail-alert">
                <div
                  className={`notification-detail-priority ${
                    priorityClass[
                      selectedNotification.priority
                    ]
                  }`}
                >
                  {
                    selectedNotification.priority
                  }
                </div>

                <p>
                  {
                    selectedNotification.message
                  }
                </p>
              </div>

              <div className="notification-detail-section">
                <span className="notification-section-label">
                  RECIPIENT
                </span>

                <div className="notification-recipient-card">
                  <div className="notification-avatar">
                    <User size={18} />
                  </div>

                  <div>
                    <strong>
                      {
                        selectedNotification
                          .recipient.name
                      }
                    </strong>

                    <span>
                      {selectedNotification
                        .recipient
                        .audience
                        .replaceAll(
                          "_",
                          " ",
                        )
                        .toLowerCase()}
                    </span>

                    <small>
                      {selectedNotification
                        .recipient
                        .mobileNumberMasked ??
                        "Mobile not recorded"}{" "}
                      ·{" "}
                      {selectedNotification
                        .recipient
                        .emailMasked ??
                        "Email not recorded"}
                    </small>
                  </div>
                </div>
              </div>

              <div className="notification-detail-section">
                <span className="notification-section-label">
                  LINKED RECORDS
                </span>

                <div className="notification-reference-grid">
                  {selectedNotification.references.map(
                    (reference) => (
                      <div
                        key={`${reference.type}-${reference.id}`}
                        className="notification-reference-card"
                      >
                        <div>
                          {reference.type ===
                          "DOCUMENT" ? (
                            <FileText
                              size={16}
                            />
                          ) : reference.type ===
                            "PARCEL" ? (
                            <MapPin
                              size={16}
                            />
                          ) : (
                            <FileText
                              size={16}
                            />
                          )}
                        </div>

                        <span>
                          {reference.type.replaceAll(
                            "_",
                            " ",
                          )}
                        </span>

                        <strong>
                          {
                            reference.displayReference
                          }
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="notification-detail-grid">
                <div>
                  <span>Issued</span>

                  <strong>
                    {formatDateTime(
                      selectedNotification.issuedAt,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Scheduled</span>

                  <strong>
                    {formatDateTime(
                      selectedNotification
                        .scheduledAt,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Acknowledged</span>

                  <strong>
                    {formatDateTime(
                      selectedNotification
                        .acknowledgedAt,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Source</span>

                  <strong>
                    {selectedNotification.source
                      .replaceAll(
                        "_",
                        " ",
                      )
                      .toLowerCase()}
                  </strong>
                </div>
              </div>

              {selectedNotification
                .acknowledgementRequired && (
                <div className="notification-deadline">
                  <Clock3 size={17} />

                  <div>
                    <span>
                      Acknowledgement
                      required
                    </span>

                    <strong>
                      Deadline:{" "}
                      {formatDateTime(
                        selectedNotification
                          .acknowledgementDeadline,
                      )}
                    </strong>
                  </div>
                </div>
              )}

              <div className="notification-detail-section">
                <span className="notification-section-label">
                  DELIVERY HISTORY
                </span>

                <div className="notification-delivery-list">
                  {selectedNotification
                    .deliveryAttempts.length >
                  0 ? (
                    selectedNotification.deliveryAttempts.map(
                      (attempt) => (
                        <div
                          key={attempt.id}
                          className="notification-delivery-row"
                        >
                          <div className="notification-delivery-channel">
                            {getChannelIcon(
                              attempt.channel,
                            )}

                            <div>
                              <strong>
                                {
                                  attempt.channel
                                }
                              </strong>

                              <span>
                                Attempted{" "}
                                {formatDateTime(
                                  attempt.attemptedAt,
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="notification-delivery-status">
                            {attempt.status ===
                            "FAILED" ? (
                              <XCircle
                                size={16}
                              />
                            ) : (
                              <CheckCircle2
                                size={16}
                              />
                            )}

                            <span>
                              {attempt.status
                                .replaceAll(
                                  "_",
                                  " ",
                                )
                                .toLowerCase()}
                            </span>
                          </div>

                          {attempt.failureReason && (
                            <small>
                              {
                                attempt.failureReason
                              }
                            </small>
                          )}
                        </div>
                      ),
                  )
                  ) : (
                    <div className="notification-no-delivery">
                      <Send size={16} />

                      <span>
                        No delivery attempt
                        recorded yet.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {latestDelivery?.failureReason && (
                <div className="notification-failure">
                  <AlertCircle size={18} />

                  <div>
                    <strong>
                      Delivery requires
                      attention
                    </strong>

                    <p>
                      {
                        latestDelivery.failureReason
                      }
                    </p>
                  </div>
                </div>
              )}

              <div className="notification-detail-footer">
                <div>
                  <span>
                    Sensitivity
                  </span>

                  <strong>
                    {
                      selectedNotification.sensitivity
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Last updated
                  </span>

                  <strong>
                    {formatDate(
                      selectedNotification.updatedAt,
                    )}
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <div className="notification-empty">
              <Bell size={30} />

              <strong>
                Select a notification
              </strong>

              <p>
                Choose a record from the
                communication queue to view
                its details.
              </p>
            </div>
          )}
        </aside>
      </section>

      <div className="notification-demo-note">
        <ShieldAlert size={16} />

        <span>
          Demonstration communication data.
          Delivery channels are simulated and
          are not connected to live government
          messaging providers.
        </span>
      </div>
    </div>
  );
}